import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: book } = await supabase
        .from("books")
        .select("title, synopsis, cover_url")
        .eq("slug", slug)
        .single();

    if (!book) return {};

    return {
        title: book.title,
        description: book.synopsis.slice(0, 160),
        openGraph: {
            title: book.title,
            description: book.synopsis.slice(0, 160),
            images: book.cover_url ? [{ url: book.cover_url }] : [],
            type: "article",
        },
    };
}

export const revalidate = 60;

export default async function BookDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: book } = await supabase
        .from("books")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!book) notFound();

    const publishedDate = new Date(book.published_at).toLocaleDateString(
        "id-ID",
        { year: "numeric", month: "long", day: "numeric" }
    );

    return (
        <>
            {/* Hero Section */}
            <section className="bg-navy">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <Link
                        href="/books"
                        className="text-gold/70 text-sm hover:text-gold transition-colors"
                    >
                        ← Kembali ke Katalog
                    </Link>
                </div>
                <div className="divider-gold" />
            </section>

            {/* Book Detail */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Cover Image */}
                    <div className="md:col-span-1">
                        <div className="aspect-[3/4] relative bg-cream overflow-hidden sticky top-20">
                            {book.cover_url ? (
                                <Image
                                    src={book.cover_url}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-heading text-5xl text-text-muted/30">
                                        {book.title[0]}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="md:col-span-2">
                        <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                            Detail Buku
                        </span>
                        <h1 className="text-3xl md:text-4xl mt-2 mb-4">{book.title}</h1>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8 text-sm">
                            <div>
                                <span className="text-text-muted">Penulis: </span>
                                <span className="font-semibold text-text-primary">
                                    {book.author}
                                </span>
                            </div>
                            {book.editor && (
                                <div>
                                    <span className="text-text-muted">Editor: </span>
                                    <span className="font-semibold text-text-primary">
                                        {book.editor}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-text-muted">Terbit: </span>
                                <span className="font-semibold text-text-primary">
                                    {publishedDate}
                                </span>
                            </div>
                        </div>

                        <div className="divider-gold w-16 mb-8" />

                        {/* Synopsis */}
                        <div className="mb-12">
                            <h2 className="text-xl mb-4">Sinopsis</h2>
                            <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                                {book.synopsis}
                            </p>
                        </div>

                        {/* Additional Images Gallery */}
                        {book.images && book.images.length > 0 && (
                            <div>
                                <h2 className="text-xl mb-4">Galeri</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {book.images.map((url: string, index: number) => (
                                        <div
                                            key={index}
                                            className="aspect-square relative bg-cream overflow-hidden"
                                        >
                                            <Image
                                                src={url}
                                                alt={`${book.title} - Gambar ${index + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 640px) 50vw, 33vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
