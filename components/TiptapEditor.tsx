"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type TiptapEditorProps = {
    content: string;
    onChange: (content: string) => void;
};

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-warm-white">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("bold")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Bold"
            >
                B
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`px-3 py-1.5 text-sm italic font-semibold rounded transition-colors ${
                    editor.isActive("italic")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Italic"
            >
                I
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`px-3 py-1.5 text-sm line-through font-semibold rounded transition-colors ${
                    editor.isActive("strike")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Strikethrough"
            >
                S
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("heading", { level: 2 })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("heading", { level: 3 })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Heading 3"
            >
                H3
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("bulletList")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("orderedList")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Ordered List"
            >
                1. List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("blockquote")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Quote"
            >
                "Quote"
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="px-3 py-1.5 text-sm font-semibold rounded text-text-secondary hover:bg-cream transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
            >
                Undo
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="px-3 py-1.5 text-sm font-semibold rounded text-text-secondary hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
            >
                Redo
            </button>
        </div>
    );
};

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose-content min-h-[300px] p-4 focus:outline-none bg-white",
            },
        },
    });

    return (
        <div className="border-[1.5px] border-border rounded overflow-hidden focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold/15 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
