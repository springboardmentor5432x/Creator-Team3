import { useMemo } from 'react';

export default function StubPage({ title, subtitle }) {
  const gradient = useMemo(() => {
    const map = {
      audience: 'from-indigo-500/30 to-emerald-500/20',
      settings: 'from-purple-500/30 to-pink-500/20',
      default: 'from-primary/30 to-secondary/20',
    };
    return map[title?.toLowerCase?.()] || map.default;
  }, [title]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-surface p-6">
        <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </div>
        <p className="text-muted mt-2">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-surface p-6">
        <p className="text-text font-medium">This page is a simple manual UI placeholder.</p>
        <p className="text-muted mt-2">
          Replace with real API integration later.
        </p>
      </div>
    </div>
  );
}

