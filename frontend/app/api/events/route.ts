import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const TABLE_MAP: Record<string, string> = {
  product_view:      "product_views",
  search:            "search_events",
  category_browsing: "category_browsing_events",
  cart:              "cart_events",
};

// Whitelist de columnas por tipo de evento: este endpoint es público y sin
// autenticación (tracking anónimo), así que no se puede confiar en el body
// completo del cliente para decidir qué columnas insertar.
const ALLOWED_FIELDS: Record<string, string[]> = {
  product_view:      ["session_id", "user_id", "product_id", "time_spent_seconds", "added_to_cart"],
  search:            ["session_id", "user_id", "query", "results_count", "used_search", "completed_purchase"],
  category_browsing: ["session_id", "user_id", "category_id", "browse_start", "browse_end", "time_spent_seconds", "products_viewed", "added_to_cart"],
  cart:              ["session_id", "user_id", "product_id", "event_type", "items_in_cart", "cart_total", "cart_add_timestamp"],
};

export async function POST(request: Request) {
  const body = await request.json();
  const { type, ...payload } = body;

  const table = TABLE_MAP[type];
  const allowed = ALLOWED_FIELDS[type];
  if (!table || !allowed) return NextResponse.json({ error: "Invalid event type" }, { status: 400 });

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowed.includes(key))
  );

  const supabase = createServiceClient();
  const { error } = await supabase.from(table).insert(filtered);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
