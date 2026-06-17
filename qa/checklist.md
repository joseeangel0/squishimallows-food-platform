# QA Checklist – Sprint 1

## Repositorio

- [x] Repositorio creado en GitHub y compartido con el equipo
- [x] Todos los integrantes tienen al menos un commit
- [x] Estructura de carpetas correcta: `backend/`, `frontend/`, `database/`, `scripts/`, `sample_data/`, `docs/`, `qa/`
- [x] Archivo `.gitignore` configurado (excluye `.env`, `node_modules/`, `.venv/`)

## Base de datos

- [x] `database/schema.sql` existe y contiene todas las tablas
- [x] Tablas cubren todas las variables de investigación del equipo
- [x] Entidades presentes: `users`, `sessions`, `products`, `categories`, `product_views`, `search_events`, `category_browsing_events`, `cart_events`, `orders`, `order_items`
- [x] Relaciones (foreign keys) definidas correctamente
- [x] RLS habilitado en todas las tablas

## Scripts de generación de datos

- [x] `scripts/requirements.txt` existe con dependencias
- [x] `scripts/generate_users.py` genera usuarios anónimos
- [x] `scripts/generate_sessions.py` genera sesiones con timestamps
- [x] `scripts/generate_search_events.py` genera eventos de búsqueda
- [x] `scripts/generate_product_views.py` genera vistas de productos
- [x] `scripts/generate_category_events.py` genera navegación por categoría
- [x] `scripts/generate_cart_events.py` genera eventos de carrito con lógica de abandono
- [x] `scripts/generate_orders.py` genera órdenes completadas
- [x] `scripts/generate_order_items.py` genera detalle de órdenes
- [x] `scripts/seed.py` script principal integra todos los generadores
- [x] `scripts/export.py` exporta datos a CSV, JSON y Excel
- [x] `scripts/setup.sh` automatiza la creación del venv e instalación

## Archivos de muestra

- [x] `sample_data/users.csv` y `users.json`
- [x] `sample_data/sessions.csv` y `sessions.json`
- [x] `sample_data/products.csv` y `products.json`
- [x] `sample_data/categories.csv` y `categories.json`
- [x] `sample_data/orders.csv` y `orders.json`
- [x] `sample_data/order_items.csv` y `order_items.json`
- [x] `sample_data/cart_events.csv` y `cart_events.json`
- [x] `sample_data/search_events.csv` y `search_events.json`
- [x] `sample_data/product_views.csv` y `product_views.json`
- [x] `sample_data/category_browsing_events.csv` y `category_browsing_events.json`
- [x] `sample_data/squishimallows_data.xlsx` con todas las hojas

## API Skeleton (Next.js API Routes)

- [x] `GET /api/products` — listado con filtro por categoría y búsqueda
- [x] `GET /api/categories` — listado de categorías
- [x] `POST /api/sessions` — registro de sesión
- [x] `GET /api/orders` — listado de órdenes
- [x] `POST /api/orders` — creación de orden
- [x] `POST /api/events` — registro de eventos de comportamiento

## Frontend Skeleton

- [x] Vista de catálogo de productos (`/`)
- [x] Vista de búsqueda (`/search`)
- [x] Vista de carrito (`/cart`)
- [x] Vista de resumen de orden (`/order`)
- [x] Filtro por categoría funcional
- [x] Conexión a Supabase desde el frontend

## CI/CD

- [x] `.github/workflows/skeleton-ci.yml` configurado
- [x] Job: build y lint del frontend
- [x] Job: validación de sintaxis de scripts Python
- [x] Job: verificación de archivos requeridos

## README

- [x] Descripción del proyecto
- [x] Estructura del repositorio
- [x] Instrucciones de instalación local
- [x] Instrucciones de ejecución
- [x] Roles del equipo
- [x] Descripción de datos generados
