// Entrada del AppShell: orquesta la UI del host, monta remotos vía Module Federation y propaga config/auth dummy.
import { useState } from "react";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { ShellHeader } from "./components/shell/ShellHeader";
import { useNotifications } from "./hooks/useNotifications";
import { PwaBanner } from "./components/shell/PwaBanner";
import { ShellMain } from "./components/shell/ShellMain";
import { MenuDrawer } from "./components/shell/MenuDrawer";
import shellCopy from "./content/shell.json";
import { AppConfig } from "./config/appConfig";
import { microfronts, remoteLoaders } from "./constants/microfronts";
import type { Microfront } from "./types/microfront";

export default function App() {
  const initial = (() => {
    const param = new URLSearchParams(window.location.search).get("remote");
    const found = microfronts.find((m) => m.id === param);
    return found ?? microfronts[0];
  })();
  const [active, setActive] = useState<Microfront>(initial);
  const [menuOpen, setMenuOpen] = useState(false);
  const { status: pwaStatus, refresh: refreshPwa, dismiss, forcingRefresh } =
    usePwaUpdate();
  const { send: sendNotification } = useNotifications();
  const configRef = useState(() => new AppConfig())[0];
  const notify = () =>
    sendNotification(shellCopy.notifications.title, shellCopy.notifications.message);

  return (
    <div className="min-h-screen px-3 py-6 sm:px-4 lg:px-6">
      <ShellHeader
        copy={shellCopy.header}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        microfronts={microfronts}
        active={active}
        onSelect={(mf) => setActive(mf)}
        copy={shellCopy.menu}
      />

      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-start">
        <ShellMain
          active={active}
          refreshing={forcingRefresh}
          onRefresh={() => refreshPwa()}
          onNotify={notify}
          loader={remoteLoaders[active.remote]}
          config={configRef}
          copy={{ hero: shellCopy.hero, remotePreview: shellCopy.remotePreview }}
        />
      </div>

      <PwaBanner
        status={pwaStatus}
        onRefresh={() => refreshPwa()}
        onDismiss={dismiss}
        copy={shellCopy.pwaBanner}
      />
    </div>
  );
}
