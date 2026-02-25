// lib/works.ts
export type Work = {
  id: number;
  slug: string;
  filename: string;
  title: string;
  description?: string;
  tools?: string;
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
    tools: "お金, 時間, やる気, おいしいごはん",//使用ツールなど。ポートフォリオとしてはあった方がいいかなって。
    soundcloud: "https://soundcloud.com/sgextgl4iyy9",//URL貼ってね
    youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
  },

  { id: 2, slug: "cyber-metroplex", filename: "CYBER_METROPLEX.png", title: "CYBER METROPLEX", description: "", tools: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
  { id: 3, slug: "fantasie-impromptu", filename: "Fantasie_Impromptu(Remix).png", title: "Fantasie Impromptu (Remix)", description: "", tools: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
  { id: 4, slug: "purify", filename: "Purify.png", title: "Purify", description: "", tools: "", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
];

//デザイン作品のデータ
export const designWorks: Work[] = [
  { 
    id: 1, 
    slug: "aquarhythm", 
    filename: "AQUARHYTHM.png", 
    title: "AQUARHYTHM(From 楡陵祭)", 
    description: "",
    tools: ""
  },

  { id: 2, slug: "colorful-smoke", filename: "COLORFUL SMOKE.png", title: "COLORFUL SMOKE", description: "" ,tools: ""},
  { id: 3, slug: "harmonite", filename: "HARMONITE.png", title: "HARMONITE (From楡陵祭)", description: "" ,tools: ""},
  { id: 4, slug: "lunar-prober", filename: "LUNAR PROBER.png", title: "LUNAR PROBER", description: "" ,tools: ""},
  { id: 5, slug: "reconst", filename: "RECONST.png", title: "RECONST" ,tools: ""},
  { id: 6, slug: "outen", filename: "outen.png", title: "横転" , description: "" ,tools: ""},
  { id: 7, slug: "nengajo-2026", filename: "nengajo.png", title: "年賀状2026" , description: "" ,tools: ""},
];


//ニュースnews追加してね
export type News = {
  date: string;
  content: string;
  link?: string;
};

export const newsData: News[] = [
  { 
    date: "2026.02.25", 
    content: "ポートフォリオサイトを公開しました。" 
  }
];