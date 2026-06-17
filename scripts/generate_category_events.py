"""T17 – Generate category browsing events.
Research Q6: time spent browsing a category → add to cart probability.
"""
import uuid
import random
from datetime import datetime, timedelta
from config import CATEGORIES


def _add_to_cart_prob(seconds: int) -> float:
    if seconds < 60:
        return 0.12
    if seconds < 180:
        return 0.28
    return 0.48


def generate(sessions: list[dict], events_per_session: tuple[int, int] = (1, 3)) -> list[dict]:
    events = []
    for session in sessions:
        start = datetime.fromisoformat(session["started_at"])
        for _ in range(random.randint(*events_per_session)):
            category   = random.choice(CATEGORIES)
            browse_start = start + timedelta(seconds=random.randint(5, 300))
            time_spent   = random.randint(15, 600)
            browse_end   = browse_start + timedelta(seconds=time_spent)

            events.append({
                "id":                str(uuid.uuid4()),
                "session_id":        session["id"],
                "user_id":           session["user_id"],
                "category_id":       category["id"],
                "browse_start":      browse_start.isoformat(),
                "browse_end":        browse_end.isoformat(),
                "time_spent_seconds": time_spent,
                "products_viewed":   random.randint(1, 8),
                "added_to_cart":     random.random() < _add_to_cart_prob(time_spent),
            })
    return events


if __name__ == "__main__":
    from generate_users    import generate as gen_users
    from generate_sessions import generate as gen_sessions
    events = generate(gen_sessions(gen_users(10)))
    print(f"Generated {len(events)} category browsing events")
