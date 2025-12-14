// Config global que se pasa a remotos: usuario/tokens dummy, auth simulado y helper de notify.
import { buildAuthContext } from "./authConfig";

export class AppConfig {
  user = { id: "operator-1", name: "Operador Demo" };
  token = "NICORIVERA";
  auth = buildAuthContext(this.token, this.user);

  async notify(
    message: string,
    options?: { title?: string; target?: string },
  ) {
    const title = options?.title ?? "Aviso del host";
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: "NOTIFY",
          title,
          body: message,
          target: options?.target,
        });
        return;
      }
    }
    // Fallback simple
    alert(message);
  }
}
