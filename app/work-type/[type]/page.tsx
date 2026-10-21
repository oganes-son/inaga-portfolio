import { notFound } from "next/navigation";
import WorksListClient from "./WorksListClient";
import { getSiteData } from "@/lib/site-data";

export default async function WorksList({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (type !== "music" && type !== "design") notFound();
  const data = await getSiteData();
  const works = type === "music" ? data.musicWorks : data.designWorks;
  return <WorksListClient type={type} works={works} />;
}
