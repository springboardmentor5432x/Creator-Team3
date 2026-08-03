export default function ChartWidget({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-surface p-6 shadow-sm transition-colors hover:border-emerald-500/70">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-muted">{title}</h3>
        <div className="h-2 w-2 rounded-full bg-emerald-500/85 shadow-[0_0_0_4px_rgba(16,185,129,0.22)]" />
      </div>
      <div className="h-[280px]">{children}</div>
    </div>
  );
}





