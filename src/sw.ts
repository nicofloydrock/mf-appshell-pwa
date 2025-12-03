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
    | { type?: "NOTIFY"; title?: string; body?: string; target?: string };

  if (data?.type === "PING") {
    event.ports?.[0]?.postMessage({ type: "PONG" });
    return;
  }

  if (data?.type === "NOTIFY") {
    const title = data.title ?? "Notificación";
    const body = data.body ?? "Mensaje recibido desde el cliente.";
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        data: { target: data.target },
      }),
    );
  }
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() ?? {};
  const title = payload.title ?? "Push recibido";
  const body = payload.body ?? "Tienes una nueva actualización.";
  event.waitUntil(self.registration.showNotification(title, { body }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data as any)?.target;
  const url = target ? `/?remote=${target}` : "/";
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window" });
      const client = allClients.find((c) => "focus" in c) as
        | WindowClient
        | undefined;
      if (client) {
        await client.navigate(url);
        return client.focus();
      }
      return self.clients.openWindow(url);
    })(),
  );
});
