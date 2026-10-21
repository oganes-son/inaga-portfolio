import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { put, del } from "@vercel/blob";
import { checkAdminAuth } from "@/lib/admin-auth";
import { DATA_PATHNAME, SITE_DATA_TAG, fetchSiteDataFromBlob } from "@/lib/site-data";
import { fallbackSiteData } from "@/lib/works";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await fetchSiteDataFromBlob();
  return NextResponse.json({ data: data ?? fallbackSiteData, source: data ? "blob" : "repo" });
}

// 保存: works.json を Blob に上書きし、不要になったファイルを削除してページを再生成
export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN が設定されていません" }, { status: 500 });
  }

  const { data, deletions = [] } = (await request.json()) as { data: unknown; deletions?: string[] };
  const json = JSON.stringify(data, null, 2);

  try {
    await put(DATA_PATHNAME, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
  } catch (e) {
    return NextResponse.json({ error: "データの保存に失敗しました", detail: String(e) }, { status: 500 });
  }

  // まだデータ内で参照されている URL は消さない
  const toDelete = deletions.filter(
    (url) => url.includes(".blob.vercel-storage.com/") && !json.includes(url),
  );
  if (toDelete.length > 0) {
    try {
      await del(toDelete);
    } catch {
      // 削除失敗はデータ保存の成否に影響させない
    }
  }

  revalidateTag(SITE_DATA_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
