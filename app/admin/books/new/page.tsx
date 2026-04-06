"use client";

import { BookForm } from "@/components/BookForm";
import { createBook } from "@/app/actions/books";

export default function NewBookPage() {
    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Tambah Buku Baru</h1>
            <BookForm action={createBook} />
        </div>
    );
}
