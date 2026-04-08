"use client";

import { useState } from "react";
import { deleteBook } from "@/app/actions/books";
import { ConfirmModal } from "./ConfirmModal";

export function DeleteBookButton({
    id,
    title,
}: {
    id: string;
    title: string;
}) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await deleteBook(id);
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setConfirming(true)}
                className="text-sm text-error/70 hover:text-error transition-colors"
                title={`Hapus ${title}`}
            >
                Hapus
            </button>
            <ConfirmModal
                isOpen={confirming}
                title="Hapus Buku"
                description={`Apakah Anda yakin ingin menghapus buku "${title}"? Segala informasi termasuk cover buku ini akan dihapus secara permanen.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirming(false)}
                isLoading={deleting}
            />
        </>
    );
}
