/* ─────────────────────────────────────────────────────────────────────────────
   Amit Chakraborty Portfolio — Service Worker
   Strategy:
   • Shell + static assets: Cache-first (cached on install)
   • Navigation (HTML): Network-first → cache → offline.html fallback
   • Fonts / images: Cache-first, cache on miss
   • API calls (/api/*): Network-only, never cached
───────────────────────────────────────────────────────────────────────────── */

const CACHE_VERSION = "amit-portfolio-v1";
const STATIC_SHELL = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(STATIC_SHELL))
      .then(() => self.skipWaiting()),
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. API calls — network only, no caching
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server/")) {
    return; // let browser handle normally
  }

  // 2. Non-GET requests — pass through
  if (request.method !== "GET") return;

  // 3. Cross-origin requests (CDN fonts, etc.) — cache-first
  if (url.origin !== self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 4. HTML navigation — network-first with offline fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // 5. Everything else (JS, CSS, images) — cache-first
  event.respondWith(cacheFirst(request));
});

// ── Strategies ────────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline — resource not cached.", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try cache
    const cached = await caches.match(request);
    if (cached) return cached;
    // Try root
    const root = await caches.match("/");
    if (root) return root;
    // Offline fallback page
    const offline = await caches.match("/offline.html");
    return offline ?? new Response("You are offline.", { status: 503 });
  }
}
