"""T16 – Generate product view events.
Research Q1: longer view time → higher probability of adding to cart.
"""
import uuid
import random
from datetime import datetime, timedelta, timezone
from config import PRODUCTS


def _add_to_cart_prob(seconds: int) -> float:
    if seconds < 30:
        return 0.08
    if seconds < 90:
        return 0.22
    if seconds < 180:
        return 0.38
    return 0.55


def generate(sessions: list[dict], views_per_session: tuple[int, int] = (1, 4)) -> list[dict]:
    views = []
    for session in sessions:
        start = datetime.fromisoformat(session["started_at"])
        for _ in range(random.randint(*views_per_session)):
            product     = random.choice(PRODUCTS)
            view_start  = start + timedelta(seconds=random.randint(5, 600))
            time_spent  = random.randint(5, 300)
            view_end    = view_start + timedelta(seconds=time_spent)
            added       = random.random() < _add_to_cart_prob(time_spent)

            views.append({
                "id":                str(uuid.uuid4()),
                "session_id":        session["id"],
                "user_id":           session["user_id"],
                "product_id":        product["id"],
                "category_id":       product["category_id"],
                "view_start":        view_start.isoformat(),
                "view_end":          view_end.isoformat(),
                "time_spent_seconds": time_spent,
                "added_to_cart":     added,
            })
    return views


if __name__ == "__main__":
    from generate_users    import generate as gen_users
    from generate_sessions import generate as gen_sessions
    views = generate(gen_sessions(gen_users(10)))
    print(f"Generated {len(views)} product views")
