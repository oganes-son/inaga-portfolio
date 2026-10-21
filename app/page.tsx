import HomeClient from "@/components/HomeClient";
import { getSiteData } from "@/lib/site-data";

export default async function Home() {
  const data = await getSiteData();
  return <HomeClient data={data} />;
}
