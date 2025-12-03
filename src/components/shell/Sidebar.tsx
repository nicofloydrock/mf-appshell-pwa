import type { Microfront } from "../../types/microfront";

type Props = {
  microfronts: Microfront[];
  active: Microfront;
  onSelect: (mf: Microfront) => void;
  menuOpen: boolean;
};

export function Sidebar({ microfronts, active, onSelect, menuOpen }: Props) {
  return (
    <nav
      className={`glass z-10 rounded-2xl p-4 shadow-lg transition-all sm:block ${
        menuOpen ? "block" : "hidden sm:block"
      } lg:w-72`}
    >
      <div className="flex items-center justify-between pb-3">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Menú ({microfronts.length} microfronts)
        </p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
          Module Federation
        </span>
      </div>
      <div className="space-y-3">
        {microfronts.map((mf) => (
          <button
            key={mf.id}
            onClick={() => onSelect(mf)}
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
  );
}
