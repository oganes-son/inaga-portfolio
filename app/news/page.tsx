import NewsClient from "./NewsClient";
import { getSiteData } from "@/lib/site-data";

export default async function NewsPage() {
  const { newsData } = await getSiteData();
  return <NewsClient newsData={newsData} />;
}
