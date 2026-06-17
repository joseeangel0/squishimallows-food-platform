"""T22/T23/T24 – Export all tables to CSV, JSON, and Excel in sample_data/.

Run:
    cd scripts
    python export.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

import pandas as pd
from config import get_client

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "sample_data")

TABLES = [
    "users",
    "sessions",
    "products",
    "categories",
    "product_views",
    "search_events",
    "category_browsing_events",
    "cart_events",
    "orders",
    "order_items",
]


def fetch(client, table: str) -> pd.DataFrame:
    res = client.table(table).select("*").execute()
    return pd.DataFrame(res.data)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    client = get_client()

    print("Exporting tables…")
    dfs: dict[str, pd.DataFrame] = {}

    for table in TABLES:
        df = fetch(client, table)
        dfs[table] = df
        rows = len(df)

        # T22 – CSV
        df.to_csv(os.path.join(OUTPUT_DIR, f"{table}.csv"), index=False)

        # T23 – JSON
        df.to_json(os.path.join(OUTPUT_DIR, f"{table}.json"), orient="records", indent=2, force_ascii=False)

        print(f"  {table:<32} {rows:>4} rows  → CSV + JSON")

    # T24 – Single Excel with one sheet per table
    excel_path = os.path.join(OUTPUT_DIR, "squishimallows_data.xlsx")
    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        for table, df in dfs.items():
            df.to_excel(writer, sheet_name=table[:31], index=False)

    print(f"\n✓ Excel saved: sample_data/squishimallows_data.xlsx")
    print("Done.")


if __name__ == "__main__":
    main()
