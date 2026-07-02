import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get("product_id");
  if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const { data, error } = await createServiceClient()
    .from("reviews")
    .select("id, rating, comment, user_email, verified_purchase, created_at")
    .eq("product_id", product_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { product_id, rating, comment } = await request.json();
  if (!product_id || !rating) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  const { error } = await createServiceClient()
    .from("reviews")
    .upsert(
      { product_id, user_id: user.id, user_email: user.email!, rating, comment },
      { onConflict: "product_id,user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
