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

type CartItem = { id: string; quantity: number };

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { items, used_search = false }: { items: CartItem[]; used_search?: boolean } = await request.json();
  if (!items?.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
  if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) {
    return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
  }

  const service = createServiceClient();

  // Precio y disponibilidad siempre se validan contra la base de datos —
  // nunca se confía en lo que mande el cliente (podría venir de un carrito
  // manipulado en localStorage).
  const { data: products, error: productsError } = await service
    .from("products")
    .select("id, price, category_id, is_available")
    .in("id", items.map((i) => i.id));

  if (productsError) return NextResponse.json({ error: productsError.message }, { status: 500 });

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  for (const item of items) {
    const product = byId.get(item.id);
    if (!product || !product.is_available) {
      return NextResponse.json({ error: "Uno o más productos ya no están disponibles" }, { status: 400 });
    }
  }

  const order_total = items.reduce((sum, i) => sum + Number(byId.get(i.id)!.price) * i.quantity, 0);
  const now = new Date();

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

  const orderItems = items.map((i) => {
    const product = byId.get(i.id)!;
    return {
      order_id:    order.id,
      product_id:  i.id,
      category_id: product.category_id,
      quantity:    i.quantity,
      unit_price:  Number(product.price),
      subtotal:    Number(product.price) * i.quantity,
    };
  });

  const { error: itemsError } = await service.from("order_items").insert(orderItems);
  if (itemsError) {
    // No dejar una orden huérfana (con total pero sin items) si esto falla.
    await service.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json(order, { status: 201 });
}
