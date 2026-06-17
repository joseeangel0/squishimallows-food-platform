import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let query = supabase.from("products").select("*, categories(name, slug)").eq("is_available", true);

  if (category) query = query.eq("category_id", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query.order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
