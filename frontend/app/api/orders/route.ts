import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const service = createServiceClient();
  const { data, error } = await service
    .from("orders")
    .select("*, order_items(*, products(name, price))")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

type CartItem = { id: string; price: number; quantity: number };

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { items, used_search = false }: { items: CartItem[]; used_search?: boolean } = await request.json();
  if (!items?.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });

  const order_total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const now = new Date();

  const service = createServiceClient();
  const { data: order, error: orderError } = await service
    .from("orders")
    .insert({
      user_id: user.id,
      order_total,
      used_search,
      day_of_week: now.getDay(),
      hour_of_day: now.getHours(),
      status: "completed",
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const orderItems = items.map((i) => ({
    order_id:   order.id,
    product_id: i.id,
    quantity:   i.quantity,
    unit_price: Number(i.price),
    subtotal:   Number(i.price) * i.quantity,
  }));

  const { error: itemsError } = await service.from("order_items").insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json(order, { status: 201 });
}
