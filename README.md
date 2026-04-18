# absent-apogee（Astro 站点）

本目录为 **单垂直构建** 的 Astro 6 项目：通过环境变量 `ACTIVE_COLLECTION` 指向 `src/content/<collection>/` 下已生成的 Markdown（由仓库根目录 Go 生成器写入）。

父仓库说明与命令总览见 **[../README.md](../README.md)**；流水线与扩展清单见 **[../docs/CONTENT_PIPELINE.md](../docs/CONTENT_PIPELINE.md)**。

## 环境变量

| 变量 | 说明 |
|------|------|
| `ACTIVE_COLLECTION` | 构建时集合名，须为 `active-collection.ts` 中 `ALLOWED` 之一（如 `siding-services`、`water-damage`）。 |
| `PUBLIC_*` | 见 `src/site-config.ts`：站点 URL、电话、垂直展示名等（Cloudflare Pages 上常用 Build 变量配置）。 |

未设置 `ACTIVE_COLLECTION` 时，本地行为以 `active-collection.ts` 内默认逻辑为准（当前默认集合为 `roofing`）。

## 命令（在 `absent-apogee/` 下执行）

```powershell
npm install
```

按垂直开发（示例）：

```powershell
npm run dev:siding-services
npm run dev:water-damage
```

按垂直生产构建（输出 `./dist/`）：

```powershell
npm run build:siding-services
npm run build:water-damage
npm run build:roofing
```

构建完成后，可在本目录运行（脚本会 `cd ..` 到仓库根再执行 Go）：

```powershell
npm run diversity:soft
```

对 `dist` 下 HTML 抽样计算平均 Jaccard；`-no-fail` 表示超默认 30% 告警阈值仍返回退出码 0。

## 内容与路由

- 城市页路由由 `[...slug].astro` 与 content collection slug 驱动；slug 格式与 Go 输出文件名（去扩展名）一致，例如 `siding-services-{city}-{state}-{zip}`。
- FAQ、Schema、RelatedCities 等逻辑见 `src/lib/seo.ts`、`src/components/RelatedCities.astro`。

## 官方 Astro 文档

- [Astro 文档](https://docs.astro.build)
- 若需 CLI 帮助：`npm run astro -- --help`
