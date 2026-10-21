// サーバー専用: Vercel Blob 上の data/works.json を読み込む
import { unstable_cache } from "next/cache";
import { fallbackSiteData, normalizeSiteData, type SiteData } from "@/lib/works";

export const DATA_PATHNAME = "data/works.json";
export const SITE_DATA_TAG = "site-data";

// BLOB_READ_WRITE_TOKEN = vercel_blob_rw_<storeId>_<secret> からストアの公開URLを組み立てる
export function blobBaseUrl(): string | null {
  if (process.env.BLOB_BASE_URL) return process.env.BLOB_BASE_URL.replace(/\/$/, "");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3];
  return storeId ? `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

// Blob から最新データを取得（失敗時は null）
export async function fetchSiteDataFromBlob(): Promise<SiteData | null> {
  const base = blobBaseUrl();
  if (!base) return null;
  try {
    // クエリを付けてブラウザ/中間キャッシュを避ける
    const res = await fetch(`${base}/${DATA_PATHNAME}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return normalizeSiteData(await res.json());
  } catch {
    return null;
  }
}

// ページ用: 60秒キャッシュ。アドミン保存時に revalidateTag で即時更新
export const getSiteData = unstable_cache(
  async (): Promise<SiteData> => (await fetchSiteDataFromBlob()) ?? fallbackSiteData,
  ["site-data"],
  { revalidate: 60, tags: [SITE_DATA_TAG] },
);
