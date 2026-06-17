"""T13 – Generate synthetic anonymous users."""
import uuid
import random

DEVICE_TYPES   = ["mobile", "desktop", "tablet"]
DEVICE_WEIGHTS = [0.60, 0.30, 0.10]


def generate(n: int = 50) -> list[dict]:
    return [
        {
            "id":           str(uuid.uuid4()),
            "anonymous_id": f"anon_{i:04d}",
            "device_type":  random.choices(DEVICE_TYPES, weights=DEVICE_WEIGHTS)[0],
        }
        for i in range(1, n + 1)
    ]


if __name__ == "__main__":
    users = generate()
    print(f"Generated {len(users)} users")
    for u in users[:3]:
        print(u)
