import { MetadataRoute } from "next";
import { musicWorks, designWorks } from "@/lib/works";

const BASE_URL = "https://inagainaga.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
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
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work-type/music`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work-type/design`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...workPages,
  ];
}
