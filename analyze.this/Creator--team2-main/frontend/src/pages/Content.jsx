import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, RefreshCcw } from 'lucide-react';
import { createContent, deleteContent, listContents } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

function formatCompactNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${n}`;
}

export default function Content() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [contents, setContents] = useState([]);
  const { user } = useAuthContext();
  const canEdit = user?.role === 'creator';

  if (user && user.role !== 'creator') {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-8 text-center">
        <h1 className="text-2xl font-semibold text-text">Access denied</h1>
        <p className="mt-2 text-muted">Only creators can manage content.</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    title: '',
    platform: 'Instagram',
    views: 0,
    likes: 0,
  });

  const canSubmit = useMemo(() => {
    const views = Number(form.views);
    const likes = Number(form.likes);
    return (
      form.title.trim().length > 0 &&
      form.platform.trim().length > 0 &&
      Number.isFinite(views) &&
      views >= 0 &&
      Number.isFinite(likes) &&
      likes >= 0
    );
  }, [form]);

  async function refresh() {
    setError('');
    setLoading(true);
    try {
      const data = await listContents();
      setContents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to load contents');
      setContents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');

    try {
      await createContent({
        title: form.title,
        platform: form.platform,
        views: Number(form.views),
        likes: Number(form.likes),
      });

      setForm({ title: '', platform: form.platform, views: 0, likes: 0 });
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to add content');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(contentId) {
    setError('');
    setLoading(true);
    try {
      await deleteContent(contentId);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to delete');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text">Content</h1>
          <p className="text-muted mt-1">
            {canEdit
              ? 'Add and manage your posts.'
              : 'Browse content in read-only mode. Only creators can add or delete posts.'}
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          className="rounded-xl border border-slate-700/50 bg-surface/60 px-4 py-3 text-text font-medium hover:bg-surface transition-colors flex items-center gap-2"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4">
          <div className="text-red-200 text-sm">{error}</div>
        </div>
      ) : null}

      {canEdit ? (
        <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-text">Add Content</h2>
          </div>

          <form className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={onSubmit}>
            <div className="md:col-span-2">
              <label className="block text-sm text-muted mb-2">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Product launch"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {['Instagram', 'TikTok', 'YouTube', 'X', 'LinkedIn'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Views</label>
              <input
                type="number"
                min={0}
                value={form.views}
                onChange={(e) => setForm((f) => ({ ...f, views: e.target.value }))}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Likes</label>
              <input
                type="number"
                min={0}
                value={form.likes}
                onChange={(e) => setForm((f) => ({ ...f, likes: e.target.value }))}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="lg:col-span-4">
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="w-full rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 text-text font-semibold hover:bg-primary/15 transition-colors disabled:opacity-60 disabled:hover:bg-primary/10"
              >
                {submitting ? 'Adding...' : 'Add Content'}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
          <div className="text-sm text-muted">
            Content creation and deletion are restricted to creator role users. If you need editing access, sign in with a creator account.
          </div>
        </section>
      )}

      {/* List */}
      <section className="bg-surface rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-muted">Your Content</h3>
          <div className="text-sm text-muted">{loading ? 'Loading...' : `${contents.length} item(s)`}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="text-left text-muted text-sm">
                <th className="font-medium py-3">Post ID</th>
                <th className="font-medium py-3">Title</th>
                <th className="font-medium py-3">Platform</th>
                <th className="font-medium py-3">Views</th>
                <th className="font-medium py-3">Likes</th>
                <th className="font-medium py-3">Engagement %</th>
                <th className="font-medium py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-700/50">
                    <td className="py-4">
                      <div className="h-4 w-12 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-48 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-24 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-16 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-16 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-20 rounded bg-slate-700/60 animate-pulse" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="h-9 w-24 rounded bg-slate-700/60 animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : contents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No content found.
                  </td>
                </tr>
              ) : (
                contents.map((p) => {
                  const engagement = p.views > 0 ? (p.likes / p.views) * 100 : 0;
                  return (
                    <tr key={p.id} className="border-t border-slate-700/50 text-sm">
                      <td className="py-4 text-text">{p.id}</td>
                      <td className="py-4 text-text">{p.title}</td>
                      <td className="py-4 text-text">{p.platform}</td>
                      <td className="py-4 text-text">{formatCompactNumber(p.views)}</td>
                      <td className="py-4 text-text">{formatCompactNumber(p.likes)}</td>
                      <td className="py-4 text-text">{engagement.toFixed(2)}%</td>
                      <td className="py-4 text-right">
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => onDelete(p.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/15"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        ) : (
                          <span className="text-sm text-muted">No actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

