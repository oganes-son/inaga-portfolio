import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkAdminAuth } from "@/lib/admin-auth";

// ブラウザから Vercel Blob へ直接アップロードするためのトークンを発行する。
// ファイル本体はこの API を通らないので、Vercel の 4.5MB リクエスト制限を受けない。
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  if (body.type === "blob.generate-client-token" && !checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^(images\/(music|design)|music)\//.test(pathname)) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: ["image/*", "audio/*"],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
