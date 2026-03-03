import { NextRequest, NextResponse } from "next/server";

const REPO = "oganes-son/inaga-portfolio";
const FILE_PATH = "data/works.json";
const BRANCH = "main";

function checkAuth(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
  }

  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  const data = JSON.parse(content);

  return NextResponse.json({ data, sha: json.sha });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await request.json();

  // Fetch latest SHA before saving
  const shaUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const shaRes = await fetch(shaUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!shaRes.ok) {
    return NextResponse.json({ error: "Failed to fetch SHA from GitHub" }, { status: 500 });
  }

  const shaJson = await shaRes.json();
  const currentSha = shaJson.sha;

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const putUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update works.json via admin panel",
      content,
      sha: currentSha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: "Failed to update GitHub", detail: err }, { status: 500 });
  }

  const putJson = await putRes.json();
  return NextResponse.json({ ok: true, newSha: putJson.content.sha });
}
