"""T19 – Generate completed orders from checkout cart events.
Research Q3: low-cost vs high-cost purchase frequency.
Research Q4: search → higher AOV.
"""
import uuid
import random
from datetime import datetime, timedelta
from config import LOW_COST_CATS, HIGH_COST_CATS


def generate(
    cart_events: list[dict],
    search_session_ids: set[str],
) -> list[dict]:
    orders = []
    checkouts = [e for e in cart_events if e["event_type"] == "checkout"]

    for event in checkouts:
        completed_at = datetime.fromisoformat(event["created_at"]) + timedelta(seconds=random.randint(10, 60))
        used_search  = event["session_id"] in search_session_ids

        # Searchers have ~40% higher order total on average
        base_total = float(event["cart_total"] or 0)
        if used_search:
            base_total *= random.uniform(1.2, 1.6)
        order_total = round(base_total, 2)

        orders.append({
            "id":           str(uuid.uuid4()),
            "session_id":   event["session_id"],
            "user_id":      event["user_id"],
            "order_total":  order_total,
            "used_search":  used_search,
            "completed_at": completed_at.isoformat(),
            "day_of_week":  completed_at.weekday(),
            "hour_of_day":  completed_at.hour,
            "status":       "completed",
        })
    return orders


if __name__ == "__main__":
    from generate_users    import generate as gen_users
    from generate_sessions import generate as gen_sessions
    from generate_cart_events import generate as gen_cart
    sessions = gen_sessions(gen_users(20))
    cart     = gen_cart(sessions)
    orders   = generate(cart, set())
    print(f"Generated {len(orders)} orders")
