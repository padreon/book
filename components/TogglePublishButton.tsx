"use client";

import { togglePagePublish } from "@/app/actions/pages";
import { useState } from "react";

export function TogglePublishButton({
    id,
    isPublished,
}: {
    id: string;
    isPublished: boolean;
}) {
    const [published, setPublished] = useState(isPublished);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        const result = await togglePagePublish(id, !published);
        if (!result.error) {
            setPublished(!published);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`text-xs font-semibold px-3 py-1 transition-colors ${published
                    ? "bg-success/10 text-success"
                    : "bg-text-muted/10 text-text-muted"
                }`}
        >
            {published ? "Terbit" : "Draft"}
        </button>
    );
}
