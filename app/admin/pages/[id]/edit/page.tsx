import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditPageForm } from "./EditPageForm";

export const revalidate = 0;

export default async function EditPagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .single();

    if (!page) notFound();

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Edit Halaman</h1>
            <EditPageForm page={page} />
        </div>
    );
}
