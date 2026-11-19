import type { MetadataRoute } from "next";
import { API_CATALOG } from "@/lib/api-catalog";

export const SITE = "https://devhub.bookchaowalit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/docs", "/playground", ...API_CATALOG.map((api) => `/apis/${api.id}`)].map((path) => ({ url: `${SITE}${path}` }));
}
