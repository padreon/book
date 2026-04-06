import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditBookForm } from "./EditBookForm";

export const revalidate = 0;

export default async function EditBookPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: book } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

    if (!book) notFound();

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Edit Buku</h1>
            <EditBookForm book={book} />
        </div>
    );
}
