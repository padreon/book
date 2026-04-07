import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SetupForm from "./setup-form";

export default async function SetupPage() {
    const supabase = await createClient();
    const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    // If admins already exist, redirect to login
    if ((count ?? 0) > 0) {
        redirect("/admin/login");
    }

    return <SetupForm />;
}
