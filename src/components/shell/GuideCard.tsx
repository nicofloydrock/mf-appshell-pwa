type Props = {
  title: string;
  items: string[];
};

export function GuideCard({ title, items }: Props) {
  return (
    <div className="glass h-full rounded-2xl border border-white/10 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
