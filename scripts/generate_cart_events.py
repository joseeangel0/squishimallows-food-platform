"""T18 – Generate cart events (add, remove, abandon, return, checkout).
Research Q2: cart abandonment → return behavior (same session or later).
"""
import uuid
import random
from datetime import datetime, timedelta
from config import PRODUCTS


EVENT_PAGES = ["catalog", "product_detail", "search_results", "category", "home"]


def generate(sessions: list[dict]) -> list[dict]:
    events = []
    session_map = {s["id"]: s for s in sessions}

    for session in sessions:
        # ~60% of sessions interact with the cart
        if random.random() > 0.60:
            continue

        product   = random.choice(PRODUCTS)
        add_time  = datetime.fromisoformat(session["started_at"]) + timedelta(seconds=random.randint(60, 600))
        items     = random.randint(1, 5)
        cart_total = round(product["price"] * items + random.uniform(0, 50), 2)

        # Add event
        events.append({
            "id":                str(uuid.uuid4()),
            "session_id":        session["id"],
            "user_id":           session["user_id"],
            "product_id":        product["id"],
            "event_type":        "add",
            "items_in_cart":     items,
            "cart_total":        cart_total,
            "cart_add_timestamp": add_time.isoformat(),
            "purchase_completed": False,
            "created_at":        add_time.isoformat(),
        })

        outcome = random.choices(["abandon", "checkout"], weights=[0.30, 0.70])[0]

        if outcome == "checkout":
            checkout_time = add_time + timedelta(seconds=random.randint(30, 300))
            events.append({
                "id":                str(uuid.uuid4()),
                "session_id":        session["id"],
                "user_id":           session["user_id"],
                "product_id":        product["id"],
                "event_type":        "checkout",
                "items_in_cart":     items,
                "cart_total":        cart_total,
                "cart_add_timestamp": add_time.isoformat(),
                "purchase_completed": True,
                "created_at":        checkout_time.isoformat(),
            })
        else:
            # Abandon
            abandon_time = add_time + timedelta(seconds=random.randint(30, 600))
            pages_before = random.randint(1, 8)
            returns      = random.random() < 0.40
            same_session = returns and random.random() < 0.35
            return_time  = None
            time_to_ret  = None

            if returns:
                if same_session:
                    delta = random.randint(60, 1200)
                else:
                    delta = random.randint(3600, 86400)
                return_time = abandon_time + timedelta(seconds=delta)
                time_to_ret = delta

            events.append({
                "id":                         str(uuid.uuid4()),
                "session_id":                 session["id"],
                "user_id":                    session["user_id"],
                "product_id":                 product["id"],
                "event_type":                 "abandon",
                "items_in_cart":              items,
                "cart_total":                 cart_total,
                "cart_add_timestamp":         add_time.isoformat(),
                "cart_abandon_timestamp":     abandon_time.isoformat(),
                "return_timestamp":           return_time.isoformat() if return_time else None,
                "same_session_return":        same_session if returns else None,
                "time_to_return_seconds":     time_to_ret,
                "pages_visited_before_abandon": pages_before,
                "last_page_before_abandon":   random.choice(EVENT_PAGES),
                "purchase_completed":         returns and random.random() < 0.50,
                "created_at":                 abandon_time.isoformat(),
            })

    return events


if __name__ == "__main__":
    from generate_users    import generate as gen_users
    from generate_sessions import generate as gen_sessions
    events = generate(gen_sessions(gen_users(10)))
    types  = {}
    for e in events:
        types[e["event_type"]] = types.get(e["event_type"], 0) + 1
    print(f"Generated {len(events)} cart events: {types}")
