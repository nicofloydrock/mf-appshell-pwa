import { useEffect, useMemo, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

const remoteLoaders = {
  catalog: () => import("catalog/App"),
  agente: () => import("agente/App"),
};

type Microfront = {
  id: string;
  name: string;
  description: string;
  remote: keyof typeof remoteLoaders;
  module: string;
  accent: string;
};

const microfronts: Microfront[] = [
  {
    id: "catalog",
    name: "Catálogo",
    description: "Listado principal de productos y colecciones.",
    remote: "catalog",
    module: "App",
    accent: "from-sky-400 to-blue-600",
  },
  {
    id: "agente",
    name: "Agente",
    description: "Chat de operador con traducción en vivo.",
    remote: "agente",
    module: "App",
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    id: "pwa-test",
    name: "PWA Refresh",
    description: "Menú para probar actualización del SW sin reinstalar.",
    remote: "catalog",
    module: "App",
    accent: "from-slate-400 to-slate-600",
  },
];

type PwaStatus = "idle" | "offline" | "update";

function RemotePreview({ remote }: { remote: Microfront }) {
  const loader = useMemo(() => remoteLoaders[remote.remote], [remote.remote]);
  const [Component, setComponent] =
    useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComponent(null);
    setError(null);

    let active = true;
    setLoading(true);
    loader()
      .then((mod) => {
        if (!active) return;
        const resolved =
          (mod as Record<string, unknown>)?.default ||
          (mod as Record<string, unknown>)?.[remote.module] ||
          Object.values(mod || {})[0];
        if (typeof resolved === "function") {
          setComponent(() => resolved as React.ComponentType);
        } else {
          setError(new Error("Export no encontrado"));
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [loader, remote.id, remote.module]);

  if (loading) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl border border-white/10 bg-white/5">
        <p className="text-sm text-slate-200">Cargando microfront...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl border border-amber-400/40 bg-amber-500/10 text-sm text-amber-100">
        <p>
          No se pudo montar el remote (
          <span className="font-semibold">{remote.remote}</span>):{" "}
          {error.message}
        </p>
      </div>
    );
  }

  if (Component) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <Component />
      </div>
    );
  }

  return (
    <div className="grid h-64 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-200">
      <p>Selecciona un microfront para montarlo aquí.</p>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<Microfront>(microfronts[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwaStatus, setPwaStatus] = useState<PwaStatus>("idle");
  const updateSWRef =
    useRef<null | ((reloadPage?: boolean) => Promise<void>)>(null);
  const [swVersion, setSwVersion] = useState<number>(() =>
    Math.floor(Date.now() / 1000),
  );

  useEffect(() => {
    const updateSW = registerSW({
      onOfflineReady() {
        setPwaStatus("offline");
      },
      onNeedRefresh() {
        setPwaStatus("update");
      },
      onRegisterError(error) {
        console.warn("SW registration failed", error);
      },
    });
    updateSWRef.current = updateSW;
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <header className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 shadow-glow sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-black text-white">
            AS
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-300">
              App Shell
            </p>
            <h1 className="text-xl font-semibold text-white">
              Microfrontends React 18 + Vite
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
            Host listo para federación
          </div>
          <button
            className="sm:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
              {menuOpen ? "✕" : "☰"}
            </div>
          </button>
        </div>
      </header>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-4 lg:flex-row">
        <nav
          className={`glass z-10 rounded-2xl p-4 shadow-lg transition-all sm:block ${
            menuOpen ? "block" : "hidden sm:block"
          } lg:w-72`}
        >
          <div className="flex items-center justify-between pb-3">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Menú (3 microfronts)
            </p>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
              Module Federation
            </span>
          </div>
          <div className="space-y-3">
            {microfronts.map((mf) => (
              <button
                key={mf.id}
                onClick={() => {
                  setActive(mf);
                  setMenuOpen(false);
                }}
                className={`w-full rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                  active.id === mf.id
                    ? "border-white/30 bg-white/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <div
                  className={`mb-2 h-10 w-10 rounded-lg bg-gradient-to-br ${mf.accent}`}
                />
                <p className="text-sm font-semibold text-white">{mf.name}</p>
                <p className="text-xs text-slate-300">{mf.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {mf.remote}/{mf.module}
                </div>
              </button>
            ))}
          </div>
        </nav>

        <main className="glass flex-1 rounded-2xl p-5 shadow-lg">
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
                className="rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/80"
                onClick={() => {
                  setPwaStatus("update");
                  setSwVersion(Math.floor(Date.now() / 1000));
                  updateSWRef.current?.(true);
                }}
              >
                Refrescar PWA
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div>
              <RemotePreview remote={active} />
            </div>
            <div className="glass h-full rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Estado y guía
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>
                  • Vite + React 18 listo para consumir remotes vía Module
                  Federation.
                </li>
                <li>• Tailwind configurado para el shell y estilos base.</li>
                <li>
                  • Usa los remotes definidos en <code>vite.config.ts</code>.
                </li>
                <li>
                  • Ajusta URLs de <code>remoteEntry.js</code> según tus
                  microfronts.
                </li>
                <li>
                  • Menú responsive: hamburguesa en móvil, panel lateral en
                  desktop.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      {pwaStatus !== "idle" && (
        <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-lg backdrop-blur">
          <p className="text-sm font-semibold text-white">
            {pwaStatus === "offline"
              ? "Listo para uso offline"
              : "Nueva versión disponible"}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            {pwaStatus === "offline"
              ? "Puedes seguir usando la app sin conexión."
              : "Actualiza para cargar la última versión."}
          </p>
          <div className="mt-3 flex gap-2">
            {pwaStatus === "update" && (
              <button
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
                onClick={() => {
                  setPwaStatus("idle");
                  updateSWRef.current?.(true);
                }}
              >
                Actualizar
              </button>
            )}
            <button
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100 transition hover:-translate-y-0.5"
              onClick={() => setPwaStatus("idle")}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
