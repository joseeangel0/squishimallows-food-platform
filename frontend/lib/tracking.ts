"use client";

const USER_KEY    = "sq_user_id";
const SESSION_KEY = "sq_session_id";

function getDeviceType(): string {
  if (typeof navigator === "undefined") return "desktop";
  return /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

async function getOrCreateUser(): Promise<string> {
  const stored = localStorage.getItem(USER_KEY);
  if (stored) return stored;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      anonymous_id: crypto.randomUUID(),
      device_type: getDeviceType(),
    }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  localStorage.setItem(USER_KEY, data.id);
  return data.id;
}

async function getOrCreateSession(userId: string): Promise<string> {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return stored;

  const now = new Date();
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      device_type: getDeviceType(),
      day_of_week: now.getDay(),
      hour_of_day: now.getHours(),
    }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  localStorage.setItem(SESSION_KEY, data.id);
  return data.id;
}

export async function initTracking(): Promise<void> {
  const userId    = await getOrCreateUser();
  if (!userId) return;
  await getOrCreateSession(userId);
}

export function getTrackingIds(): { userId: string | null; sessionId: string | null } {
  if (typeof localStorage === "undefined") return { userId: null, sessionId: null };
  return {
    userId:    localStorage.getItem(USER_KEY),
    sessionId: localStorage.getItem(SESSION_KEY),
  };
}

export function logProductView(productId: string, timeSpentSeconds: number, addedToCart: boolean): void {
  const { userId, sessionId } = getTrackingIds();
  if (!sessionId) return;
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "product_view",
      session_id: sessionId,
      user_id: userId,
      product_id: productId,
      time_spent_seconds: timeSpentSeconds,
      added_to_cart: addedToCart,
    }),
  }).catch(() => {});
}

export function logCartAdd(productId: string, itemsInCart: number, cartTotal: number): void {
  const { userId, sessionId } = getTrackingIds();
  if (!sessionId) return;
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "cart",
      session_id: sessionId,
      user_id: userId,
      product_id: productId,
      event_type: "add",
      items_in_cart: itemsInCart,
      cart_total: cartTotal,
      cart_add_timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}
