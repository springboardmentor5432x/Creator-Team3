import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-3xl border border-red-500/20 bg-surface p-10 text-center shadow-xl">
        <h1 className="text-5xl font-extrabold text-red-400">403</h1>
        <p className="mt-4 text-xl font-semibold text-text">Forbidden</p>
        <p className="mt-2 text-sm text-muted">
          You do not have permission to view this page.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
