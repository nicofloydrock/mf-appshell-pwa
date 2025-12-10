import { useState } from "react";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { RemotePreview } from "./components/shell/RemotePreview";
import { Sidebar } from "./components/shell/Sidebar";
import { ShellHeader } from "./components/shell/ShellHeader";
import { PwaBanner } from "./components/shell/PwaBanner";
import { useNotifications } from "./hooks/useNotifications";
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

  return (
    <div className="min-h-screen px-3 py-6 sm:px-4 lg:px-6">
      <ShellHeader onToggleMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:bg-slate-900/30"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-x-0 top-24 z-30 flex justify-center px-3 lg:left-auto lg:right-6 lg:w-72 lg:justify-end lg:px-0">
            <Sidebar
              microfronts={microfronts}
              active={active}
              onSelect={(mf) => {
                setActive(mf);
                setMenuOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-start">
        <main className="glass w-full flex-1 rounded-2xl p-5 shadow-lg lg:min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Microfront activo
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {active.name}
              </h2>
              <p className="text-sm text-slate-200">{active.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                remote: {active.remote}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                module: {active.module}
              </span>
              <button
                className="rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/80 disabled:opacity-60"
                disabled={forcingRefresh}
                onClick={() => refreshPwa()}
              >
                {forcingRefresh ? "Actualizando..." : "Refrescar PWA"}
              </button>
              <button
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
                onClick={() =>
                  sendNotification(
                    "Notificación de prueba",
                    "Mensaje enviado desde el AppShell",
                  )
                }
              >
                Probar notificación
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div>
              <RemotePreview
                moduleName={active.module}
                loader={remoteLoaders[active.remote]}
                config={configRef}
              />
            </div>
            <div className="glass h-full rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Estado y guía
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>• Vite + React 18 consumiendo remotes vía Module Federation.</li>
                <li>• PWA: usa “Refrescar PWA” para tomar la última versión.</li>
                <li>
                  • Ajusta URLs en <code>src/config/remotes.ts</code> o variables VITE.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      <PwaBanner status={pwaStatus} onRefresh={() => refreshPwa()} onDismiss={dismiss} />
    </div>
  );
}
