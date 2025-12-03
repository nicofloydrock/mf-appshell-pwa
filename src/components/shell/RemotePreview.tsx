import { useEffect, useMemo, useState } from "react";

type Props = {
  moduleName: string;
  loader: () => Promise<unknown>;
  config?: unknown;
};

export function RemotePreview({ moduleName, loader, config }: Props) {
  const memoizedLoader = useMemo(() => loader, [loader]);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComponent(null);
    setError(null);

    let active = true;
    setLoading(true);
    memoizedLoader()
      .then((mod) => {
        if (!active) return;
        const resolved =
          (mod as Record<string, unknown>)?.default ||
          (mod as Record<string, unknown>)?.[moduleName] ||
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
  }, [memoizedLoader, moduleName]);

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
        <p>{error.message}</p>
      </div>
    );
  }

  if (Component) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <Component config={config} />
      </div>
    );
  }

  return (
    <div className="grid h-64 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-200">
      <p>Selecciona un microfront para montarlo aquí.</p>
    </div>
  );
}
