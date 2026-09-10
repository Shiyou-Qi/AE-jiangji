/**
 * After Effects 转换器的真实浏览器流程测试（CDP，零第三方依赖）。
 *
 * 与 Pr 那条流程最大的不同：AE 是**纯客户端**转换，所以这里额外验证两件在
 * 服务端方案里做不到的事：
 *   1. 下载链接是 `blob:` 而不是服务端 token → 字节确实是在浏览器里生成的；
 *   2. 整条流程没有向 `/api/` 发起任何写请求 → 工程文件确实没有上传。
 *
 * 最后把浏览器里生成的字节取出来算 sha256，与「原生 AE 2018 导出」比对 ——
 * 这条断言意味着：经过上传控件、React 状态、Blob 封装这一整条 UI 链路之后，
 * 拿到的东西仍然与 Adobe 自己导出的结果逐字节一致。
 *
 * 用法：
 *   npm run dev &
 *   node test/browser-flow-ae.js
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

import { launch } from './cdp.js';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const PORT = Number(process.env.CDP_PORT || 9334);
const SAMPLE =
  process.env.FILE || 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2021.aep';
/** 置 SHOT=out/shots/xxx.png 可把成功态截下来 */
const SHOT = process.env.SHOT || '';

/** 原生 AE 2018 导出（= 我们的 2021→2018 期望结果）的 sha256 */
const NATIVE_AE2018_SHA256 =
  '854c2d20e3f87d72940d0ab8e565f2752490afd810217a7271555a526eee64f6';

