"""T21 – Main seed script. Generates all synthetic data and inserts into Supabase.

Run:
    cd scripts
    pip install -r requirements.txt
    python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from config import get_client

from generate_users          import generate as gen_users
from generate_sessions       import generate as gen_sessions
from generate_search_events  import generate as gen_search
from generate_product_views  import generate as gen_views
from generate_category_events import generate as gen_cat_events
from generate_cart_events    import generate as gen_cart
from generate_orders         import generate as gen_orders
from generate_order_items    import generate as gen_items


def batch_insert(client, table: str, rows: list[dict], chunk: int = 200) -> int:
    if not rows:
        return 0
    inserted = 0
    for i in range(0, len(rows), chunk):
        client.table(table).insert(rows[i : i + chunk]).execute()
        inserted += len(rows[i : i + chunk])
    return inserted


def main():
    client = get_client()
    print("Squishimallows – seed script\n" + "=" * 40)

    # 1. Users (T13)
    users = gen_users(3)
    n = batch_insert(client, "users", users)
    print(f"✓ users:                    {n:>4}")

    # 2. Sessions (T14)
    sessions = gen_sessions(users, sessions_range=(1, 3))[:5]
    n = batch_insert(client, "sessions", sessions)
    print(f"✓ sessions:                 {n:>4}")

    # 3. Search events (T15)
    search_events = gen_search(sessions)
    n = batch_insert(client, "search_events", search_events)
    print(f"✓ search_events:            {n:>4}")

    # 4. Product views (T16)
    product_views = gen_views(sessions)
    n = batch_insert(client, "product_views", product_views)
    print(f"✓ product_views:            {n:>4}")

    # 5. Category browsing events (T17)
    cat_events = gen_cat_events(sessions)
    n = batch_insert(client, "category_browsing_events", cat_events)
    print(f"✓ category_browsing_events: {n:>4}")

    # 6. Cart events (T18)
    cart_events = gen_cart(sessions)
    n = batch_insert(client, "cart_events", cart_events)
    print(f"✓ cart_events:              {n:>4}")

    # 7. Orders (T19)
    search_session_ids = {e["session_id"] for e in search_events}
    orders = gen_orders(cart_events, search_session_ids)
    n = batch_insert(client, "orders", orders)
    print(f"✓ orders:                   {n:>4}")

    # 8. Order items (T20)
    order_items = gen_items(orders)
    n = batch_insert(client, "order_items", order_items)
    print(f"✓ order_items:              {n:>4}")

    print("\nDone. Run export.py to generate CSV/JSON/Excel files.")


if __name__ == "__main__":
    main()
