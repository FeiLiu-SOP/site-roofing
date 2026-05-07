/**
 * Cloudflare Pages 等环境可能复用构建缓存，导致 `.astro` 内容集合索引滞后于 Git 中的 .md。
 * 在 `npm run build` 前执行，避免 frontmatter（如 zillowHomeValueUsd）已更新但 HTML 仍按旧 schema 生成。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const name of [".astro", "dist"]) {
  const p = path.join(root, name);
  try {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`[clean-build-cache] removed ${name}/`);
  } catch (e) {
    console.warn(`[clean-build-cache] skip ${name}:`, (e && e.message) || e);
  }
}
