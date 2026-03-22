import { NextRequest, NextResponse } from "next/server";

const REPO = "oganes-son/inaga-portfolio";
const BRANCH = "main";
const GH_API = "https://api.github.com";

function checkAuth(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return true;
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

function getFilePath(filename: string, type: "music" | "design" | "mp3"): string {
  if (type === "mp3") return `public/music/${filename}`;
  const folder = type === "music" ? "MUSIC WORKS" : "DESIGN WORKS";
  return `public/images/${folder}/${filename}`;
}

type Upload = { filename: string; base64: string; type: "music" | "design" | "mp3" };
type Deletion = { filename: string; type: "music" | "design" | "mp3" };

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, uploads, deletions } = await request.json() as {
    data: unknown;
    uploads: Upload[];
    deletions: Deletion[];
  };

  const ghHeaders = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  // 1. Get current branch commit SHA
  const refRes = await fetch(`${GH_API}/repos/${REPO}/git/ref/heads/${BRANCH}`, {
    headers: ghHeaders,
    cache: "no-store",
  });
  if (!refRes.ok) return NextResponse.json({ error: "Failed to get branch ref" }, { status: 500 });
  const refJson = await refRes.json();
  const commitSha: string = refJson.object.sha;

  // 2. Get tree SHA from the commit
  const commitRes = await fetch(`${GH_API}/repos/${REPO}/git/commits/${commitSha}`, {
    headers: ghHeaders,
    cache: "no-store",
  });
  if (!commitRes.ok) return NextResponse.json({ error: "Failed to get commit" }, { status: 500 });
  const commitJson = await commitRes.json();
  const treeSha: string = commitJson.tree.sha;

  type TreeEntry = { path: string; mode: "100644"; type: "blob"; sha: string | null };
  const treeEntries: TreeEntry[] = [];

  // 3a. Create blob for works.json
  const jsonContent = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const jsonBlobRes = await fetch(`${GH_API}/repos/${REPO}/git/blobs`, {
    method: "POST",
    headers: ghHeaders,
    body: JSON.stringify({ content: jsonContent, encoding: "base64" }),
  });
  if (!jsonBlobRes.ok) return NextResponse.json({ error: "Failed to create data blob" }, { status: 500 });
  const jsonBlobJson = await jsonBlobRes.json();
  treeEntries.push({ path: "data/works.json", mode: "100644", type: "blob", sha: jsonBlobJson.sha });

  // 3b. Create blobs for uploads
  for (const upload of uploads) {
    const path = getFilePath(upload.filename, upload.type);
    const blobRes = await fetch(`${GH_API}/repos/${REPO}/git/blobs`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify({ content: upload.base64, encoding: "base64" }),
    });
    if (!blobRes.ok) {
      return NextResponse.json({ error: `Failed to create blob for ${upload.filename}` }, { status: 500 });
    }
    const blobJson = await blobRes.json();
    treeEntries.push({ path, mode: "100644", type: "blob", sha: blobJson.sha });
  }

  // 3c. Mark deletions (sha: null)
  for (const del of deletions) {
    const path = getFilePath(del.filename, del.type);
    treeEntries.push({ path, mode: "100644", type: "blob", sha: null });
  }

  // 4. Create new tree
  const newTreeRes = await fetch(`${GH_API}/repos/${REPO}/git/trees`, {
    method: "POST",
    headers: ghHeaders,
    body: JSON.stringify({ base_tree: treeSha, tree: treeEntries }),
  });
  if (!newTreeRes.ok) return NextResponse.json({ error: "Failed to create tree" }, { status: 500 });
  const newTreeJson = await newTreeRes.json();

  // 5. Create commit
  const newCommitRes = await fetch(`${GH_API}/repos/${REPO}/git/commits`, {
    method: "POST",
    headers: ghHeaders,
    body: JSON.stringify({
      message: "Update via admin panel",
      tree: newTreeJson.sha,
      parents: [commitSha],
    }),
  });
  if (!newCommitRes.ok) return NextResponse.json({ error: "Failed to create commit" }, { status: 500 });
  const newCommitJson = await newCommitRes.json();

  // 6. Update branch ref
  const updateRefRes = await fetch(`${GH_API}/repos/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    headers: ghHeaders,
    body: JSON.stringify({ sha: newCommitJson.sha }),
  });
  if (!updateRefRes.ok) return NextResponse.json({ error: "Failed to update ref" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
