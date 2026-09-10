/**
 * 测试用的极简 CDP 客户端（零依赖）。
 * 用 Node 内置的 WebSocket 直连 Chrome，不引入 puppeteer / playwright。
 *
 * 为什么不用聚合框架：本项目需要的东西很少（导航、求值、设置文件、截图），
 * 自己写反而更可读，也不会因为 Chromium 版本与框架预期不一致而卡住。
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function findChrome() {
  return CHROME_CANDIDATES.find((p) => existsSync(p)) || null;
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    /** 事件订阅表：{ [method]: handler } */
    this.listeners = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
        return;
      }
      if (msg.method && this.listeners.has(msg.method)) {
        this.listeners.get(msg.method)(msg.params);
      }
    });
  }

  /** 订阅一个 CDP 事件，例如 Network.requestWillBeSent */
  on(method, handler) {
    this.listeners.set(method, handler);
  }

  /** 取消订阅 */
  off(method) {
    this.listeners.delete(method);
  }

  send(method, params = {}, timeoutMs = 30000) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 超时：${method}`));
        }
      }, timeoutMs);
    });
  }

  /** 在页面里求值并取回可序列化结果 */
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
        /* 页面尚未就绪，继续等 */
      }
      await sleep(180);
    }
    return false;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  async screenshot(filePath, { fullPage = false } = {}) {
    const { writeFile } = await import('node:fs/promises');
    const shot = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: fullPage,
    });
    await writeFile(filePath, Buffer.from(shot.data, 'base64'));
    return filePath;
  }
}

/**
 * 启动 headless Chrome 并接上 CDP。
 * @param {{ port?: number, width?: number, height?: number }} opts
 */
export async function launch({ port = 9333, width = 1440, height = 1000 } = {}) {
  const chromePath = findChrome();
  if (!chromePath) throw new Error('找不到 Chrome / Edge');

  const userDataDir = await mkdtemp(path.join(tmpdir(), 'dg-cdp-'));
  const child = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl || null;
    } catch {
      /* 端口还没起来 */
    }
  }
  if (!wsUrl) {
    child.kill();
    throw new Error('无法连接 Chrome 调试端口');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('WebSocket 连接失败')), { once: true });
  });

  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');
  await cdp.setViewport(width, height);

  const close = async () => {
    try {
      ws.close();
    } catch {}
    child.kill();
    await sleep(350);
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  };

  return { cdp, close };
}
