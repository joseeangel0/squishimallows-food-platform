"""T14 – Generate user sessions with realistic timing."""
import uuid
import random
from datetime import datetime, timedelta, timezone


def generate(users: list[dict], sessions_range: tuple[int, int] = (2, 6)) -> list[dict]:
    sessions = []
    now = datetime.now(timezone.utc)
    # Heavier activity during lunch (11-14) and evening (18-21)
    hour_weights = [1,1,1,1,1,1,1,3,4,4,5,7,8,8,7,5,4,4,7,8,7,5,3,2]

    for user in users:
        for _ in range(random.randint(*sessions_range)):
            hours = list(range(24))
            hour = random.choices(hours, weights=hour_weights)[0]
            start = now - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
            )
            start = start.replace(hour=hour)
            duration = random.randint(120, 1800)
            end = start + timedelta(seconds=duration)

            sessions.append({
                "id":               str(uuid.uuid4()),
                "user_id":          user["id"],
                "device_type":      user["device_type"],
                "started_at":       start.isoformat(),
                "ended_at":         end.isoformat(),
                "duration_seconds": duration,
                "day_of_week":      start.weekday(),
                "hour_of_day":      start.hour,
            })
    return sessions


if __name__ == "__main__":
    from generate_users import generate as gen_users
    sessions = generate(gen_users(10))
    print(f"Generated {len(sessions)} sessions")
    for s in sessions[:3]:
        print(s)
