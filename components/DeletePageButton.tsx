"use client";

import { useState } from "react";
import { deletePage } from "@/app/actions/pages";
import { ConfirmModal } from "./ConfirmModal";

export function DeletePageButton({
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
        await deletePage(id);
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
                title="Hapus Halaman"
                description={`Apakah Anda yakin ingin menghapus halaman "${title}"? Dokumen dan segala media di dalamnya tidak dapat dikembalikan lagi.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirming(false)}
                isLoading={deleting}
            />
        </>
    );
}
