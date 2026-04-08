"use client";

export function ConfirmModal({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    isLoading,
}: {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-up">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 border border-border">
                <h3 className="text-xl font-heading font-bold text-navy mb-2">{title}</h3>
                <p className="text-sm text-text-secondary mb-6">{description}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="btn-secondary px-4 py-2 text-sm"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="btn-danger px-4 py-2 text-sm"
                    >
                        {isLoading ? "Menghapus..." : "Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
