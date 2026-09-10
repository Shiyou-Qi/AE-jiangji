/**
 * 真实浏览器流程测试（无第三方依赖，直接用 CDP）。
 *
 * 校验的是「用户在页面上真的能完成一次降级」：
 *   打开转换器页 → 设置文件输入 → 点「开始降级」→ 等到成功卡片 → 读出下载链接
 *
 * 为什么值得单独写：前面 test/e2e.js 验的是接口，接口通了不代表
 * 上传控件的 change 事件、React 状态、下载链接的 token 拼装都通。
 *
 * 用法：
 *   node src/server/index.js &     # 引擎
 *   npm run dev &                  # 站点
 *   node test/browser-flow.js
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const PORT = Number(process.env.CDP_PORT || 9333);
const SAMPLE = process.env.FILE || 'C:/Users/User/Downloads/测试版本2024.prproj';
/** 置 SHOT=out/shots/xxx.png 可把成功态截下来 */
const SHOT = process.env.SHOT || '';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

let pass = 0;
let fail = 0;
const log = (ok, name, detail = '') => {
  if (ok) pass++;
  else fail++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ────────────────────── 极简 CDP 客户端 ────────────────────── */

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 超时：${method}`));
        }
      }, 30000);
    });
  }

  /** 在页面里求值，返回 JSON 化的结果 */
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description || '页面内求值异常');
    }
    return r.result?.value;
  }

  /** 轮询直到表达式为真 */
  async waitFor(expression, timeoutMs = 25000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        if (await this.eval(expression)) return true;
      } catch {
        /* 页面还没准备好，继续等 */
      }
      await sleep(200);
    }
    return false;
  }
}

/* ────────────────────── 主流程 ────────────────────── */

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('找不到 Chrome / Edge，无法运行浏览器测试。');
  process.exit(2);
}
if (!existsSync(SAMPLE)) {
  console.error(`找不到样本工程：${SAMPLE}`);
  process.exit(2);
}

const userDataDir = await mkdtemp(path.join(tmpdir(), 'dg-cdp-'));
const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let cdp = null;
try {
  // 等调试端口起来
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(300);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl || null;
    } catch {
      /* 还没起来 */
    }
  }
  if (!wsUrl) throw new Error('无法连接 Chrome 调试端口');

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('WebSocket 连接失败')), { once: true });
  });
  cdp = new CDP(ws);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');
  // 固定视口，保证截图与桌面端一致
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1180,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const url = `${SITE}/zh/premiere-pro-downgrader`;
  console.log(`\n【浏览器真实流程】${url}`);
  console.log(`  样本：${path.basename(SAMPLE)}\n`);

  await cdp.send('Page.navigate', { url });

  log(await cdp.waitFor('document.readyState === "complete"'), '页面加载完成');
  log(
    await cdp.waitFor('!!document.querySelector("input[type=file]")'),
    '上传控件已挂载'
  );
  log(
    await cdp.waitFor('document.querySelectorAll("select option").length > 5'),
    '版本列表已从引擎载入'
  );

  // 引擎状态徽标必须真的有字
  const badge = await cdp.eval('document.querySelector(".conv__head .tag")?.textContent || ""');
  log(badge.trim().length > 0, `引擎状态徽标有文案`, `"${badge}"`);

  // 选目标版本
  const targetSet = await cdp.eval(`
    (() => {
      const sel = document.querySelector('select');
      const opt = [...sel.options].find(o => o.value === '2021');
      if (!opt) return null;
      sel.value = '2021';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return sel.value;
    })()
  `);
  log(targetSet === '2021', '目标版本可选到 2021', String(targetSet));

  // 设置文件（CDP 会触发 change，React 因之收到 state 更新）
  const doc = await cdp.send('DOM.getDocument', { depth: -1 });
  const node = await cdp.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: 'input[type=file]',
  });
  log(node.nodeId > 0, '定位到 file input');
  await cdp.send('DOM.setFileInputFiles', { files: [SAMPLE], nodeId: node.nodeId });

  const picked = await cdp.waitFor('!!document.querySelector(".filebar__name")');
  const pickedName = picked
    ? await cdp.eval('document.querySelector(".filebar__name").textContent')
    : '';
  log(picked, '文件已进入界面', pickedName);

  // 点开始降级
  const clicked = await cdp.eval(
    '(() => { const b = document.querySelector(".conv__go"); if (!b || b.disabled) return false; b.click(); return true; })()'
  );
  log(clicked, '点击「开始降级」');

  // 等成功卡片
  const done = await cdp.waitFor('!!document.querySelector(".done")', 40000);
  log(done, '出现转换完成卡片');

  if (done) {
    const info = await cdp.eval(`
      (() => {
        const link = document.querySelector(".done__acts a");
        const kvs = [...document.querySelectorAll(".kv > div")].map(d => [
          d.querySelector("dt")?.textContent || "",
          d.querySelector("dd")?.textContent || "",
        ]);
        return {
          file: document.querySelector(".done__m")?.textContent || "",
          href: link?.getAttribute("href") || "",
          download: link?.getAttribute("download") || "",
          kvs,
          logs: document.querySelectorAll(".logs li").length,
        };
      })()
    `);

    log(info.file.includes('_2021') || info.download.includes('_2021'), '结果文件名含目标版本', info.file);
    log(info.href.startsWith('/api/download?token='), '下载链接带 token', info.href.slice(0, 46));
    log(info.logs === 0, '结果页不展示转换日志', `${info.logs} 条`);
    log(
      info.kvs.some(([, v]) => v.includes('Premiere Pro 2021')),
      '结果卡片显示目标版本',
      JSON.stringify(info.kvs[0] || [])
    );

    // 用页面里的链接真下载一次
    const dl = await cdp.eval(`
      (async () => {
        const href = document.querySelector(".done__acts a").getAttribute("href");
        const res = await fetch(href);
        const buf = new Uint8Array(await res.arrayBuffer());
        return { status: res.status, len: buf.length, b0: buf[0], b1: buf[1] };
      })()
    `);
    log(dl.status === 200, '浏览器内下载返回 200', `HTTP ${dl.status}`);
    log(dl.b0 === 0x1f && dl.b1 === 0x8b, '下载内容是 gzip 工程', `${dl.b0} ${dl.b1}`);
    log(dl.len > 1000, '下载体积合理', `${dl.len} B`);
  }

  // 顺带看一眼错误分支的界面表现
  const errShown = await cdp.eval(`
    (() => {
      document.querySelectorAll("details").forEach(d => d.open = true);
      return document.querySelectorAll(".faq__item").length;
    })()
  `);
  log(errShown > 0, '页面下方问答可展开', `${errShown} 条`);

  if (SHOT) {
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
  try {
    cdp?.ws.close();
  } catch {}
  child.kill();
  await sleep(400);
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}

console.log(`\n${'─'.repeat(52)}`);
console.log(`  通过 ${pass}　失败 ${fail}`);
console.log(`${'─'.repeat(52)}\n`);
process.exit(fail ? 1 : 0);
