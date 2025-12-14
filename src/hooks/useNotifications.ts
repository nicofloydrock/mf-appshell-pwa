// Hook ligero para pedir permisos y enviar notificaciones vía Service Worker.
export function useNotifications() {
  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const res = await Notification.requestPermission();
    return res === "granted";
  };

  const send = async (title: string, body: string) => {
    const granted = await requestPermission();
    if (!granted) return false;
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "NOTIFY", title, body });
    return true;
  };

  return { requestPermission, send };
}
