# UPY Food E-commerce Platform

Skeleton tecnico de una plataforma web de comercio electronico enfocada en pedidos de comida para la comunidad UPU.

## Contexto

El equipo Squishimallows desarrollara durante el Sprint 1 una base tecnica funcional y revisable. El objetivo principal no es construir una aplicacion comercial completa, sino preparar una estructura que permita capturar, organizar y generar datos sobre comportamiento de usuarios dentro de una plataforma de pedidos de comida.

Los datos generados serviran como base para analizar sesiones, navegacion, busquedas, visualizaciones de productos, eventos de carrito, abandono de carrito, ordenes completadas, categorias de productos, montos de compra y patrones de consumo.

## Sprint Goal

Entregar un skeleton funcional y documentado que incluya:

- Estructura inicial del repositorio.
- Modelo y schema de base de datos.
- API skeleton.
- Scripts de generacion de datos sinteticos.
- Archivos de muestra en CSV, JSON y Excel.
- Frontend skeleton minimo.
- Checklist de QA.
- Configuracion basica de GitHub Actions.

## Alcance del Sprint 1

Incluido:

- Repositorio organizado para revision.
- Backend skeleton con endpoints representativos.
- Frontend skeleton con vistas minimas.
- Base de datos con entidades principales.
- Generacion de datos sinteticos.
- Documentacion tecnica inicial.

Fuera de alcance:

- Autenticacion real.
- Pasarela de pagos.
- Dashboard estadistico final.
- Analisis estadistico completo.
- Diseno visual avanzado.
- Despliegue productivo.

## Estructura del repositorio

```text
.
├── backend/       # API skeleton y logica base del servidor
├── database/      # Schema SQL y documentacion del modelo de datos
├── docs/          # Documentacion de apoyo del Sprint
├── frontend/      # Vistas minimas del skeleton visual
├── qa/            # Checklist y validaciones de calidad
├── sample_data/   # Archivos generados en CSV, JSON y Excel
├── scripts/       # Scripts para generar datos sinteticos
└── .github/       # Configuracion de GitHub Actions
```

## Modelo de datos minimo

Las entidades principales consideradas para el Sprint son:

- `users`
- `sessions`
- `categories`
- `products`
- `product_views`
- `category_browsing_events`
- `search_events`
- `cart_events`
- `cart_abandonment`
- `orders`
- `order_items`

## Roles del equipo

- Scrum Master: Horta Sanchez
- Product Owner: Romero Cetina
- Back-end Developer: De Aquino Castellanos
- Back-end Developer: Hernandez Leon
- DevOps: Fuentes Marin
- Front-end Developer: Pech Xool
- Quality Assurance: Perez Lopez

## Estado actual

Sprint 1 en construccion.

Tareas iniciales:

- T01: Crear repositorio del equipo.
- T03: Definir estructura inicial de carpetas.
- T04: Crear README.md inicial.

