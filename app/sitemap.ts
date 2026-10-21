import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/site-data";

const BASE_URL = "https://inagainaga.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { musicWorks, designWorks } = await getSiteData();
  const workPages = [...musicWorks, ...designWorks].map((work) => ({
    url: `${BASE_URL}/work-slug/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work-type/music`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work-type/design`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/design-notes`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...workPages,
  ];
}
