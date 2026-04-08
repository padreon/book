"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { uploadTiptapImage, deleteTiptapImage } from "@/app/actions/tiptap";

type TiptapEditorProps = {
    content: string;
    onChange: (content: string) => void;
};

const MenuBar = ({ 
    editor, 
    onImageClick, 
    isUploading, 
    onVideoClick 
}: { 
    editor: any; 
    onImageClick: () => void; 
    isUploading: boolean; 
    onVideoClick: () => void;
}) => {
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
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={`px-3 py-1.5 text-sm underline font-semibold rounded transition-colors ${
                    editor.isActive("underline")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Underline"
            >
                U
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
                onClick={onImageClick}
                disabled={isUploading}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    isUploading ? "opacity-50 cursor-not-allowed" : "text-text-secondary hover:bg-cream"
                }`}
                title="Add Image"
            >
                {isUploading ? "Uploading..." : "Image"}
            </button>

            <button
                type="button"
                onClick={onVideoClick}
                className="px-3 py-1.5 text-sm font-semibold rounded transition-colors text-text-secondary hover:bg-cream"
                title="Add Video"
            >
                Video
            </button>

            <button
                type="button"
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href;
                    const url = window.prompt('URL of the link', previousUrl);
                    if (url === null) return;
                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        return;
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive("link")
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Link"
            >
                Link
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive({ textAlign: 'left' })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Align Left"
            >
                Left
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive({ textAlign: 'center' })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Align Center"
            >
                Center
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive({ textAlign: 'right' })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Align Right"
            >
                Right
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`px-3 py-1.5 text-sm font-semibold rounded transition-colors ${
                    editor.isActive({ textAlign: 'justify' })
                        ? "bg-navy text-white"
                        : "text-text-secondary hover:bg-cream"
                }`}
                title="Justify"
            >
                Justify
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

const extractImages = (html: string) => {
    if (typeof window === "undefined") return [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    const imgs = Array.from(doc.querySelectorAll("img"));
    return imgs.map(img => img.src).filter(Boolean);
};

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const previousImages = useRef<string[]>([]);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            Youtube.configure({ inline: false }),
        ],
        content,
        onCreate: ({ editor }) => {
            previousImages.current = extractImages(editor.getHTML());
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);

            const currentImages = extractImages(html);
            const deleted = previousImages.current.filter(url => !currentImages.includes(url));
            if (deleted.length > 0) {
                deleted.forEach(url => {
                    // Only delete our own tiptap media bucket images
                    if (url.includes("/storage/v1/object/public/media/tiptap-")) {
                        deleteTiptapImage(url).catch(console.error);
                    }
                });
            }
            previousImages.current = currentImages;
        },
        editorProps: {
            attributes: {
                class: "prose-content min-h-[300px] p-4 focus:outline-none bg-white",
            },
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await uploadTiptapImage(formData);
            if (res.error) {
                alert(res.error);
                return;
            }

            if (res.url) {
                editor?.chain().focus().setImage({ src: res.url }).run();
                previousImages.current.push(res.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Gagal mengunggah gambar");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-[1.5px] border-border rounded overflow-hidden focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold/15 transition-all">
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
            />
            <MenuBar 
                editor={editor} 
                onImageClick={() => fileInputRef.current?.click()} 
                isUploading={isUploading}
                onVideoClick={() => {
                    const url = window.prompt("YouTube Video URL");
                    if (url) {
                        editor?.commands.setYoutubeVideo({ src: url });
                    }
                }}
            />
            <EditorContent editor={editor} />
        </div>
    );
}
