import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin", // 管理画面はインデックスしない
      },
    ],
    sitemap: "https://inagainaga.vercel.app/sitemap.xml",
  };
}
