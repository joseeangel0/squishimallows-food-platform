import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ isAdmin: false });

    const service = createServiceClient();
    const { data } = await service
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({ isAdmin: !!data });
  } catch (e) {
    console.error("[admin/check]", e);
    return NextResponse.json({ isAdmin: false });
  }
}
