// lib/works.ts
export type Work = {
  id: number;
  slug: string;
  filename: string;
  title: string;
  description?: string;
  tool?: string;
  soundcloud?: string;
  youtube?: string;
};

//音楽作品のデータ
export const musicWorks: Work[] = [
  { 
    id: 1, //id昇順に左から並ぶことになります
    slug: "paradigm-shift", 
    filename: "PARADIGM_SHIFT.png", //imagesフォルダにアップロードした画像ファイル名
    title: "ALBUM PARADIGM SHIFT",//タイトル
    description: "ここに作品のコンセプトとか伝えたいこととかあったら書いてもらって。",//詳細説明文など
    tool: "お金, 時間, やる気, おいしいごはん",//使用ツールなど。ポートフォリオとしてはあった方がいいかなって。
    soundcloud: "https://soundcloud.com/sgextgl4iyy9",//URL貼ってね
    youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
  },

  { id: 2, slug: "cyber-metroplex", filename: "CYBER_METROPLEX.png", title: "CYBER METROPLEX", description: "", tool: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
  { id: 3, slug: "fantasie-impromptu", filename: "Fantasie_Impromptu(Remix).png", title: "Fantasie Impromptu (Remix)", description: "", tool: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
  { id: 4, slug: "purify", filename: "Purify.png", title: "Purify", description: "", tool: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
];

//デザイン作品のデータ
export const designWorks: Work[] = [
  { 
    id: 1, 
    slug: "aquarhythm", 
    filename: "AQUARHYTHM.png", 
    title: "AQUARHYTHM(From 楡陵祭)", 
    description: "",
    tool: ""
  },

  { id: 2, slug: "colorful-smoke", filename: "COLORFUL SMOKE.png", title: "COLORFUL SMOKE", description: "" ,tool: ""},
  { id: 3, slug: "harmonite", filename: "HARMONITE.png", title: "HARMONITE (From楡陵祭)", description: "" ,tool: ""},
  { id: 4, slug: "lunar-prober", filename: "LUNAR PROBER.png", title: "LUNAR PROBER", description: "" ,tool: ""},
  { id: 5, slug: "reconst", filename: "RECONST.png", title: "RECONST" ,tool: ""},
  { id: 6, slug: "outen", filename: "outen.png", title: "横転" , description: "" ,tool: ""},
  { id: 7, slug: "nengajo-2026", filename: "nengajo.png", title: "年賀状2026" , description: "" ,tool: ""},
];

export type News = {
  date: string;
  content: string;
  link?: string;
};

export const newsData: News[] = [
  { 
    date: "2026.02.23", 
    content: "ポートフォリオサイトを公開しました。" 
  },
  {
    date: "2026.03.01",
    content: "新しくなんかおもろいもの作りました",
    link: "https://www.hokudai.ac.jp/"
  }
];