import worksData from "@/data/works.json";

export type Work = {
  id: number;
  slug: string;
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
  slug: string;
  mp3Filename: string;
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

export const musicWorks: Work[] = worksData.musicWorks;
export const designWorks: Work[] = worksData.designWorks;
export const newsData: News[] = worksData.newsData;
export const playerTrack: PlayerTrack = worksData.playerTrack;
export const seoData: SeoData = worksData.seoData;
export const designNotes: DesignNote[] = worksData.designNotes;
