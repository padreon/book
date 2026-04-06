"use client";

import { markMessageAsRead } from "@/app/actions/contact";
import { useState } from "react";

export function MarkReadButton({ id }: { id: string }) {
    const [done, setDone] = useState(false);

    const handleMark = async () => {
        await markMessageAsRead(id);
        setDone(true);
    };

    if (done) {
        return (
            <span className="text-xs text-success font-semibold">✓ Dibaca</span>
        );
    }

    return (
        <button
            onClick={handleMark}
            className="text-xs text-gold-dark hover:text-gold font-semibold shrink-0"
        >
            Tandai Dibaca
        </button>
    );
}
