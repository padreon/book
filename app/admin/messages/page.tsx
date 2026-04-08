import { createClient } from "@/lib/supabase/server";
import { MarkReadButton } from "@/components/MarkReadButton";
import { DeleteMessageButton } from "@/components/DeleteMessageButton";

export const revalidate = 0;

export default async function AdminMessagesPage() {
    const supabase = await createClient();

    const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Pesan Kontak</h1>

            {messages && messages.length > 0 ? (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white border p-6 ${msg.is_read ? "border-border-light" : "border-gold/40"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-semibold text-text-primary">
                                            {msg.name}
                                        </span>
                                        {!msg.is_read && (
                                            <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 font-semibold">
                                                Baru
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-muted mb-1">{msg.email}</p>
                                    <p className="text-sm text-text-muted mb-3">
                                        {new Date(msg.created_at).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                        {msg.message}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    {!msg.is_read && (
                                        <MarkReadButton id={msg.id} />
                                    )}
                                    <DeleteMessageButton id={msg.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-border-light">
                    <p className="text-text-muted">Belum ada pesan.</p>
                </div>
            )}
        </div>
    );
}
