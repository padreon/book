"use client";

import { PageForm } from "@/components/PageForm";
import { createPage } from "@/app/actions/pages";

export default function NewPagePage() {
    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Tambah Halaman Baru</h1>
            <PageForm action={createPage} />
        </div>
    );
}
