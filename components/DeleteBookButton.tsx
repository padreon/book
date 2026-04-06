"use client";

import { useState } from "react";
import { deleteBook } from "@/app/actions/books";

export function DeleteBookButton({
    id,
    title,
}: {
    id: string;
    title: string;
}) {
    const [confirming, setConfirming] = useState(false);

    const handleDelete = async () => {
        await deleteBook(id);
        window.location.reload();
    };

    if (confirming) {
        return (
            <span className="flex items-center gap-1">
                <button
                    onClick={handleDelete}
                    className="text-sm text-error font-semibold"
                >
                    Ya, Hapus
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="text-sm text-text-muted"
                >
                    Batal
                </button>
            </span>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="text-sm text-error/70 hover:text-error transition-colors"
            title={`Hapus ${title}`}
        >
            Hapus
        </button>
    );
}
