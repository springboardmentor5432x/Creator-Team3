export default function MemberDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Member Dashboard</h1>
        <p className="text-muted mt-1">
          This view is reserved for member users. Use this page for restricted member features.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-700/50 bg-surface p-6">
        <p className="text-text">
          Your account is active and your role is <strong>member</strong>. You are redirected here after login.
        </p>
      </div>
    </div>
  );
}
