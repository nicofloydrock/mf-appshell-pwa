import type { PwaStatus } from "../../hooks/usePwaUpdate";

type Props = {
  status: PwaStatus;
  onRefresh: () => void;
  onDismiss: () => void;
  copy: {
    offlineTitle: string;
    offlineMessage: string;
    updateTitle: string;
    updateMessage: string;
    updateCta: string;
    dismissCta: string;
  };
};

export function PwaBanner({ status, onRefresh, onDismiss, copy }: Props) {
  if (status === "idle") return null;

  const isOffline = status === "offline";

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-lg backdrop-blur">
      <p className="text-sm font-semibold text-white">
        {isOffline ? copy.offlineTitle : copy.updateTitle}
      </p>
      <p className="mt-1 text-xs text-slate-300">
        {isOffline ? copy.offlineMessage : copy.updateMessage}
      </p>
      <div className="mt-3 flex gap-2">
        {status === "update" && (
          <button
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
            onClick={onRefresh}
          >
            {copy.updateCta}
          </button>
        )}
        <button
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100 transition hover:-translate-y-0.5"
          onClick={onDismiss}
        >
          {copy.dismissCta}
        </button>
      </div>
    </div>
  );
}
