import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";
import { checkAdminAuth } from "@/lib/admin-auth";
import { fetchSiteDataFromBlob } from "@/lib/site-data";
import { fallbackSiteData, displayFilename, type Mp3File } from "@/lib/works";

// MP3 ライブラリ: Blob の music/ 以下 + データ内で参照されている旧来のファイル
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files: Mp3File[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      let cursor: string | undefined;
      do {
        const res = await list({ prefix: "music/", cursor });
        for (const b of res.blobs) {
          files.push({ value: b.url, name: displayFilename(b.url), size: b.size, uploadedAt: new Date(b.uploadedAt).toISOString() });
        }
        cursor = res.hasMore ? res.cursor : undefined;
      } while (cursor);
    } catch {
      // 一覧取得に失敗しても、データ内の参照分は返す
    }
  }

  const data = (await fetchSiteDataFromBlob()) ?? fallbackSiteData;
  for (const t of data.playerTracks) {
    if (t.mp3Filename && !files.some((f) => f.value === t.mp3Filename)) {
      files.push({ value: t.mp3Filename, name: displayFilename(t.mp3Filename) });
    }
  }

  files.sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""));
  return NextResponse.json({ files });
}

// ライブラリから MP3 を完全に削除（Blob 上のファイルのみ）
export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url } = (await request.json()) as { url: string };
  if (!url?.includes(".blob.vercel-storage.com/music/")) {
    return NextResponse.json({ error: "Blob 上の MP3 のみ削除できます" }, { status: 400 });
  }
  await del(url);
  return NextResponse.json({ ok: true });
}
