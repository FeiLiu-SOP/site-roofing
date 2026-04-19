// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import { remarkStripRoutingMarkers } from "./src/remark-strip-routing-markers.mjs";
import { resolvePublicSiteUrl } from "./resolve-public-site-url.mjs";
import {
  augmentHubPathForMainSite,
  toAstroSiteAndBase,
} from "./hub-site-path.mjs";

const fallbackSite = "https://la-roofing-v1.pages.dev";

// 必须用「对象形式」导出 config，保证 `site` 在集成阶段已存在；
// 若用 defineConfig(({ mode }) => …) 回调，在 Astro 6 下 @astrojs/sitemap 可能读不到 site，导致不生成 *.xml，
// Cloudflare 再把不存在的 /sitemap-index.xml 回退成首页 HTML。
const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const fileEnv = loadEnv(mode, process.cwd(), "");
const activeCollection =
  process.env.ACTIVE_COLLECTION ?? fileEnv.ACTIVE_COLLECTION ?? "roofing";
const disableAugment =
  process.env.PUBLIC_AUTO_SITEMAP_PATH ?? fileEnv.PUBLIC_AUTO_SITEMAP_PATH;
// 构建层只用 PUBLIC_SITE_URL（*.pages.dev）：若把 CANONICAL 一并传入，会算出 Hub base 但产物仍在 dist 根目录，与旧站不一致。
const fullSiteUrl = augmentHubPathForMainSite(
  resolvePublicSiteUrl({
    site: process.env.PUBLIC_SITE_URL ?? fileEnv.PUBLIC_SITE_URL,
    canonical: undefined,
    fallback: fallbackSite,
  }),
  activeCollection,
  disableAugment
);
const { site } = toAstroSiteAndBase(fullSiteUrl, activeCollection);
// Rockwell Worker 回源剥 /roofing；内链须 /roofing/...，与 canonical（见 .env PUBLIC_CANONICAL_ORIGIN）一致。nest 脚本把 dist 对齐到该前缀。
const enforcedBase = "/roofing/";

// https://astro.build/config
export default defineConfig({
  site,
  base: enforcedBase,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkStripRoutingMarkers],
  },
});
