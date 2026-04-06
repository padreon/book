import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TogglePublishButton } from "@/components/TogglePublishButton";
import { DeletePageButton } from "@/components/DeletePageButton";

export const revalidate = 0;

export default async function AdminPagesPage() {
    const supabase = await createClient();

    const { data: pages } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl">Halaman</h1>
                <Link href="/admin/pages/new" className="btn-primary text-sm">
                    + Tambah Halaman
                </Link>
            </div>

            {pages && pages.length > 0 ? (
                <div className="bg-white border border-border-light overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => (
                                <tr key={page.id}>
                                    <td className="font-semibold text-text-primary">
                                        {page.title}
                                    </td>
                                    <td className="text-text-muted">/{page.slug}</td>
                                    <td>
                                        <TogglePublishButton
                                            id={page.id}
                                            isPublished={page.is_published}
                                        />
                                    </td>
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/pages/${page.id}/edit`}
                                                className="text-sm text-gold-dark hover:text-gold transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <DeletePageButton id={page.id} title={page.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-border-light">
                    <p className="text-text-muted mb-4">Belum ada halaman.</p>
                    <Link href="/admin/pages/new" className="btn-primary text-sm">
                        Tambah Halaman Pertama
                    </Link>
                </div>
            )}
        </div>
    );
}
