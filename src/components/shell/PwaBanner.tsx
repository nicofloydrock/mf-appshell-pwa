import type { PwaStatus } from "../../hooks/usePwaUpdate";

type Props = {
  status: PwaStatus;
  onRefresh: () => void;
  onDismiss: () => void;
};

export function PwaBanner({ status, onRefresh, onDismiss }: Props) {
  if (status === "idle") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-lg backdrop-blur">
      <p className="text-sm font-semibold text-white">
        {status === "offline" ? "Listo para uso offline" : "Nueva versión disponible"}
      </p>
      <p className="mt-1 text-xs text-slate-300">
        {status === "offline"
          ? "Puedes seguir usando la app sin conexión."
          : "Actualiza para cargar la última versión."}
      </p>
      <div className="mt-3 flex gap-2">
        {status === "update" && (
          <button
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
            onClick={onRefresh}
          >
            Actualizar
          </button>
        )}
        <button
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100 transition hover:-translate-y-0.5"
          onClick={onDismiss}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
