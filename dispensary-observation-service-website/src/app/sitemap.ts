import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dispanserie.by";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-05-23");
  return ["", "/vzroslym", "/roditelyam", "/medrabotnikam", "/faq", "/dokumenty", "/istochniki"].map(
    (p) => ({
      url: `${BASE}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    }),
  );
}
