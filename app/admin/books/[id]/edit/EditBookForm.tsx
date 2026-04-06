"use client";

import { BookForm } from "@/components/BookForm";
import { updateBook } from "@/app/actions/books";

type Book = {
    id: string;
    title: string;
    slug: string;
    author: string;
    editor: string | null;
    synopsis: string;
    cover_url: string | null;
    images: string[];
};

export function EditBookForm({ book }: { book: Book }) {
    const action = async (formData: FormData) => {
        return updateBook(book.id, formData);
    };

    return (
        <BookForm
            action={action}
            initialData={{
                title: book.title,
                slug: book.slug,
                author: book.author,
                editor: book.editor,
                synopsis: book.synopsis,
                cover_url: book.cover_url,
                images: book.images || [],
            }}
        />
    );
}
