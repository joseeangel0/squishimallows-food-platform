# UPY Food E-commerce Platform – Squishimallows

Skeleton técnico de una plataforma web de comercio electrónico enfocada en pedidos de comida para la comunidad estudiantil de la UPY. El objetivo principal es capturar y analizar datos sobre el comportamiento de los usuarios dentro del sistema.

## Contexto

El equipo **Squishimallows** desarrolla durante el Sprint 1 una base técnica funcional y revisable. La plataforma no es una aplicación comercial completa — es una infraestructura diseñada para capturar sesiones, navegación, búsquedas, visualizaciones de productos, eventos de carrito, órdenes completadas y patrones de consumo que sirvan como base para responder las preguntas de investigación del equipo.

## Sprint Goal

Entregar un skeleton funcional y documentado que incluya:

- Estructura inicial del repositorio
- Modelo y schema de base de datos (Supabase/PostgreSQL)
- API skeleton (Next.js API Routes)
- Scripts de generación de datos sintéticos (Python)
- Archivos de muestra en CSV, JSON y Excel
- Frontend skeleton con vistas mínimas
- Checklist de QA
- Configuración básica de GitHub Actions

## Estructura del repositorio

```text
.
├── frontend/          # Next.js app (frontend + API routes)
│   ├── app/
│   │   ├── page.tsx           # Catálogo de productos
│   │   ├── search/page.tsx    # Búsqueda
│   │   ├── cart/page.tsx      # Carrito
│   │   ├── order/page.tsx     # Resumen de orden
│   │   └── api/               # API skeleton
│   │       ├── products/
│   │       ├── categories/
│   │       ├── sessions/
│   │       ├── orders/
│   │       └── events/
│   └── lib/supabase.ts        # Cliente Supabase
├── database/
│   └── schema.sql             # Schema completo con tablas y relaciones
├── scripts/                   # Generación de datos sintéticos (Python)
│   ├── seed.py                # Script principal
│   ├── export.py              # Exporta CSV, JSON y Excel
│   ├── setup.sh               # Setup automático del entorno
│   ├── requirements.txt
│   └── generate_*.py          # Scripts individuales por entidad
├── sample_data/               # Archivos CSV, JSON y Excel generados
├── qa/
│   └── checklist.md           # Checklist de validación del Sprint
├── docs/                      # Documentación adicional
└── .github/
    └── workflows/
        └── skeleton-ci.yml    # GitHub Actions CI
```

## Modelo de datos

Las entidades principales de la plataforma:

| Tabla | Descripción |
|---|---|
| `users` | Usuarios anónimos con device_type |
| `sessions` | Sesiones de navegación con timestamps y duración |
| `categories` | Categorías de productos (Bebidas, Comidas, Snacks, etc.) |
| `products` | Productos con precio y categoría |
| `product_views` | Tiempo de visualización por producto |
| `search_events` | Búsquedas internas y si completaron compra |
| `category_browsing_events` | Tiempo de navegación por categoría |
| `cart_events` | Eventos de carrito: add, abandon, return, checkout |
| `orders` | Órdenes completadas con total y uso de búsqueda |
| `order_items` | Detalle de productos por orden |

## Instalación local

### Frontend (Next.js)

```bash
cd frontend
npm install
cp ../.env.example .env.local   # llena las variables con tus keys de Supabase
npm run dev
```

Abre `http://localhost:3000`

### Scripts Python

```bash
# Opción rápida – crea venv, instala deps, corre seed y export
bash scripts/setup.sh

# O paso a paso
cd scripts
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
python seed.py      # inserta datos sintéticos en Supabase
python export.py    # genera archivos en sample_data/
```

## Variables de entorno

Copia `.env.example` y rellena con tus credenciales de Supabase:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo para scripts Python) |
| `DATABASE_URL` | Conexión directa a PostgreSQL |

## Datos generados

Los scripts en `scripts/` generan datos sintéticos mínimos para validar el schema. La data real es capturada por el frontend cuando usuarios reales interactúan con la plataforma.

| Entidad | Registros sintéticos |
|---|---|
| Usuarios | 3 |
| Sesiones | 5 |
| Eventos por tabla | ~5–15 |

Los archivos exportados en `sample_data/` incluyen CSV y JSON por tabla, más un Excel consolidado (`squishimallows_data.xlsx`).

## CI/CD

El workflow `.github/workflows/skeleton-ci.yml` valida automáticamente en cada push:

1. **Frontend** – lint y build de Next.js
2. **Scripts** – validación de sintaxis Python
3. **Estructura** – verifica que todos los archivos requeridos existen

## Roles del equipo

| Rol | Integrante |
|---|---|
| Scrum Master | Horta Sánchez |
| Product Owner | Romero Cetina |
| Back-end Developer | De Aquino Castellanos |
| Back-end Developer | Hernández León |
| DevOps | Fuentes Marín |
| Front-end Developer | Pech Xool |
| Quality Assurance | Pérez López |
