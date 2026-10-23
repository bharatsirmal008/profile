import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://bharatsirmal.vercel.app/" },
    { url: "https://bharatsirmal.vercel.app/assistant" },
  ];
}
