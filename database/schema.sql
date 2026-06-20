-- ============================================================
-- Squishimallows – UPY Food E-commerce Platform
-- Schema SQL – Sprint 1
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id           uuid primary key default extensions.uuid_generate_v4(),
  category_id  uuid references public.categories(id),
  name         text not null,
  description  text,
  price        numeric not null check (price >= 0),
  image_url    text,
  is_available boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.products enable row level security;

-- ============================================================
-- USERS  (anonymous – no real auth)
-- ============================================================
create table if not exists public.users (
  id            uuid primary key default extensions.uuid_generate_v4(),
  anonymous_id  text not null unique,
  device_type   text,
  created_at    timestamptz not null default now()
);

alter table public.users enable row level security;

-- ============================================================
-- SESSIONS
-- Research: cart abandonment return, search bar vs AOV, purchase frequency
-- ============================================================
create table if not exists public.sessions (
  id               uuid primary key default extensions.uuid_generate_v4(),
  user_id          uuid references public.users(id),
  device_type      text,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  duration_seconds integer,
  day_of_week      smallint,
  hour_of_day      smallint
);

alter table public.sessions enable row level security;

-- ============================================================
-- PRODUCT VIEWS
-- Research: time spent viewing → add to cart correlation
-- ============================================================
create table if not exists public.product_views (
  id                uuid primary key default extensions.uuid_generate_v4(),
  session_id        uuid references public.sessions(id),
  user_id           uuid references public.users(id),
  product_id        uuid references public.products(id),
  category_id       uuid references public.categories(id),
  view_start        timestamptz not null default now(),
  view_end          timestamptz,
  time_spent_seconds integer,
  added_to_cart     boolean not null default false
);

alter table public.product_views enable row level security;

-- ============================================================
-- CART EVENTS
-- Research: cart abandonment return behavior
-- event_type: add | remove | abandon | return | checkout
-- ============================================================
create table if not exists public.cart_events (
  id                        uuid primary key default extensions.uuid_generate_v4(),
  session_id                uuid references public.sessions(id),
  user_id                   uuid references public.users(id),
  product_id                uuid references public.products(id),
  event_type                text not null check (event_type = any(array['add','remove','abandon','return','checkout'])),
  items_in_cart             integer,
  cart_total                numeric,
  cart_add_timestamp        timestamptz,
  cart_abandon_timestamp    timestamptz,
  return_timestamp          timestamptz,
  same_session_return       boolean,
  time_to_return_seconds    integer,
  pages_visited_before_abandon integer,
  last_page_before_abandon  text,
  purchase_completed        boolean default false,
  created_at                timestamptz not null default now()
);

alter table public.cart_events enable row level security;

-- ============================================================
-- SEARCH EVENTS
-- Research: search bar use → higher Average Order Value (AOV)
-- ============================================================
create table if not exists public.search_events (
  id                uuid primary key default extensions.uuid_generate_v4(),
  session_id        uuid references public.sessions(id),
  user_id           uuid references public.users(id),
  query             text,
  results_count     integer,
  used_search       boolean not null default true,
  completed_purchase boolean not null default false,
  order_total       numeric,
  created_at        timestamptz not null default now()
);

alter table public.search_events enable row level security;

-- ============================================================
-- CATEGORY BROWSING EVENTS
-- Research: category browsing time → add to cart correlation
-- ============================================================
create table if not exists public.category_browsing_events (
  id                uuid primary key default extensions.uuid_generate_v4(),
  session_id        uuid references public.sessions(id),
  user_id           uuid references public.users(id),
  category_id       uuid references public.categories(id),
  browse_start      timestamptz not null default now(),
  browse_end        timestamptz,
  time_spent_seconds integer,
  products_viewed   integer not null default 0,
  added_to_cart     boolean not null default false
);

alter table public.category_browsing_events enable row level security;

-- ============================================================
-- ORDERS
-- Research: low-cost vs high-cost purchase frequency, search → AOV
-- status: completed | cancelled | pending
-- ============================================================
create table if not exists public.orders (
  id           uuid primary key default extensions.uuid_generate_v4(),
  session_id   uuid references public.sessions(id),
  user_id      uuid references public.users(id),
  order_total  numeric not null check (order_total >= 0),
  used_search  boolean not null default false,
  completed_at timestamptz not null default now(),
  day_of_week  smallint,
  hour_of_day  smallint,
  status       text not null default 'completed' check (status = any(array['completed','cancelled','pending']))
);

alter table public.orders enable row level security;

-- ============================================================
-- ORDER ITEMS
-- Research: co-purchase cliques by product category
-- ============================================================
create table if not exists public.order_items (
  id          uuid primary key default extensions.uuid_generate_v4(),
  order_id    uuid references public.orders(id),
  product_id  uuid references public.products(id),
  category_id uuid references public.categories(id),
  quantity    integer not null default 1 check (quantity > 0),
  unit_price  numeric not null check (unit_price >= 0),
  subtotal    numeric not null check (subtotal >= 0)
);

alter table public.order_items enable row level security;

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id                uuid primary key default extensions.uuid_generate_v4(),
  product_id        uuid not null references public.products(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  user_email        text not null,
  rating            smallint not null check (rating >= 1 and rating <= 5),
  comment           text,
  verified_purchase boolean default false,
  created_at        timestamptz default now(),
  unique (product_id, user_id)
);

alter table public.reviews enable row level security;

-- ============================================================
-- ADMIN USERS
-- ============================================================
create table if not exists public.admin_users (
  id         uuid primary key default extensions.uuid_generate_v4(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_sessions_user_id         on public.sessions(user_id);
create index if not exists idx_product_views_session    on public.product_views(session_id);
create index if not exists idx_product_views_product    on public.product_views(product_id);
create index if not exists idx_cart_events_session      on public.cart_events(session_id);
create index if not exists idx_cart_events_event_type   on public.cart_events(event_type);
create index if not exists idx_search_events_session    on public.search_events(session_id);
create index if not exists idx_orders_user_id           on public.orders(user_id);
create index if not exists idx_order_items_order_id     on public.order_items(order_id);
create index if not exists idx_order_items_product_id   on public.order_items(product_id);
