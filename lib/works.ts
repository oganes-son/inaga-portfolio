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

export const musicWorks: Work[] = worksData.musicWorks;
export const designWorks: Work[] = worksData.designWorks;
export const newsData: News[] = worksData.newsData;
