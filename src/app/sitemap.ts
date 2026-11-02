import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/data/site";
import { logEntries } from "@/data/log";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url || "https://solarquack.in";
  const projects = await getAllProjects();
  // Newest changelog entry; pages without a known edit date leave lastModified out
  const siteUpdated = logEntries[0].date;

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/work/${p.slug}`,
    lastModified: p.updated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: siteUpdated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: siteUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resume`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/log`,
      lastModified: siteUpdated,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/path`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...projectRoutes,
  ];

  return routes;
}
