import { NextRequest, NextResponse } from "next/server";

const REPO = "oganes-son/inaga-portfolio";
const BRANCH = "main";

function checkAuth(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

function getImagePath(filename: string, type: "music" | "design" | "mp3"): string {
  if (type === "mp3") return `public/music/${filename}`;
  const folder = type === "music" ? "MUSIC WORKS" : "DESIGN WORKS";
  return `public/images/${folder}/${filename}`;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { base64, filename, type } = await request.json() as { base64: string; filename: string; type: "music" | "design" | "mp3" };
  const filePath = getImagePath(filename, type);

  // Check if file already exists to get SHA
  const checkUrl = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}?ref=${BRANCH}`;
  const checkRes = await fetch(checkUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  const body: Record<string, string> = {
    message: `Upload image: ${filename} via admin panel`,
    content: base64,
    branch: BRANCH,
  };

  if (checkRes.ok) {
    const existing = await checkRes.json();
    body.sha = existing.sha;
  }

  const putUrl = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}`;
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: "Failed to upload image", detail: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, type } = await request.json() as { filename: string; type: "music" | "design" | "mp3" };
  const filePath = getImagePath(filename, type);

  // Get SHA
  const getUrl = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}?ref=${BRANCH}`;
  const getRes = await fetch(getUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!getRes.ok) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const getJson = await getRes.json();

  const delUrl = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}`;
  const delRes = await fetch(delUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Delete image: ${filename} via admin panel`,
      sha: getJson.sha,
      branch: BRANCH,
    }),
  });

  if (!delRes.ok) {
    const err = await delRes.text();
    return NextResponse.json({ error: "Failed to delete image", detail: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
