import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog Buku",
    description: "Jelajahi koleksi buku terbitan Banua Publisher.",
};

export const revalidate = 60;

const BOOKS_PER_PAGE = 9;

export default async function BooksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Math.max(1, Number(params.page) || 1);
    const supabase = await createClient();

    // Count total books
    const { count } = await supabase
        .from("books")
        .select("*", { count: "exact", head: true });

    const totalBooks = count || 0;
    const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
    const offset = (currentPage - 1) * BOOKS_PER_PAGE;

    // Fetch books for current page
    const { data: books } = await supabase
        .from("books")
        .select("*")
        .order("published_at", { ascending: false })
        .range(offset, offset + BOOKS_PER_PAGE - 1);

    return (
        <>
            {/* Page Header */}
            <section className="bg-navy">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        Koleksi
                    </span>
                    <h1 className="text-3xl md:text-4xl text-white mt-2">
                        Katalog Buku
                    </h1>
                </div>
                <div className="divider-gold" />
            </section>

            {/* Book Grid */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                {books && books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {books.map((book) => (
                                <Link
                                    key={book.id}
                                    href={`/books/${book.slug}`}
                                    className="card group block"
                                >
                                    <div className="aspect-[3/4] relative bg-cream overflow-hidden">
                                        {book.cover_url ? (
                                            <Image
                                                src={book.cover_url}
                                                alt={book.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="font-heading text-3xl text-text-muted/40">
                                                    {book.title[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-heading text-lg font-bold leading-snug mb-1 group-hover:text-gold-dark transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-text-muted mb-3">
                                            {book.author}
                                        </p>
                                        <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                                            {book.synopsis}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="flex justify-center items-center gap-2 mt-12">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/books?page=${currentPage - 1}`}
                                        className="px-4 py-2 text-sm border border-border hover:bg-cream transition-colors"
                                    >
                                        ← Sebelumnya
                                    </Link>
                                )}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <Link
                                            key={page}
                                            href={`/books?page=${page}`}
                                            className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${page === currentPage
                                                    ? "bg-navy text-white"
                                                    : "border border-border hover:bg-cream"
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    )
                                )}
                                {currentPage < totalPages && (
                                    <Link
                                        href={`/books?page=${currentPage + 1}`}
                                        className="px-4 py-2 text-sm border border-border hover:bg-cream transition-colors"
                                    >
                                        Selanjutnya →
                                    </Link>
                                )}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-text-muted text-lg">
                            Belum ada buku yang diterbitkan.
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}
