"""T15 – Generate search events.
Research Q4: users who use the search bar generate higher AOV.
~50% of sessions use search; searchers complete purchases more often
and with higher order totals.
"""
import uuid
import random
from datetime import timedelta

SEARCH_QUERIES = [
    "cochinita", "desayuno", "ensalada", "café", "snack", "bebida",
    "comida yucateca", "poc chuc", "postre", "sopa de lima",
]


def generate(sessions: list[dict]) -> list[dict]:
    events = []
    for session in sessions:
        # ~50% of sessions use search
        if random.random() > 0.50:
            continue

        uses_search = True
        completes   = random.random() < 0.45   # searchers convert at 45%
        order_total = round(random.uniform(80, 320), 2) if completes else None

        from datetime import datetime, timezone
        session_start = datetime.fromisoformat(session["started_at"])
        event_time = session_start + timedelta(seconds=random.randint(10, 120))

        events.append({
            "id":                str(uuid.uuid4()),
            "session_id":        session["id"],
            "user_id":           session["user_id"],
            "query":             random.choice(SEARCH_QUERIES),
            "results_count":     random.randint(1, 15),
            "used_search":       uses_search,
            "completed_purchase": completes,
            "order_total":       order_total,
            "created_at":        event_time.isoformat(),
        })
    return events


if __name__ == "__main__":
    from generate_users    import generate as gen_users
    from generate_sessions import generate as gen_sessions
    events = generate(gen_sessions(gen_users(10)))
    print(f"Generated {len(events)} search events")
