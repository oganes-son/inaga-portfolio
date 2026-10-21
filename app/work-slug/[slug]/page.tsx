import WorkDetailClient from "./WorkDetailClient";
import { getSiteData } from "@/lib/site-data";

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { musicWorks, designWorks } = await getSiteData();

  // 全データから該当作品を検索
  const work = [...musicWorks, ...designWorks].find((w) => w.slug === slug);
  const isMusic = musicWorks.some((w) => w.slug === slug);

  if (!work) return <div className="p-20 text-center font-['Bahnschrift']">Work not found.</div>;
  return <WorkDetailClient work={work} isMusic={isMusic} />;
}
