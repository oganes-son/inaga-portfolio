import fallbackJson from "@/data/works.json";

export type Work = {
  id: number;
  slug: string;
  /** Vercel Blob の URL、または旧来の public/images/*WORKS 内のファイル名 */
  filename: string;
  title: string;
  description?: string;
  tools?: string;
  soundcloud?: string;
  youtube?: string;
  niconico?: string;
  spotify?: string;
  appleMusic?: string;
  amazonMusic?: string;
};

export type News = {
  date: string;
  content: string;
  link?: string;
};

export type PlayerTrack = {
  /** 紐づける MUSIC WORKS の slug（アートワーク・タイトル・SNS リンクに使用） */
  slug: string;
  /** Vercel Blob の URL、または旧来の public/music 内のファイル名 */
  mp3Filename: string;
  /** false の曲はプレイヤーに表示しない */
  enabled: boolean;
};

/** アドミンの MP3 ライブラリの1ファイル */
export type Mp3File = {
  /** playerTracks[].mp3Filename に入れる値（Blob URL または旧来のファイル名） */
  value: string;
  name: string;
  size?: number;
  uploadedAt?: string;
};

export type SeoData = {
  title: string;
  description: string;
  keywords: string[];
};

export type DesignNote = {
  id: number;
  title: string;
  content: string;
};

export type AboutData = {
  name: string;
  /** 改行ごとに1段落として表示 */
  body: string;
};

export type SiteData = {
  musicWorks: Work[];
  designWorks: Work[];
  newsData: News[];
  /** プレイヤーの再生順 */
  playerTracks: PlayerTrack[];
  seoData: SeoData;
  designNotes: DesignNote[];
  about: AboutData;
};

export const DEFAULT_ABOUT: AboutData = {
  name: "いなが",
  body: "2004年11月24日生まれの21歳。札幌在住。\n音楽やグラフィックデザインを制作。\n北海道大学工学部情報エレクトロニクス学科所属。",
};

// 旧形式（1曲だけの playerTrack）も受け付ける
type RawSiteData = Partial<SiteData> & { playerTrack?: { slug: string; mp3Filename: string } };

// 欠けているフィールドを補完（古い works.json でも動くように）
export function normalizeSiteData(raw: RawSiteData): SiteData {
  const playerTracks = raw.playerTracks
    ?? (raw.playerTrack?.mp3Filename ? [{ ...raw.playerTrack, enabled: true }] : []);
  return {
    musicWorks: raw.musicWorks ?? [],
    designWorks: raw.designWorks ?? [],
    newsData: raw.newsData ?? [],
    playerTracks: playerTracks.map((t) => ({ slug: t.slug ?? "", mp3Filename: t.mp3Filename ?? "", enabled: t.enabled !== false })),
    seoData: { title: "", description: "", ...raw.seoData, keywords: raw.seoData?.keywords ?? [] },
    designNotes: raw.designNotes ?? [],
    about: { ...DEFAULT_ABOUT, ...raw.about },
  };
}

// Blob に未保存のときに使うリポジトリ内のデータ
export const fallbackSiteData: SiteData = normalizeSiteData(fallbackJson as RawSiteData);

const isUrl = (s: string) => /^https?:\/\//.test(s);

export function workImageUrl(filename: string, type: "music" | "design"): string {
  if (!filename) return "";
  if (isUrl(filename) || filename.startsWith("blob:")) return filename;
  return encodeURI(`/images/${type === "music" ? "MUSIC" : "DESIGN"} WORKS/${filename}`);
}

export function mp3Url(filename: string): string {
  if (!filename) return "";
  if (isUrl(filename)) return filename;
  return encodeURI(`/music/${filename}`);
}

// URL の場合は末尾のファイル名だけを表示用に取り出す
export function displayFilename(filename: string): string {
  if (!isUrl(filename)) return filename;
  try {
    return decodeURIComponent(new URL(filename).pathname.split("/").pop() ?? filename);
  } catch {
    return filename;
  }
}
