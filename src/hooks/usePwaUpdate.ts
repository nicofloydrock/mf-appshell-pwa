import { useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export type PwaStatus = "idle" | "offline" | "update";

export function usePwaUpdate() {
  const [status, setStatus] = useState<PwaStatus>("idle");
  const [forcingRefresh, setForcingRefresh] = useState(false);
  const [version, setVersion] = useState(() => Date.now());
  const updaterRef =
    useRef<null | ((reloadPage?: boolean) => Promise<void>)>(null);

  useEffect(() => {
    const updateSW = registerSW({
      onOfflineReady: () => setStatus("offline"),
      onNeedRefresh: () => setStatus("update"),
      onRegisterError: (err) => console.warn("SW registration failed", err),
    });
    updaterRef.current = updateSW;
  }, []);

  const refresh = async () => {
    setStatus("update");
    setVersion(Date.now());
    setForcingRefresh(true);
    try {
      if (updaterRef.current) {
        await updaterRef.current(true);
      }
      const reg = await navigator.serviceWorker.getRegistration();
      await reg?.update();
    } catch (err) {
      console.warn("SW refresh failed", err);
    } finally {
      setForcingRefresh(false);
      const url = new URL(window.location.href);
      url.searchParams.set("pwa_ts", Date.now().toString());
      window.location.replace(url.toString());
    }
  };

  const dismiss = () => setStatus("idle");

  return { status, refresh, dismiss, forcingRefresh, version };
}
