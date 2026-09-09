# 部署说明

项目结构：`webapp/` 是 Next.js 14 静态导出站点（`output: 'export'`，构建产物在 `webapp/out`）。

## Cloudflare Pages

如果 Cloudflare 报错 `Could not detect a directory containing static files`，说明 Pages 没拿到静态输出目录。仓库根目录已提供 `wrangler.toml`：

```toml
name = "ae-jiangji"
pages_build_output_dir = "webapp/out"
```

Cloudflare Pages 连接 GitHub 时推荐使用以下设置：

| 项 | 值 |
| --- | --- |
| Framework preset | Next.js 或 None |
| Root directory | 留空 |
| Build command | `cd webapp && npm install && npm run build` |
| Build output directory | `webapp/out` |
| Environment variable | `NEXT_PUBLIC_SITE_URL=https://www.aeback.com` |

重要：不要在 Cloudflare 的 Deploy command 里填写 `wrangler deploy`。这个命令用于 Workers，会报：

```text
Missing entry-point to Worker script or to assets directory
```

仓库里的 `wrangler.toml` 已经加入 `[assets] directory = "webapp/out"` 作为兜底，所以即使误跑 `wrangler deploy` 也能找到静态资源目录。但如果你创建的是 Cloudflare Pages 项目，仍然建议改成 Pages 命令。

如果 Cloudflare 要求填写 Deploy command，请使用 Pages 命令：

```bash
npx wrangler pages deploy webapp/out --project-name=ae-jiangji
```

如果把 Cloudflare 的 Root directory 设置为 `webapp`，则对应改为：

| 项 | 值 |
| --- | --- |
| Root directory | `webapp` |
| Build command | `npm install && npm run build` |
| Build output directory | `out` |

这种情况下 Deploy command 应写：

```bash
npx wrangler pages deploy out --project-name=ae-jiangji
```

不要把输出目录留空，否则 Wrangler 无法自动判断 Next 静态导出的 `out` 目录。

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
| `NEXT_PUBLIC_SITE_URL` | `https://www.aeback.com` | 用于 canonical / hreflang / OG / sitemap 的绝对地址，换域名时必须改 |

## 部署后自检

```bash
curl -I https://www.aeback.com/          # 200
curl -I https://www.aeback.com/en/      # 200
curl -I https://www.aeback.com/sitemap.xml  # 200
curl -s https://www.aeback.com/ | grep canonical
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
