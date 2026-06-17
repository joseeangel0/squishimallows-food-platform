import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TABLE_MAP: Record<string, string> = {
  product_view:      "product_views",
  search:            "search_events",
  category_browsing: "category_browsing_events",
  cart:              "cart_events",
};

export async function POST(request: Request) {
  const body = await request.json();
  const { type, ...payload } = body;

  const table = TABLE_MAP[type];
  if (!table) return NextResponse.json({ error: "Invalid event type" }, { status: 400 });

  const { error } = await supabase.from(table).insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
