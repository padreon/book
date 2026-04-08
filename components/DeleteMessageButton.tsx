"use client";

import { deleteMessage } from "@/app/actions/contact";
import { useState } from "react";

export function DeleteMessageButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;
        
        setIsDeleting(true);
        const result = await deleteMessage(id);
        if (result?.error) {
            alert(result.error);
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-600 hover:text-red-800 font-semibold shrink-0"
        >
            {isDeleting ? "Menghapus..." : "Hapus"}
        </button>
    );
}
