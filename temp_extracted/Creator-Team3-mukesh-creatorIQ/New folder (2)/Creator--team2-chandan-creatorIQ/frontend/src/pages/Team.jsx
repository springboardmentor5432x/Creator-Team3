import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
});

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [formLoading, setFormLoading] = useState(false);

  async function fetchMembers() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/team/', { headers: authHeaders() });
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const message = err?.response?.data?.detail || 'Failed to load team members.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(memberId) {
    const ok = window.confirm('Delete this team member?');
    if (!ok) return;

    try {
      await api.delete(`/team/${memberId}`, { headers: authHeaders() });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      const message = err?.response?.data?.detail || 'Failed to delete member.';
      setError(message);
    }
  }

  async function onAddMember(e) {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      // Backend expects TeamMemberCreate: { name, email, password, role }
      await api.post('/team/', form, { headers: authHeaders() });

      setIsModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'member' });
      await fetchMembers();
    } catch (err) {
      const data = err?.response?.data;
      const message =
        data?.detail ||
        (typeof data === 'string' ? data : '') ||
        (data ? JSON.stringify(data) : '') ||
        'Failed to add member.';
      setError(message);

      // Helpful for debugging when backend returns validation errors
      console.error('Add member failed:', err);
    } finally {
      setFormLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text">Team Management</h1>
          <p className="text-slate-300 mt-1">Manage team members for your CreatorIQ dashboard.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-700/50 bg-surface shadow-xl backdrop-blur-xl">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Role</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-400 text-center">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-400 text-center">
                  No team members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-slate-800/50 last:border-b-0">
                  <td className="px-4 py-3 text-sm text-slate-200">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{m.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{m.role}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(m.id)}
                      className="inline-flex items-center justify-center p-2 rounded-xl border border-red-500/40 text-red-200 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60"
                      aria-label={`Delete ${m.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/50 bg-surface shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div>
                <h2 className="text-lg font-bold text-text">Add Team Member</h2>
                <p className="text-sm text-slate-300">Create a new member and assign a role.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-slate-800/60 border border-slate-700/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="p-4 space-y-4" onSubmit={onAddMember}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/50 text-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/50 text-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/50 text-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/50 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="member">member</option>
                  <option value="creator">creator</option>
                  <option value="agency">agency</option>
                  <option value="marketing_team">marketing_team</option>
                  <option value="administrator">administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-200 hover:bg-slate-800/60"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm disabled:opacity-60"
                >
                  {formLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

