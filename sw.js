// KM0 offline copy. Network first, so a new version shows up as soon as you're online;
// the cache answers when there is no connection.
const CACHE = "km0-v1.5";
const CORE = [
  "./", "index.html", "styles.css", "app.js", "vocab.js", "verbs.js", "manifest.webmanifest",
  "fonts/B612-400.woff2", "fonts/B612-400i.woff2", "fonts/B612-700.woff2",
  "fonts/B612Mono-400.woff2", "fonts/B612Mono-700.woff2", "fonts/Doto-900.woff2",
  "icons/favicon.ico", "icons/favicon-32x32.png", "icons/android-chrome-192x192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
