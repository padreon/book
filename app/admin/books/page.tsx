import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteBookButton } from "@/components/DeleteBookButton";

export const revalidate = 0;

export default async function AdminBooksPage() {
    const supabase = await createClient();

    const { data: books } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl">Buku</h1>
                <Link href="/admin/books/new" className="btn-primary text-sm">
                    + Tambah Buku
                </Link>
            </div>

            {books && books.length > 0 ? (
                <div className="bg-white border border-border-light overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Penulis</th>
                                <th>Terbit</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="font-semibold text-text-primary">
                                        {book.title}
                                    </td>
                                    <td>{book.author}</td>
                                    <td>
                                        {new Date(book.published_at).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/books/${book.id}/edit`}
                                                className="text-sm text-gold-dark hover:text-gold transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <DeleteBookButton id={book.id} title={book.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-border-light">
                    <p className="text-text-muted mb-4">Belum ada buku.</p>
                    <Link href="/admin/books/new" className="btn-primary text-sm">
                        Tambah Buku Pertama
                    </Link>
                </div>
            )}
        </div>
    );
}
