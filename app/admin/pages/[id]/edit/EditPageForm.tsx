"use client";

import { PageForm } from "@/components/PageForm";
import { updatePage } from "@/app/actions/pages";

type Page = {
    id: string;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
};

export function EditPageForm({ page }: { page: Page }) {
    const action = async (formData: FormData) => {
        return updatePage(page.id, formData);
    };

    return (
        <PageForm
            action={action}
            initialData={{
                title: page.title,
                slug: page.slug,
                content: page.content,
                is_published: page.is_published,
            }}
        />
    );
}
