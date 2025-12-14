// Header del host: branding, estado de federación y toggle de menú.
type Props = {
  onToggleMenu: () => void;
  menuOpen: boolean;
  copy: {
    code: string;
    subtitle: string;
    title: string;
    status: string;
  };
};

export function ShellHeader({ onToggleMenu, menuOpen, copy }: Props) {
  return (
    <header className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 shadow-glow sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-black text-white">
          {copy.code}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-300">
            {copy.subtitle}
          </p>
          <h1 className="text-xl font-semibold text-white">{copy.title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
          {copy.status}
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
