"""T20 – Generate order items (2–4 per order).
Research Q5: co-purchase cliques by product category.
Common patterns: Comida+Bebida, Desayuno+Bebida, Snack+Bebida, Postre added ~30%.
"""
import uuid
import random
from config import PRODUCTS, PRODUCTS_BY_CAT, CAT_BEBIDAS, CAT_COMIDAS, CAT_DESAYUNOS, CAT_SNACKS, CAT_POSTRES, CAT_ENSALADAS


# Meal combos that simulate natural co-purchase cliques
COMBO_PATTERNS = [
    [CAT_COMIDAS,   CAT_BEBIDAS],
    [CAT_DESAYUNOS, CAT_BEBIDAS],
    [CAT_SNACKS,    CAT_BEBIDAS],
    [CAT_ENSALADAS, CAT_BEBIDAS],
    [CAT_COMIDAS,   CAT_BEBIDAS,  CAT_POSTRES],
    [CAT_DESAYUNOS, CAT_BEBIDAS,  CAT_POSTRES],
    [CAT_SNACKS,    CAT_BEBIDAS,  CAT_SNACKS],
]


def generate(orders: list[dict]) -> list[dict]:
    items = []
    for order in orders:
        pattern   = random.choice(COMBO_PATTERNS)
        # Sometimes add an extra random item
        if random.random() < 0.30:
            pattern = pattern + [random.choice(list(PRODUCTS_BY_CAT.keys()))]

        for cat_id in pattern:
            pool    = PRODUCTS_BY_CAT.get(cat_id, PRODUCTS)
            product = random.choice(pool)
            qty     = random.randint(1, 2)
            price   = float(product["price"])
            subtotal = round(price * qty, 2)

            items.append({
                "id":         str(uuid.uuid4()),
                "order_id":   order["id"],
                "product_id": product["id"],
                "category_id": product["category_id"],
                "quantity":   qty,
                "unit_price": price,
                "subtotal":   subtotal,
            })
    return items


if __name__ == "__main__":
    from generate_users       import generate as gen_users
    from generate_sessions    import generate as gen_sessions
    from generate_cart_events import generate as gen_cart
    from generate_orders      import generate as gen_orders
    sessions = gen_sessions(gen_users(20))
    cart     = gen_cart(sessions)
    orders   = gen_orders(cart, set())
    items    = generate(orders)
    print(f"Generated {len(items)} order items for {len(orders)} orders")
