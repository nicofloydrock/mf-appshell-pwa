import type { Microfront } from "../../types/microfront";

type Props = {
  active: Microfront;
  refreshing: boolean;
  onRefresh: () => void;
  onNotify: () => void;
  copy: {
    activeLabel: string;
    remoteLabel: string;
    moduleLabel: string;
    refreshingLabel: string;
    pwaCta: string;
    notifyCta: string;
  };
};

export function ShellHero({ active, refreshing, onRefresh, onNotify, copy }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">
          {copy.activeLabel}
        </p>
        <h2 className="text-2xl font-semibold text-white">{active.name}</h2>
        <p className="text-sm text-slate-200">{active.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
          {copy.remoteLabel}: {active.remote}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
          {copy.moduleLabel}: {active.module}
        </span>
        <button
          className="rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/80 disabled:opacity-60"
          disabled={refreshing}
          onClick={onRefresh}
        >
          {refreshing ? copy.refreshingLabel : copy.pwaCta}
        </button>
        <button
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
          onClick={onNotify}
        >
          {copy.notifyCta}
        </button>
      </div>
    </div>
  );
}