let pass = 0;
let fail = 0;
const log = (ok, name, detail = '') => {
  if (ok) pass++;
  else fail++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

if (!existsSync(SAMPLE)) {
  console.error(`找不到 AEP 样本：${SAMPLE}`);
  process.exit(2);
}

let cdp;
let close;
try {
  ({ cdp, close } = await launch({ port: PORT, width: 1440, height: 1300 }));
} catch (e) {
  console.error(`浏览器启动失败：${e.message}`);
  process.exit(2);
}

/** 记录所有网络请求，用来证明「没有上传」 */
const requests = [];
await cdp.send('Network.enable');
cdp.on('Network.requestWillBeSent', (p) => {
  requests.push({ url: p.request.url, method: p.request.method });
});

try {
  const url = `${SITE}/zh/after-effects-downgrader`;
  console.log(`\n【AE 浏览器真实流程】${url}`);
  console.log(`  样本：${path.basename(SAMPLE)}\n`);

  await cdp.send('Page.navigate', { url });

  log(await cdp.waitFor('document.readyState === "complete"'), '页面加载完成');
  log(await cdp.waitFor('!!document.querySelector("input[type=file]")'), '上传控件已挂载');

  // 内核加载完成 —— 徽标会从「内核加载中」变成「9 个目标」
  const ready = await cdp.waitFor(
    'document.querySelector(".conv__head .tag")?.textContent?.includes("个目标")',
    30000
  );
  log(ready, '转换内核在浏览器内加载完成');
  const badge = await cdp.eval('document.querySelector(".conv__head .tag")?.textContent || ""');
  log(badge.includes('9'), `徽标显示了目标版本数`, `"${badge}"`);

  // 初始状态：没有文件时按钮不可点
  log(
    await cdp.eval('document.querySelector(".conv__go").disabled === true'),
    '未选文件时「开始降级」不可点'
  );

  // 注入真实文件
  const doc = await cdp.send('DOM.getDocument', { depth: -1 });
  const node = await cdp.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: 'input[type=file]',
  });
  log(node.nodeId > 0, '定位到 file input');
  await cdp.send('DOM.setFileInputFiles', { files: [SAMPLE], nodeId: node.nodeId });

  log(await cdp.waitFor('!!document.querySelector(".filebar__name")'), '文件已进入界面');
  const pickedName = await cdp.eval('document.querySelector(".filebar__name").textContent');
  log(pickedName.includes('.aep'), '文件名正确显示', pickedName);

  // 源版本识别
  const detected = await cdp.waitFor(
    'document.querySelector(".field__hint strong")?.textContent?.includes("AE 2021")',
    20000
  );
  log(detected, '自动识别出源版本 AE 2021');
  const detText = await cdp.eval('document.querySelector(".field__hint strong").textContent');
  log(detText.trim() === 'AE 2021', '源版本文案正确', detText);

  // 目标下拉必须只含「严格更旧」的版本
  const opts = await cdp.eval(`
    [...document.querySelectorAll("select option")].map(o => ({ v: o.value, t: o.textContent.trim() }))
  `);
  log(opts.length === 3, '目标版本被过滤为 3 个（AE 2018–2020）', JSON.stringify(opts.map((o) => o.t)));
  log(
    opts.every((o) => Number(o.v) < 18),
    '列表中不存在 >= 源版本的目标'
  );

  // 选 AE 2018 并转换
  const setTo = await cdp.eval(`
    (() => {
      const sel = document.querySelector("select");
      if (![...sel.options].some(o => o.value === "15")) return null;
      sel.value = "15";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      return sel.value;
    })()
  `);
  log(setTo === '15', '目标版本可选到 AE 2018');

  const clicked = await cdp.eval(
    '(() => { const b = document.querySelector(".conv__go"); if (!b || b.disabled) return false; b.click(); return true; })()'
  );
  log(clicked, '点击「开始降级」');

  const done = await cdp.waitFor('!!document.querySelector(".done")', 40000);
  log(done, '出现降级完成卡片');

  if (done) {
    const info = await cdp.eval(`
      (() => {
        const link = document.querySelector(".done__acts a");
        return {
          file: document.querySelector(".done__m")?.textContent || "",
          href: link?.getAttribute("href") || "",
          download: link?.getAttribute("download") || "",
          kvs: [...document.querySelectorAll(".kv > div")].map(d => [
            d.querySelector("dt")?.textContent || "",
            d.querySelector("dd")?.textContent || "",
          ]),
          logs: document.querySelectorAll(".logs li").length,
          text: document.querySelector(".conv")?.innerText || "",
        };
      })()
    `);

    log(info.file.endsWith('_AE2018.aep'), '输出文件名带目标版本', info.file);
    log(info.download === info.file, 'download 属性与文件名一致');
    const kvFlat = info.kvs.map(([k, v]) => `${k}:${v}`).join(' | ');
    log(/AE 2021/.test(kvFlat) && /AE 2018/.test(kvFlat), '结果卡片显示 AE 2021 → AE 2018', kvFlat.slice(0, 70));
    log(info.logs === 0, '结果页不展示引擎处理明细', `${info.logs} 条`);
    log(
      !/legacy chunks|CIF3|OvdG|RIFX|重建|内核/.test(info.text),
      '结果页不暴露内部实现细节',
      (info.text.match(/legacy chunks|CIF3|OvdG|RIFX|重建|内核/) || [''])[0]
    );

    // ① 下载链接必须是本地 blob —— 证明字节是浏览器生成的
    log(info.href.startsWith('blob:'), '下载链接是本地 blob URL（非服务端 token）', info.href.slice(0, 34));

    // ② 取回字节并算 sha256，与原生 AE 2018 导出比对
    const bytes = await cdp.eval(`
      (async () => {
        const href = document.querySelector(".done__acts a").getAttribute("href");
        const buf = new Uint8Array(await (await fetch(href)).arrayBuffer());
        const hash = await crypto.subtle.digest("SHA-256", buf);
        const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
        return { len: buf.length, magic: String.fromCharCode(buf[0], buf[1], buf[2], buf[3]), form: String.fromCharCode(buf[8], buf[9], buf[10], buf[11]), hex };
      })()
    `);
    log(bytes.magic === 'RIFX' && bytes.form === 'Egg!', '产物是合法 RIFX/Egg! 容器', `${bytes.magic}/${bytes.form}`);
    log(bytes.len > 1000, '产物体积合理', `${bytes.len} B`);
    log(
      bytes.hex === NATIVE_AE2018_SHA256,
      '★ 浏览器产物与原生 AE 2018 导出逐字节一致',
      bytes.hex.slice(0, 16)
    );

    // ③ 全程没有上传
    const writes = requests.filter(
      (r) => r.method !== 'GET' || /\/api\/(convert|download)/.test(r.url)
    );
    log(
      writes.length === 0,
      '整条流程没有任何写请求（文件未上传）',
      writes.length ? JSON.stringify(writes.slice(0, 3)) : `共 ${requests.length} 个请求，全是静态资源`
    );
  }

  // 问答区
  const faq = await cdp.eval(`
    (() => {
      document.querySelectorAll("details").forEach(d => d.open = true);
      return document.querySelectorAll(".faq__item").length;
    })()
  `);
  log(faq > 0, '页面下方问答可展开', `${faq} 条`);

  if (SHOT) {
    const { writeFile } = await import('node:fs/promises');
    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    await writeFile(SHOT, Buffer.from(shot.data, 'base64'));
    console.log(`\n  截图已保存：${SHOT}`);
  }
} catch (err) {
  log(false, '浏览器流程', String(err.message || err));
} finally {
  await close();
}

console.log(`\n${'─'.repeat(52)}`);
console.log(`  通过 ${pass}　失败 ${fail}`);
console.log(`${'─'.repeat(52)}\n`);
process.exit(fail ? 1 : 0);
