/// <reference lib="webworker" />
// eslint-disable-next-line no-restricted-globals
import { clientsClaim } from "workbox-core";
// eslint-disable-next-line no-restricted-globals
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<import("workbox-build").ManifestEntry>;
};

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener("message", (event) => {
  const data = event.data as
    | { type?: "PING" }
    | { type?: "NOTIFY"; title?: string; body?: string };

  if (data?.type === "PING") {
    event.ports?.[0]?.postMessage({ type: "PONG" });
    return;
  }

  if (data?.type === "NOTIFY") {
    const title = data.title ?? "Notificación";
    const body = data.body ?? "Mensaje recibido desde el cliente.";
    event.waitUntil(self.registration.showNotification(title, { body }));
  }
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() ?? {};
  const title = payload.title ?? "Push recibido";
  const body = payload.body ?? "Tienes una nueva actualización.";
  event.waitUntil(self.registration.showNotification(title, { body }));
});
