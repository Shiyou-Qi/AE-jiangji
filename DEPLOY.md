# 部署说明（Vercel）

项目结构：`webapp/` 是 Next.js 14 静态导出站点（`output: 'export'`，构建产物在 `webapp/out`）。

## 方式一：Vercel 连接 GitHub（推荐）

1. Vercel 控制台 → 项目 → **Settings → Git** → 连接仓库 `ShiyouQi888/AE-jiangji`。
2. **Settings → General → Build & Output Settings** 二选一：

   **A. Root Directory 留空（使用仓库根 `vercel.json`）**

   | 项 | 值 |
   | --- | --- |
   | Framework Preset | Other |
   | Root Directory | （留空） |
   | Build Command | `cd webapp && npm install && npm run build` |
   | Output Directory | `webapp/out` |
   | Install Command | `cd webapp && npm install` |

   **B. Root Directory 设为 `webapp`（使用 `webapp/vercel.json`）**

   | 项 | 值 |
   | --- | --- |
   | Framework Preset | Other |
   | Root Directory | `webapp` |
   | Build Command | `npm run build` |
   | Output Directory | `out` |
   | Install Command | `npm install` |

   > 注意：在项目设置里手动填写过的值会覆盖 `vercel.json`，两边保持一致即可。

3. **Deployments** 页面点 Redeploy（勾选清空构建缓存更稳）。

## 方式二：Vercel CLI

```bash
cd webapp
npx vercel --prod
```

首次会要求登录并绑定项目。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://aejiangji.vercel.app` | 用于 canonical / hreflang / OG / sitemap 的绝对地址，换域名时必须改 |

## 部署后自检

```bash
curl -I https://aejiangji.vercel.app/          # 200
curl -I https://aejiangji.vercel.app/en/      # 200
curl -I https://aejiangji.vercel.app/sitemap.xml  # 200
curl -s https://aejiangji.vercel.app/ | grep canonical
```

预期产物结构（`webapp/out`）：

```
index.html          中文首页
en/index.html       英文页
404.html
sitemap.xml  robots.txt  manifest.webmanifest
og-zh.png  og-en.png  icon.svg  favicon.ico  apple-icon.png
wasm/aep_core.js  wasm/aep_core_bg.wasm     转换内核
_next/                                       静态资源
```
