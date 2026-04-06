import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch stats
    const [booksResult, pagesResult, messagesResult] = await Promise.all([
        supabase.from("books").select("*", { count: "exact", head: true }),
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
    ]);

    const stats = [
        {
            label: "Total Buku",
            value: booksResult.count || 0,
            icon: "📚",
            href: "/admin/books",
        },
        {
            label: "Total Halaman",
            value: pagesResult.count || 0,
            icon: "📄",
            href: "/admin/pages",
        },
        {
            label: "Pesan Belum Dibaca",
            value: messagesResult.count || 0,
            icon: "✉️",
            href: "/admin/messages",
        },
    ];

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <a
                        key={stat.label}
                        href={stat.href}
                        className="bg-white border border-border-light p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <span className="text-3xl font-heading font-bold text-navy">
                                {stat.value}
                            </span>
                        </div>
                        <p className="text-sm text-text-muted">{stat.label}</p>
                    </a>
                ))}
            </div>

            {/* Recent Quick Actions */}
            <div className="mt-12">
                <h2 className="text-xl mb-4">Aksi Cepat</h2>
                <div className="flex flex-wrap gap-3">
                    <a href="/admin/books/new" className="btn-primary text-sm">
                        + Tambah Buku
                    </a>
                    <a href="/admin/pages/new" className="btn-secondary text-sm">
                        + Tambah Halaman
                    </a>
                </div>
            </div>
        </div>
    );
}
