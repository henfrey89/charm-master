// Charm Master service worker: network first, falls back to the last copy if offline.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) {
    var copy = res.clone();
    caches.open('charm-master-v1').then(function (c) { c.put(r, copy); }).catch(function () {});
    return res;
  }).catch(function () { return caches.match(r); }));
});
