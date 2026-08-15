import { useEffect, useMemo } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterDrawer({
  open,
  onClose,
  values,
  onChange,
  onReset,
}) {
  const countries = useMemo(
    () => [
      'All',
      'United States',
      'India',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Brazil',
      'Mexico',
      'Japan',
      'South Korea',
      'Spain',
      'Italy',
      'Netherlands',
      'Sweden',
      'Norway',
      'Turkey',
      'Saudi Arabia',
      'United Arab Emirates',
      'South Africa',
    ],
    []
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[360px] max-w-[92vw] bg-surface border-l border-slate-700/50 shadow-2xl transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="p-5 border-b border-slate-700/50 bg-emerald-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Filters</h2>
              <p className="text-sm text-muted">Refine your audience view</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-800/50 border border-slate-700/50 text-muted hover:text-text transition-colors"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-[calc(100%-76px)]">
          <div className="space-y-6">
            <section>
              <p className="text-sm font-semibold text-muted mb-3">Content</p>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-text">Show insights</p>
                  <p className="text-sm text-muted mt-1">Toggle hints and notes</p>
                </div>
                <input
                  type="checkbox"
                  checked={values.showInsights}
                  onChange={(e) => onChange?.({ ...values, showInsights: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800/50 text-emerald-400 focus:ring-emerald-400"
                />
              </label>
            </section>

            <section>
              <p className="text-sm font-semibold text-muted mb-3">Audience</p>

              <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <p className="text-sm text-muted mb-2">Country</p>
                <select
                  value={values.country}
                  onChange={(e) => onChange?.({ ...values, country: e.target.value })}
                  className="w-full rounded-xl border border-emerald-400/30 bg-slate-800/30 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <p className="text-sm font-semibold text-muted mb-3">Time range</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '7d', label: '7D' },
                  { value: '30d', label: '30D' },
                  { value: '90d', label: '90D' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange?.({ ...values, period: option.value })}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${values.period === option.value ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700/50 bg-slate-900/20 text-text hover:bg-slate-800/40'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <button
                type="button"
                onClick={onReset}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-text font-medium hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-4 h-4" />
                Reset filters
              </button>
            </section>
          </div>
        </div>
      </aside>
    </>
  );
}

