// 既存の data/works.json と public/ 内の作品画像・MP3 を Vercel Blob へ移行する。
// 何度実行しても同じ結果になる（同じパスに上書き）。
//
// 使い方:
//   1. Vercel で Blob ストアを作成し、プロジェクトに接続
//   2. vercel env pull .env.local   （BLOB_READ_WRITE_TOKEN を取得）
//   3. node --env-file=.env.local scripts/migrate-to-blob.mjs
//
// 注意: すでにアドミンから Blob に保存したデータがある場合、それを上書きします。
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN が見つかりません。.env.local を確認してください。");
  process.exit(1);
}

const root = process.cwd();
const isUrl = (s) => /^https?:\/\//.test(s);
const data = JSON.parse(await readFile(path.join(root, "data/works.json"), "utf-8"));

async function uploadFile(localPath, pathname) {
  const body = await readFile(localPath);
  const blob = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    multipart: body.length > 5 * 1024 * 1024,
  });
  console.log(`  ✓ ${pathname}`);
  return blob.url;
}

// 同じファイルを複数作品で使っていても1回だけアップロード
const cache = new Map();
async function migrate(filename, localDir, blobDir) {
  if (!filename || isUrl(filename)) return filename;
  const localPath = path.join(root, localDir, filename);
  if (!existsSync(localPath)) {
    console.warn(`  ! 見つかりません: ${localDir}/${filename}（そのまま残します）`);
    return filename;
  }
  if (!cache.has(localPath)) cache.set(localPath, await uploadFile(localPath, `${blobDir}/${filename}`));
  return cache.get(localPath);
}

console.log("MUSIC WORKS");
for (const w of data.musicWorks ?? []) w.filename = await migrate(w.filename, "public/images/MUSIC WORKS", "images/music");
console.log("DESIGN WORKS");
for (const w of data.designWorks ?? []) w.filename = await migrate(w.filename, "public/images/DESIGN WORKS", "images/design");
console.log("PLAYER");
// 旧形式（1曲だけの playerTrack）をプレイリスト形式に変換
if (!data.playerTracks && data.playerTrack) {
  data.playerTracks = [{ ...data.playerTrack, enabled: true }];
  delete data.playerTrack;
}
for (const t of data.playerTracks ?? []) t.mp3Filename = await migrate(t.mp3Filename, "public/music", "music");
// プレイリストで未使用の MP3 もライブラリ（Blob の music/）に入れておく
for (const name of await readdir(path.join(root, "public/music")).catch(() => [])) {
  if (/\.(mp3|m4a|wav|ogg)$/i.test(name)) await migrate(name, "public/music", "music");
}

const json = await put("data/works.json", JSON.stringify(data, null, 2), {
  access: "public",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  cacheControlMaxAge: 60,
});
console.log(`\n完了: ${json.url}`);
