import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]


def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


CATEGORIES = [
    {"id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Bebidas"},
    {"id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Comidas"},
    {"id": "889ac393-27f0-4b2d-ae9a-80a8e4331cd5", "name": "Desayunos"},
    {"id": "ca45f53b-2b23-4c38-aa7b-68d13f07927a", "name": "Ensaladas"},
    {"id": "8c34c28c-cf17-4175-85aa-85244e83d737", "name": "Postres"},
    {"id": "6015a68c-2e29-48bf-ba5f-a872c0c2a962", "name": "Snacks"},
]

PRODUCTS = [
    {"id": "76909304-086b-4bb9-b21b-206d99f1deae", "category_id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Agua de Jamaica",        "price": 20.0},
    {"id": "69ab1e7d-1405-4182-9958-4b0bc7405daf", "category_id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Café de Olla",           "price": 28.0},
    {"id": "7e4ce8f2-56a6-4a62-a35f-5b71809171cf", "category_id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Limonada Natural",        "price": 22.0},
    {"id": "f1ca7f6f-aa3b-4368-8595-cfc56d8e128a", "category_id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Refresco Lata",           "price": 18.0},
    {"id": "ef9bfb35-bb7b-472b-a64d-bc681c1f0072", "category_id": "1b32d62d-b66b-4023-b98b-e8c07310b148", "name": "Agua de Horchata",        "price": 25.0},
    {"id": "78d4c834-7870-44d8-815f-6d2fdef1b2a2", "category_id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Sopa de Lima",            "price": 70.0},
    {"id": "0218e35b-68a4-4986-bb1b-035a4291acb7", "category_id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Cochinita Pibil",         "price": 90.0},
    {"id": "8bc8a7bf-fc92-4333-9ad2-d5db510f96bc", "category_id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Relleno Negro",           "price": 105.0},
    {"id": "e7da73d1-a5f5-4ab9-897e-2d8eea474f19", "category_id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Lomitos de Valladolid",   "price": 88.0},
    {"id": "48ab4f6f-a29e-4fb6-ad70-e4172cff3f4b", "category_id": "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1", "name": "Poc Chuc",               "price": 95.0},
    {"id": "832b0f76-79c9-4928-9cbe-8e6fbb91e9f5", "category_id": "6015a68c-2e29-48bf-ba5f-a872c0c2a962", "name": "Alitas BBQ",              "price": 75.0},
    {"id": "092ad979-fc22-4faa-a645-8413e1379756", "category_id": "6015a68c-2e29-48bf-ba5f-a872c0c2a962", "name": "Elote Loco",              "price": 25.0},
    {"id": "7b50722d-8b71-4a24-9bde-702d8e12e342", "category_id": "6015a68c-2e29-48bf-ba5f-a872c0c2a962", "name": "Tostadas de Ceviche",     "price": 55.0},
    {"id": "b52aa84f-9a66-4c7f-9813-6fb9db80fc34", "category_id": "6015a68c-2e29-48bf-ba5f-a872c0c2a962", "name": "Papas a la Francesa",     "price": 35.0},
    {"id": "89487e82-e1f4-4a40-a1c6-19a76f8eaa75", "category_id": "889ac393-27f0-4b2d-ae9a-80a8e4331cd5", "name": "Panuchos de Cochinita",   "price": 35.0},
    {"id": "75270afd-e0ca-4863-9614-31042204dcba", "category_id": "889ac393-27f0-4b2d-ae9a-80a8e4331cd5", "name": "Salbutes",                "price": 30.0},
    {"id": "189adf6e-958f-4fea-bfd7-33b9a67c2958", "category_id": "889ac393-27f0-4b2d-ae9a-80a8e4331cd5", "name": "Huevos Motuleños",        "price": 55.0},
    {"id": "1219b439-fc7b-45ca-ab13-82d9d5eef284", "category_id": "889ac393-27f0-4b2d-ae9a-80a8e4331cd5", "name": "Chilaquiles Rojos",       "price": 60.0},
    {"id": "784e60b1-42cf-4a8b-9ea1-78acb65d42ba", "category_id": "8c34c28c-cf17-4175-85aa-85244e83d737", "name": "Dulce de Papaya",         "price": 30.0},
    {"id": "3b61632d-7835-4181-8fa0-9f77c86c946e", "category_id": "8c34c28c-cf17-4175-85aa-85244e83d737", "name": "Cheesecake de Mango",     "price": 55.0},
    {"id": "2ae6910c-5f34-48f2-82a3-0b016f121c01", "category_id": "8c34c28c-cf17-4175-85aa-85244e83d737", "name": "Churros con Chocolate",   "price": 45.0},
    {"id": "c631afb2-8772-436f-8a21-c663a1bc84f6", "category_id": "8c34c28c-cf17-4175-85aa-85244e83d737", "name": "Helado Artesanal",        "price": 35.0},
    {"id": "1bb6bc23-1790-4cfa-aa5c-5a200356dd5d", "category_id": "ca45f53b-2b23-4c38-aa7b-68d13f07927a", "name": "Ensalada César",          "price": 65.0},
    {"id": "30e22de8-fa44-4efc-a90e-c76c1f388408", "category_id": "ca45f53b-2b23-4c38-aa7b-68d13f07927a", "name": "Ensalada de Aguacate",    "price": 70.0},
    {"id": "c57f1c7a-3d2f-4902-857d-aefd5a21050f", "category_id": "ca45f53b-2b23-4c38-aa7b-68d13f07927a", "name": "Ensalada de Pollo",       "price": 75.0},
]

# Category IDs as constants
CAT_BEBIDAS   = "1b32d62d-b66b-4023-b98b-e8c07310b148"
CAT_COMIDAS   = "4d95c0e4-640d-4b03-9f82-7fd5cc03b7d1"
CAT_DESAYUNOS = "889ac393-27f0-4b2d-ae9a-80a8e4331cd5"
CAT_ENSALADAS = "ca45f53b-2b23-4c38-aa7b-68d13f07927a"
CAT_POSTRES   = "8c34c28c-cf17-4175-85aa-85244e83d737"
CAT_SNACKS    = "6015a68c-2e29-48bf-ba5f-a872c0c2a962"

LOW_COST_CATS  = [CAT_BEBIDAS, CAT_SNACKS]
HIGH_COST_CATS = [CAT_COMIDAS, CAT_ENSALADAS]

PRODUCTS_BY_CAT: dict[str, list[dict]] = {}
for p in PRODUCTS:
    PRODUCTS_BY_CAT.setdefault(p["category_id"], []).append(p)
