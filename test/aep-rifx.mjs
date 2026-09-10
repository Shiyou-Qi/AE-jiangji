/**
 * AEP (RIFX) 结构 dump + 两份文件的结构化 diff。
 * 目的：判断降级变换的真实规模 —— 是"改几个字节"还是"重建整棵 chunk 树"。
 */
import fs from 'node:fs';

const FILES = {
  'AE2021(源)': 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2021.aep',
  'AE2018(降级产物)': 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2021_AE2018.aep',
  'AE2018(原生导出)': 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2018.aep',
  'AE2022(源)': 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2022.aep',
};

/** 解析 RIFX：容器块是 `LIST`/`CAT ` 等，普通块直接跟数据 */
function parse(buf, start, end, depth = 0, out = [], prefix = '') {
  let p = start;
  while (p + 8 <= end) {
    const id = buf.toString('latin1', p, p + 4);
    const size = buf.readUInt32BE(p + 4);
    const dataStart = p + 8;
    const dataEnd = dataStart + size;
    if (dataEnd > end || size < 0) {
      out.push({ depth, id: `!!bad(${id})`, size: end - p, path: prefix, offset: p });
      break;
    }
    const isList = id === 'LIST' || id === 'CAT ';
    if (isList) {
      const form = buf.toString('latin1', dataStart, dataStart + 4);
      out.push({ depth, id: `LIST[${form}]`, size, path: prefix, offset: p, list: true });
      parse(buf, dataStart + 4, dataEnd, depth + 1, out, `${prefix}/${form}`);
    } else {
      out.push({ depth, id, size, path: prefix, offset: p });
    }
    p = dataEnd + (size & 1); // 偶数对齐
  }
  return out;
}

function load(file) {
  const buf = fs.readFileSync(file);
  const magic = buf.toString('latin1', 0, 4);
  const form = buf.toString('latin1', 8, 12);
  const chunks = parse(buf, 12, buf.length, 0);
  return { buf, magic, form, chunks };
}

const loaded = {};
for (const [name, file] of Object.entries(FILES)) {
  try {
    loaded[name] = load(file);
    const { buf, magic, form, chunks } = loaded[name];
    console.log(`${name}: magic=${magic} form=${form} bytes=${buf.length} topChunks=${chunks.filter((c) => c.depth === 0).length} allChunks=${chunks.length}`);
  } catch (e) {
    console.log(`${name}: 读取失败 ${e.message}`);
  }
}

console.log('\n=== 顶层块序列对比（id:size）===');
const names = Object.keys(loaded);
for (const n of names) {
  const top = loaded[n].chunks.filter((c) => c.depth === 0);
  console.log(`\n[${n}] (${top.length} 块)`);
  console.log('  ' + top.map((c) => `${c.id}:${c.size}`).join('\n  '));
}
