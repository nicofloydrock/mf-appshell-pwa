export class AppConfig {
  user = { id: "operator-1", name: "Operador Demo" };

  async notify(message: string) {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: "NOTIFY",
          title: "Aviso del host",
          body: message,
        });
        return;
      }
    }
    // Fallback simple
    alert(message);
  }
}
