import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

// Prevent catching /books, /contact, /admin routes
const RESERVED_SLUGS = ["books", "contact", "admin"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    if (RESERVED_SLUGS.includes(slug)) return {};

    const supabase = await createClient();
    const { data: page } = await supabase
        .from("pages")
        .select("title")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!page) return {};

    return {
        title: page.title,
    };
}

export const revalidate = 60;

export default async function CustomPage({ params }: Props) {
    const { slug } = await params;

    if (RESERVED_SLUGS.includes(slug)) {
        notFound();
    }

    const supabase = await createClient();

    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!page) notFound();

    return (
        <>
            {/* Page Header */}
            <section className="bg-navy">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="text-3xl md:text-4xl text-white">{page.title}</h1>
                </div>
                <div className="divider-gold" />
            </section>

            {/* Content */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <article
                    className="prose-content"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </section>
        </>
    );
}
