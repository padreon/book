import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://banuapublisher.com";

    // Fetch all books
    const { data: books } = await supabase
        .from("books")
        .select("slug, updated_at");

    // Fetch all published pages
    const { data: pages } = await supabase
        .from("pages")
        .select("slug, updated_at")
        .eq("is_published", true);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/books`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    const bookRoutes: MetadataRoute.Sitemap = (books || []).map((book) => ({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: new Date(book.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const pageRoutes: MetadataRoute.Sitemap = (pages || []).map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...bookRoutes, ...pageRoutes];
}
