const user = JSON.parse(localStorage.getItem("creatorUser"));
import RevenueDashboard from "./revenue/RevenueDashboard";
import ReportDashboard from "./reports/ReportDashboard";
import AdminOverview from "./admin/AdminOverview";
import UserManagement from "./admin/UserManagement";
import SystemSettings from "./admin/SystemSettings";
import AgencyOverview from "./agency/AgencyOverview";
import CreatorsDashboard from "./agency/CreatorsDashboard";
import CampaignDashboard from "./agency/CampaignDashboard";
import MarketingOverview from "./Marketting/MarketingOverview";
import CampaignAnalytics from "./Marketting/CampaignAnalytics";
import AudienceInsights from "./Marketting/AudienceInsights";
import AudienceAnalytics from "./audience/AudienceAnalytics";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutGrid, BarChart3, Users, FileText, Search, Bell, ChevronDown,
  Menu, X, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Eye,
  Heart, MessageCircle, Share2, Clock, Download, Filter, Calendar,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Play, DollarSign,
  UserPlus, Globe, ChevronsUpDown, CheckCircle2, AlertCircle, Loader2,
  Settings, Sparkles,Video,Award,BadgeDollarSign,IndianRupee,
} from "lucide-react";
/* ============================================================
   DESIGN TOKENS — injected once as global CSS custom properties
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      /* =========================================================
   UNIQUE TERRACOTTA + COCOA DASHBOARD THEME
========================================================= */

--bg: #FFF8F4;
--surface: #FFFFFF;
--surface-alt: #FFF2EB;

--ink: #2D1B18;
--ink-soft: #654A44;
--muted: #9A7D75;

--border: #F0DCD3;

/* Main dashboard color */
--accent: #D95D47;
--accent-ink: #FFFFFF;

--accent-soft: #FDE8E1;
--accent-soft-ink: #A63F2D;

/* Success / growth */
--teal: #238B7E;
--teal-soft: #E2F4F0;

/* Negative / alert */
--rose: #C94F6D;
--rose-soft: #FBE7EC;

/* Revenue / warning */
--amber: #D9942E;
--amber-soft: #FFF1D9;

/* Sidebar */
--sidebar-bg: #2D1B18;
--sidebar-bg-hover: #472B26;

--sidebar-text: #C7AAA2;
--sidebar-text-active: #FFFFFF;
      --radius: 14px;
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
    }
    .ad-root .font-display { font-family: 'Sora', sans-serif; }
    .ad-root .font-mono { font-family: 'JetBrains Mono', monospace; }

    .ad-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .ad-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .ad-scrollbar::-webkit-scrollbar-thumb { background: #D6D9E6; border-radius: 8px; }
    .ad-root ::selection { background: var(--accent-soft); color: var(--accent); }

    @keyframes ad-fade-up { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
    .ad-animate-in { animation: ad-fade-up .45s cubic-bezier(.2,.8,.2,1) both; }

    @keyframes ad-pulse { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    .ad-pulse-dot { animation: ad-pulse 1.8s ease-in-out infinite; }

    @keyframes ad-shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
    .ad-skeleton {
      background: linear-gradient(90deg, #EEF0F6 25%, #F7F8FC 37%, #EEF0F6 63%);
      background-size: 400px 100%;
      animation: ad-shimmer 1.4s ease-in-out infinite;
    }

    .ad-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
    }
    .ad-card-hover:hover {
      box-shadow: 0 12px 28px -14px rgba(18,20,31,0.16);
      border-color: #DADDEB;
      transform: translateY(-2px);
    }

    .ad-nav-item {
      position: relative;
      transition: background .18s ease, color .18s ease;
    }
    .ad-nav-item::before {
      content: '';
      position: absolute; left: 0; top: 50%; transform: translateY(-50%);
      width: 3px; height: 0; background: var(--accent);
      border-radius: 0 4px 4px 0;
      transition: height .2s ease;
    }
    .ad-nav-item.active::before { height: 22px; }

    .ad-tab-underline {
      position: relative;
    }
    .ad-tab-underline::after {
      content: '';
      position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transition: transform .25s ease;
    }
    .ad-tab-underline.active::after { transform: scaleX(1); }

    .ad-row:hover { background: var(--surface-alt); }

    .ad-sidebar { transition: width .28s cubic-bezier(.2,.8,.2,1); }
    .ad-drawer { transition: transform .3s cubic-bezier(.2,.8,.2,1); }

    .ad-glow {
  background: radial-gradient(
    150px 100px at 85% 0%,
    rgba(217,93,71,0.16),
    transparent 72%
  );
}
.ad-live-badge {
  background: linear-gradient(
    90deg,
    #C94F6D,
    #E77A8F
  );
}
    @media (prefers-reduced-motion: reduce) {
      .ad-animate-in, .ad-pulse-dot, .ad-skeleton { animation: none !important; }
    }
  `}</style>
);

/* ============================================================
   DUMMY DATA
   ============================================================ */
const last14 = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date(2026, 6, i + 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

const viewsSeries = [4200, 4600, 4100, 5300, 6100, 5800, 6700, 7200, 6900, 7600, 8100, 7900, 8600, 9200]
  .map((v, i) => ({ date: last14[i], views: v, lastPeriod: Math.round(v * (0.72 + Math.random() * 0.1)) }));

const revenueSeries = [820, 910, 870, 1040, 1180, 1120, 1260, 1340, 1290, 1410, 1520, 1470, 1600, 1720]
  .map((v, i) => ({ date: last14[i], revenue: v }));

const engagementByType = [
  { type: "Reels", value: 18400 },
  { type: "Posts", value: 12100 },
  { type: "Stories", value: 9600 },
  { type: "Live", value: 5200 },
  { type: "Articles", value: 3100 },
];

const audienceGrowth = last14.map((date, i) => ({
  date,
  followers: 24500 + i * 310 + Math.round(Math.random() * 120),
  unfollows: 60 + Math.round(Math.random() * 40),
}));

const ageGroups = [
  { name: "18–24", value: 32, color: "#5B5FEF" },
  { name: "25–34", value: 38, color: "#12B5A6" },
  { name: "35–44", value: 18, color: "#F5A524" },
  { name: "45–54", value: 8, color: "#F0466E" },
  { name: "55+", value: 4, color: "#9CA3D4" },
];

const genderSplit = [
  { name: "Female", value: 54, color: "#5B5FEF" },
  { name: "Male", value: 43, color: "#12B5A6" },
  { name: "Other", value: 3, color: "#F5A524" },
];


const topLocations = [
  { country: "United States", pct: 34, users: 41200 },
  { country: "India", pct: 21, users: 25400 },
  { country: "United Kingdom", pct: 11, users: 13300 },
  { country: "Germany", pct: 8, users: 9700 },
  { country: "Brazil", pct: 6, users: 7100 },
  { country: "Canada", pct: 5, users: 6000 },
];

const topContent = [
  {
    id: 1,
    title: "5 Growth Hacks Every Creator Needs",
    type: "Reel",
    platform: "Instagram",
    published: "Jul 12, 2026",
    thumbnail: "🚀",
    views: 182400,
    likes: 14200,
    comments: 892,
    shares: 2310,
    saves: 1840,
    watchTime: 42800,
    reach: 156200,
    trend: 18.4,
  },
  {
    id: 2,
    title: "Behind the Scenes: Studio Rebuild",
    type: "Video",
    platform: "YouTube",
    published: "Jul 10, 2026",
    thumbnail: "🎥",
    views: 96700,
    likes: 7300,
    comments: 421,
    shares: 980,
    saves: 620,
    watchTime: 35600,
    reach: 82400,
    trend: 6.1,
  },
  {
    id: 3,
    title: "Ask Me Anything About Editing",
    type: "Live",
    platform: "YouTube",
    published: "Jul 9, 2026",
    thumbnail: "🎙️",
    views: 54200,
    likes: 3800,
    comments: 1204,
    shares: 340,
    saves: 410,
    watchTime: 29400,
    reach: 46200,
    trend: -3.2,
  },
  {
    id: 4,
    title: "How I Plan Content in One Day",
    type: "Article",
    platform: "LinkedIn",
    published: "Jul 7, 2026",
    thumbnail: "📝",
    views: 41300,
    likes: 2600,
    comments: 188,
    shares: 512,
    saves: 710,
    watchTime: 12800,
    reach: 35100,
    trend: 4.7,
  },
  {
    id: 5,
    title: "Unboxing the New Creator Kit",
    type: "Post",
    platform: "Facebook",
    published: "Jul 6, 2026",
    thumbnail: "📦",
    views: 38900,
    likes: 4100,
    comments: 260,
    shares: 601,
    saves: 520,
    watchTime: 9400,
    reach: 32700,
    trend: -1.5,
  },
  {
    id: 6,
    title: "3 Mistakes Killing Your Reach",
    type: "Reel",
    platform: "Instagram",
    published: "Jul 4, 2026",
    thumbnail: "⚡",
    views: 121500,
    likes: 9800,
    comments: 703,
    shares: 1890,
    saves: 1420,
    watchTime: 31400,
    reach: 104800,
    trend: 22.9,
  },
];
const contentTrendData = [
  {
    date: "Jul 1",
    views: 4200,
    likes: 340,
    comments: 42,
    shares: 35,
    watchTime: 1200,
    reach: 3500,
    engagementRate: 6.2,
  },
  {
    date: "Jul 3",
    views: 5100,
    likes: 420,
    comments: 58,
    shares: 48,
    watchTime: 1450,
    reach: 4200,
    engagementRate: 6.4,
  },
  {
    date: "Jul 5",
    views: 6200,
    likes: 510,
    comments: 71,
    shares: 62,
    watchTime: 1800,
    reach: 5100,
    engagementRate: 6.7,
  },
  {
    date: "Jul 7",
    views: 5800,
    likes: 470,
    comments: 65,
    shares: 55,
    watchTime: 1700,
    reach: 4900,
    engagementRate: 6.5,
  },
  {
    date: "Jul 9",
    views: 7200,
    likes: 620,
    comments: 88,
    shares: 81,
    watchTime: 2300,
    reach: 6100,
    engagementRate: 7.0,
  },
  {
    date: "Jul 11",
    views: 8600,
    likes: 760,
    comments: 105,
    shares: 102,
    watchTime: 2900,
    reach: 7300,
    engagementRate: 7.4,
  },
  {
    date: "Jul 13",
    views: 9800,
    likes: 910,
    comments: 132,
    shares: 128,
    watchTime: 3400,
    reach: 8400,
    engagementRate: 7.8,
  },
  {
    date: "Jul 15",
    views: 11200,
    likes: 1080,
    comments: 156,
    shares: 151,
    watchTime: 4100,
    reach: 9600,
    engagementRate: 8.1,
  },
];
const calculateEngagementRate = (content) => {
  const totalEngagement =
    content.likes +
    content.comments +
    content.shares +
    content.saves;

  return ((totalEngagement / content.reach) * 100).toFixed(2);
};
const reportsData = [
  { id: "RPT-2026-014", name: "Monthly Performance Summary", type: "Performance", range: "Jun 1 – Jun 30, 2026", status: "Ready", size: "1.2 MB", created: "Jul 1, 2026" },
  { id: "RPT-2026-013", name: "Audience Demographics Deep Dive", type: "Audience", range: "May 1 – May 31, 2026", status: "Ready", size: "860 KB", created: "Jun 2, 2026" },
  { id: "RPT-2026-012", name: "Content Engagement Breakdown", type: "Content", range: "Jun 8 – Jul 8, 2026", status: "Processing", size: "—", created: "Jul 14, 2026" },
  { id: "RPT-2026-011", name: "Revenue & Monetization Report", type: "Revenue", range: "Q2 2026", status: "Ready", size: "2.4 MB", created: "Jul 3, 2026" },
  { id: "RPT-2026-010", name: "Follower Growth Trend", type: "Audience", range: "Jan 1 – Jun 30, 2026", status: "Ready", size: "1.6 MB", created: "Jul 1, 2026" },
  { id: "RPT-2026-009", name: "Top Content — Last 90 Days", type: "Content", range: "Apr 15 – Jul 15, 2026", status: "Failed", size: "—", created: "Jul 14, 2026" },
  { id: "RPT-2026-008", name: "Regional Reach Comparison", type: "Audience", range: "Jun 2026", status: "Ready", size: "740 KB", created: "Jul 5, 2026" },
];

const kpiData = [
  { key: "views", label: "Total Views", value: 892400, delta: 12.4, positive: true, icon: Eye, spark: viewsSeries.map(d => ({ v: d.views })), accent: "accent" },
  { key: "followers", label: "New Followers", value: 24812, delta: 8.1, positive: true, icon: UserPlus, spark: audienceGrowth.map(d => ({ v: d.followers })), accent: "teal" },
  { key: "engagement", label: "Engagement Rate", value: 6.8, suffix: "%", delta: -1.3, positive: false, icon: Heart, spark: engagementByType.map(d => ({ v: d.value })), accent: "rose" },
  { key: "revenue", label: "Est. Revenue", value: 18420, prefix: "$", delta: 15.7, positive: true, icon: DollarSign, spark: revenueSeries.map(d => ({ v: d.revenue })), accent: "amber" },
];
const userRole = localStorage.getItem("userRole");
let NAV_ITEMS = [];

if (userRole === "Creator") {
  NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "content", label: "Content Analytics", icon: BarChart3 },
    { key: "audience", label: "Audience", icon: Users },
    { key: "growth", label: "Growth & Trends", icon: TrendingUp },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "reports", label: "Reports", icon: FileText },
  ];
}

else if (userRole === "Agency") {
  NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "creators", label: "Creators", icon: Users },
    { key: "campaigns", label: "Campaigns", icon: BarChart3 },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "reports", label: "Reports", icon: FileText },
  ];
}

else if (userRole === "Marketing Team") {
  NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "campaigns", label: "Campaign Analytics", icon: BarChart3 },
    { key: "audience", label: "Audience Insights", icon: Users },
    { key: "reports", label: "Reports", icon: FileText },
  ];
}

else if (userRole === "Administrator") {
  NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "users", label: "User Management", icon: Users },
    { key: "settings", label: "System Settings", icon: Settings },
    { key: "reports", label: "Reports", icon: FileText },
  ];
}
/* ============================================================
   HELPERS
   ============================================================ */
const fmtCompact = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
const fmtFull = (n) => new Intl.NumberFormat("en-US").format(n);

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return val;
}

const accentMap = {
  accent: { fg: "var(--accent)", soft: "var(--accent-soft)" },
  teal: { fg: "var(--teal)", soft: "var(--teal-soft)" },
  rose: { fg: "var(--rose)", soft: "var(--rose-soft)" },
  amber: { fg: "var(--amber)", soft: "var(--amber-soft)" },
};

/* ============================================================
   SHARED UI — Badge, StatCard, SectionHeader
   ============================================================ */
const Badge = ({ children, tone = "muted" }) => {
  const tones = {
    muted: { bg: "#EEF0F6", fg: "var(--ink-soft)" },
    success: { bg: "var(--teal-soft)", fg: "#0B8E82" },
    warning: { bg: "var(--amber-soft)", fg: "#9A6B0E" },
    danger: { bg: "var(--rose-soft)", fg: "#C22B4D" },
    accent: { bg: "var(--accent-soft)", fg: "var(--accent-soft-ink)" },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Ready: { tone: "success", icon: CheckCircle2 },
    Processing: { tone: "warning", icon: Loader2 },
    Failed: { tone: "danger", icon: AlertCircle },
  };
  const { tone, icon: Icon } = map[status] || map.Ready;
  return (
    <Badge tone={tone}>
      <Icon size={12} className={status === "Processing" ? "animate-spin" : ""} />
      {status}
    </Badge>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle, action }) => (
  <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
    <div>
      {eyebrow && (
        <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--accent)" }}>
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-xl md:text-2xl font-semibold" style={{ color: "var(--ink)" }}>{title}</h2>
      {subtitle && <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const StatCard = ({ item, delay = 0 }) => {
  const val = useCountUp(item.value);
  const colors = accentMap[item.accent];
  const displayVal = item.value % 1 !== 0 ? val.toFixed(1) : Math.round(val);
  return (
    <div
      className="ad-card ad-card-hover ad-animate-in p-5 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="ad-glow absolute inset-0 pointer-events-none" />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>{item.label}</div>
          <div className="font-display font-mono text-2xl md:text-[28px] font-bold" style={{ color: "var(--ink)" }}>
            {item.prefix || ""}{fmtFull(displayVal)}{item.suffix || ""}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: item.positive ? "#0B8E82" : "#C22B4D" }}>
            {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(item.delta)}%
            <span className="font-normal ml-1" style={{ color: "var(--muted)" }}>vs last period</span>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: colors.soft, color: colors.fg }}
        >
          <item.icon size={18} strokeWidth={2.25} />
        </div>
      </div>
      <div className="h-10 mt-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={item.spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.fg} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colors.fg} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={colors.fg} strokeWidth={2} fill={`url(#spark-${item.key})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ============================================================
   FILTERS
   ============================================================ */
const RANGE_OPTIONS = ["7D", "28D", "90D", "Custom"];

const Filters = ({ range, setRange, typeFilter, setTypeFilter, typeOptions, showType = true }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <div className="flex items-center rounded-full p-1 border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      {RANGE_OPTIONS.map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all"
          style={
            range === r
              ? { background: "var(--accent)", color: "#fff" }
              : { color: "var(--ink-soft)" }
          }
        >
          {r === "Custom" ? <span className="inline-flex items-center gap-1"><Calendar size={12} />{r}</span> : r}
        </button>
      ))}
    </div>
    {showType && (
      <div className="relative">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-full border cursor-pointer outline-none"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink-soft)" }}
        >
          {typeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
      </div>
    )}
    <button
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border"
      style={{ borderColor: "var(--border)", color: "var(--ink-soft)", background: "var(--surface)" }}
    >
      <Filter size={13} /> More filters
    </button>
  </div>
);

/* ============================================================
   TABLE — generic, sortable
   ============================================================ */
const useSortableData = (items, initialKey, initialDir = "desc") => {
  const [sortKey, setSortKey] = useState(initialKey);
  const [sortDir, setSortDir] = useState(initialDir);
  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [items, sortKey, sortDir]);
  const toggleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };
  return { sorted, sortKey, sortDir, toggleSort };
};

const Th = ({ label, sortKey: key, active, dir, onSort, align = "left" }) => (
  <th
    onClick={() => onSort(key)}
    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none whitespace-nowrap text-${align}`}
    style={{ color: active ? "var(--accent)" : "var(--muted)" }}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      <ChevronsUpDown size={12} style={{ opacity: active ? 1 : 0.4 }} />
    </span>
  </th>
);

const ContentTable = ({ data }) => {
  const { sorted, sortKey, sortDir, toggleSort } = useSortableData(data, "views");
  const typeTone = { Reel: "accent", Video: "success", Live: "danger", Article: "muted", Post: "warning" };
  return (
    <div className="ad-card overflow-hidden">
      <div className="overflow-x-auto ad-scrollbar">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <Th label="Title" sortKey="title" active={sortKey === "title"} dir={sortDir} onSort={toggleSort} />
              <Th label="Type" sortKey="type" active={sortKey === "type"} dir={sortDir} onSort={toggleSort} />
              <Th label="Views" sortKey="views" active={sortKey === "views"} dir={sortDir} onSort={toggleSort} align="right" />
              <Th label="Likes" sortKey="likes" active={sortKey === "likes"} dir={sortDir} onSort={toggleSort} align="right" />
              <Th label="Comments" sortKey="comments" active={sortKey === "comments"} dir={sortDir} onSort={toggleSort} align="right" />
              <Th label="Trend" sortKey="trend" active={sortKey === "trend"} dir={sortDir} onSort={toggleSort} align="right" />
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id} className="ad-row transition-colors" style={{ borderBottom: i === sorted.length - 1 ? "none" : "1px solid var(--border)" }}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium max-w-xs truncate" style={{ color: "var(--ink)" }}>{row.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{row.published}</div>
                </td>
                <td className="px-4 py-3"><Badge tone={typeTone[row.type]}>{row.type}</Badge></td>
                <td className="px-4 py-3 text-sm font-mono text-right" style={{ color: "var(--ink)" }}>{fmtCompact(row.views)}</td>
                <td className="px-4 py-3 text-sm font-mono text-right" style={{ color: "var(--ink-soft)" }}>{fmtCompact(row.likes)}</td>
                <td className="px-4 py-3 text-sm font-mono text-right" style={{ color: "var(--ink-soft)" }}>{fmtFull(row.comments)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold font-mono" style={{ color: row.trend >= 0 ? "#0B8E82" : "#C22B4D" }}>
                    {row.trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {Math.abs(row.trend)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button style={{ color: "var(--muted)" }}><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTable = ({ data }) => {
  const { sorted, sortKey, sortDir, toggleSort } = useSortableData(data, "created");
  return (
    <div className="ad-card overflow-hidden">
      <div className="overflow-x-auto ad-scrollbar">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <Th label="Report" sortKey="name" active={sortKey === "name"} dir={sortDir} onSort={toggleSort} />
              <Th label="Type" sortKey="type" active={sortKey === "type"} dir={sortDir} onSort={toggleSort} />
              <Th label="Date Range" sortKey="range" active={sortKey === "range"} dir={sortDir} onSort={toggleSort} />
              <Th label="Status" sortKey="status" active={sortKey === "status"} dir={sortDir} onSort={toggleSort} />
              <Th label="Size" sortKey="size" active={sortKey === "size"} dir={sortDir} onSort={toggleSort} align="right" />
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id} className="ad-row transition-colors" style={{ borderBottom: i === sorted.length - 1 ? "none" : "1px solid var(--border)" }}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>{row.name}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted)" }}>{row.id}</div>
                </td>
                <td className="px-4 py-3"><Badge tone="accent">{row.type}</Badge></td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--ink-soft)" }}>{row.range}</td>
                <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-3 text-sm font-mono text-right" style={{ color: "var(--ink-soft)" }}>{row.size}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={row.status !== "Ready"}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity"
                    style={{
                      background: row.status === "Ready" ? "var(--accent-soft)" : "#EEF0F6",
                      color: row.status === "Ready" ? "var(--accent-soft-ink)" : "var(--muted)",
                      opacity: row.status === "Ready" ? 1 : 0.6,
                      cursor: row.status === "Ready" ? "pointer" : "not-allowed",
                    }}
                  >
                    <Download size={12} /> Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================
   CHART BLOCKS
   ============================================================ */
const ChartCard = ({ title, subtitle, action, children, height = 280 }) => (
  <div className="ad-card p-5">
    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
      <div>
        <h3 className="font-display text-sm font-semibold" style={{ color: "var(--ink)" }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const tooltipStyle = {
  backgroundColor: "#12343B",
  border: "1px solid #2B5A62",
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "13px",
  fontFamily: "Inter, sans-serif",
  padding: "12px 14px",
  boxShadow: "0 12px 30px rgba(18, 52, 59, 0.30)",
};

const ViewsAreaChart = () => (
  <ChartCard
    title="Views Over Time"
    subtitle="Current period vs. previous period"
    action={<Legend2 items={[{ label: "This period", color: "var(--accent)" }, { label: "Last period", color: "#D6D9E6" }]} />}
  >
    <AreaChart data={viewsSeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D95D47" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#D95D47" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F6" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={40} />
  <Tooltip
  contentStyle={tooltipStyle}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 700,
    marginBottom: "6px"
  }}
  itemStyle={{
    color: "#DDF4F1",
    fontWeight: 600
  }}
  cursor={{ stroke: "#0F766E", strokeWidth: 1 }}
/>
      <Area type="monotone" dataKey="lastPeriod" stroke="#D6D9E6" strokeWidth={2} fill="none" strokeDasharray="4 4" />
      <Area type="monotone" dataKey="views" stroke="#D95D47" strokeWidth={2.5} fill="url(#viewsFill)" />
    </AreaChart>
  </ChartCard>
);

const Legend2 = ({ items }) => (
  <div className="flex items-center gap-3">
    {items.map((it) => (
      <span key={it.label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-soft)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
        {it.label}
      </span>
    ))}
  </div>
);

const EngagementBarChart = () => (
  <ChartCard title="Engagement by Content Type" subtitle="Total interactions, last 28 days">
    <BarChart data={engagementByType} margin={{ top: 4, right: 8, left: -18, bottom: 0 }} barSize={34}>
      <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F6" vertical={false} />
      <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={40} />
<Tooltip
  contentStyle={tooltipStyle}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 700,
    marginBottom: "6px"
  }}
  itemStyle={{
    color: "#DDF4F1",
    fontWeight: 600
  }}
  cursor={{ stroke: "#0F766E", strokeWidth: 1 }}
/>
      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
        {engagementByType.map((_, i) => (
          <Cell key={i} fill={["#D95D47", "#E57B64", "#EDA18E", "#F3C0B2", "#F8DCD3"][i % 5]} />
        ))}
      </Bar>
    </BarChart>
  </ChartCard>
);

const RevenueLineChart = () => (
  <ChartCard title="Estimated Revenue" subtitle="Daily earnings trend">
    <LineChart data={revenueSeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F6" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${fmtCompact(v)}`} width={46} />
     <Tooltip
  contentStyle={tooltipStyle}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 700,
    marginBottom: "6px"
  }}
  itemStyle={{
    color: "#DDF4F1",
    fontWeight: 600
  }}
  cursor={{ stroke: "#0F766E", strokeWidth: 1 }}
/>
      <Line type="monotone" dataKey="revenue" stroke="#F5A524" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
    </LineChart>
  </ChartCard>
);

const GrowthAreaChart = () => (
  <ChartCard
    title="Follower Growth"
    subtitle="New followers vs. unfollows"
    action={<Legend2 items={[{ label: "Followers", color: "var(--teal)" }, { label: "Unfollows", color: "var(--rose)" }]} />}
  >
    <AreaChart data={audienceGrowth} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="followFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12B5A6" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#12B5A6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F6" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#8A8FA3" }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={44} />
     <Tooltip
  contentStyle={tooltipStyle}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 700,
    marginBottom: "6px"
  }}
  itemStyle={{
    color: "#DDF4F1",
    fontWeight: 600
  }}
  cursor={{ stroke: "#0F766E", strokeWidth: 1 }}
/>
      <Area type="monotone" dataKey="followers" stroke="#12B5A6" strokeWidth={2.5} fill="url(#followFill)" />
      <Line type="monotone" dataKey="unfollows" stroke="#F0466E" strokeWidth={2} dot={false} />
    </AreaChart>
  </ChartCard>
);

const DemographicsPie = () => (
  <ChartCard title="Age Distribution" subtitle="Share of total audience" height={260}>
    <PieChart>
      <Pie data={ageGroups} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={4}>
        {ageGroups.map((g, i) => <Cell key={i} fill={g.color} stroke="none" />)}
      </Pie>
 <Tooltip
  contentStyle={{
    backgroundColor: "#1E293B",
    border: "1px solid #475569",
    borderRadius: "10px",
    color: "#FFFFFF",
    padding: "10px 14px",
  }}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 900,
    marginBottom: "6px",
  }}
  itemStyle={{
    color: "#FFFFFF",
    fontWeight:700,
  }}
  formatter={(value, name) => [
    <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
      {value}%
    </span>,
    <span style={{ color: "#FFFFFF" }}>
      {name}
    </span>,
  ]}
/>

      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(v) => <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{v}</span>}
        iconType="circle"
        iconSize={8}
      />
    </PieChart>
  </ChartCard>
);

const GenderDonut = () => (
  <ChartCard title="Gender Split" subtitle="Audience identity breakdown" height={260}>
    <PieChart>
      <Pie data={genderSplit} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={4}>
        {genderSplit.map((g, i) => <Cell key={i} fill={g.color} stroke="none" />)}
      </Pie>
     <Tooltip
  contentStyle={{
    backgroundColor: "#1E293B",
    border: "1px solid #475569",
    borderRadius: "10px",
    color: "#FFFFFF",
    padding: "10px 14px",
  }}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 900,
    marginBottom: "6px",
  }}
  itemStyle={{
    color: "#FFFFFF",
    fontWeight: 700,
  }}
  formatter={(value, name) => [
    <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
      {value}%
    </span>,
    <span style={{ color: "#FFFFFF" }}>
      {name}
    </span>,
  ]}
/>

      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(v) => <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{v}</span>}
        iconType="circle"
        iconSize={8}
      />
    </PieChart>
  </ChartCard>
);

const LocationsCard = () => (
  <div className="ad-card p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-sm font-semibold" style={{ color: "var(--ink)" }}>Top Locations</h3>
      <Globe size={16} style={{ color: "var(--muted)" }} />
    </div>
    <div className="space-y-3.5">
      {topLocations.map((loc) => (
        <div key={loc.country}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span style={{ color: "var(--ink-soft)" }}>{loc.country}</span>
            <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>{fmtCompact(loc.users)} · {loc.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full w-full" style={{ background: "#EEF0F6" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${loc.pct * 2.4}%`, background: "linear-gradient(90deg, #5B5FEF, #7A7DF2)" }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================
   SIDEBAR
   ============================================================ */
const Sidebar = ({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const widthClass = collapsed ? "w-[76px]" : "w-[248px]";
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`ad-sidebar ad-drawer ${widthClass} fixed md:sticky top-0 h-screen z-50 flex flex-col shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent)" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          {!collapsed && <span className="font-display text-white font-semibold text-[15px] whitespace-nowrap">Pulse Studio</span>}
          <button className="ml-auto md:hidden" onClick={() => setMobileOpen(false)}>
            <X size={18} color="#9498B0" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto ad-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActive(item.key); setMobileOpen(false); }}
                className={`ad-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "active" : ""}`}
                style={{
                  background: isActive ? "var(--sidebar-bg-hover)" : "transparent",
                  color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} strokeWidth={2} className="shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
            style={{ color: "var(--sidebar-text)", background: "transparent" }}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
          </button>
          {!collapsed && (
            <div className="mt-2 p-3 rounded-xl" style={{ background: "var(--sidebar-bg-hover)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full ad-pulse-dot" style={{ background: "var(--teal)" }} />
                <span className="text-xs font-semibold text-white">Live Analytics</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--sidebar-text)" }}>Data refreshes every 5 minutes across all modules.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

/* ============================================================
   NAVBAR
   ============================================================ */
const Navbar = ({ title, setMobileOpen }) => (
  <header
    className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-7 h-16 shrink-0 backdrop-blur"
    style={{ background: "rgba(245,246,250,0.85)", borderBottom: "1px solid var(--border)" }}
  >
    <button className="md:hidden" onClick={() => setMobileOpen(true)}>
      <Menu size={20} style={{ color: "var(--ink)" }} />
    </button>

    <div className="hidden md:block">
      <h1 className="font-display text-base font-semibold" style={{ color: "var(--ink)" }}>{title}</h1>
    </div>

    <div className="flex-1 flex justify-end md:justify-center">
      <div className="relative w-full max-w-sm hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          placeholder="Search analytics, reports, content…"
          className="w-full pl-9 pr-3 py-2 rounded-full text-sm outline-none border"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
        />
      </div>
    </div>

    <div className="flex items-center gap-1.5 md:gap-3">
      <span className="ad-live-badge hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-white ad-pulse-dot" /> LIVE
      </span>
      <button className="relative w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <Bell size={16} style={{ color: "var(--ink-soft)" }} />
        <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full" style={{ background: "var(--rose)" }} />
      </button>
      <button className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <Settings size={16} style={{ color: "var(--ink-soft)" }} />
      </button>
      <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: "var(--accent)" }}>SM</div>
        <span className="hidden lg:inline text-xs font-medium" style={{ color: "var(--ink)" }}>Sabarmathi</span>
        <ChevronDown size={13} className="hidden lg:inline" style={{ color: "var(--muted)" }} />
      </button>
    </div>
  </header>
);

/* ============================================================
   PAGES
   ============================================================ */
const DashboardHome = ({ user, userRole }) => (
  <div className="space-y-6">
    <SectionHeader
      eyebrow="Overview"
      title={`Welcome back, ${user?.fullName || "User"}`}
      subtitle={`${userRole} Dashboard • Here's how your account performed over the last 14 days.`}
      action={<Filters range="7D" setRange={() => {}} showType={false} />}
   />
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiData.map((item, i) => <StatCard key={item.key} item={item} delay={i * 80} />)}
    </div>
    {/* ================= ANALYSIS METRICS ================= */}

<div>
  <div className="flex items-center justify-between mb-4">
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--accent)" }}
      >
        Performance Insights
      </p>

      <h3
        className="font-display text-xl font-semibold mt-1"
        style={{ color: "var(--ink)" }}
      >
        Content Analysis Metrics
      </h3>

      <p
        className="text-sm mt-1"
        style={{ color: "var(--muted)" }}
      >
        Measure content reach, engagement, audience interaction, and viewing performance.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

    {/* Total Reach */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Total Reach
          </p>

          <h2
            className="font-display text-2xl font-bold mt-2"
            style={{ color: "var(--ink)" }}
          >
            621.8K
          </h2>

          <p
            className="text-xs font-semibold mt-2"
            style={{ color: "var(--teal)" }}
          >
            +15.7% from last period
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--teal-soft)",
            color: "var(--teal)",
          }}
        >
          <Users size={20} />
        </div>
      </div>
    </div>

    {/* Engagement Rate */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Engagement Rate
          </p>

          <h2
            className="font-display text-2xl font-bold mt-2"
            style={{ color: "var(--ink)" }}
          >
            6.8%
          </h2>

          <p
            className="text-xs font-semibold mt-2"
            style={{ color: "var(--teal)" }}
          >
            +8.1% from last period
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Heart size={20} />
        </div>

      </div>
    </div>

    {/* Average Watch Time */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Average Watch Time
          </p>

          <h2
            className="font-display text-2xl font-bold mt-2"
            style={{ color: "var(--ink)" }}
          >
            4m 28s
          </h2>

          <p
            className="text-xs font-semibold mt-2"
            style={{ color: "var(--teal)" }}
          >
            +6.2% improvement
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--amber-soft)",
            color: "var(--amber)",
          }}
        >
          <Clock size={20} />
        </div>

      </div>
    </div>

    {/* Total Interactions */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Total Interactions
          </p>

          <h2
            className="font-display text-2xl font-bold mt-2"
            style={{ color: "var(--ink)" }}
          >
            84.6K
          </h2>

          <p
            className="text-xs font-semibold mt-2"
            style={{ color: "var(--teal)" }}
          >
            +11.4% from last period
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--rose-soft)",
            color: "var(--rose)",
          }}
        >
          <MessageCircle size={20} />
        </div>

      </div>
    </div>

  </div>
</div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2"><ViewsAreaChart /></div>
      <EngagementBarChart />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 ad-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-semibold" style={{ color: "var(--ink)" }}>Recent Top Content</h3>
          <button className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>View all <ArrowUpRight size={13} /></button>
        </div>
        <div className="space-y-1">
          {topContent.slice(0, 4).map((row) => (
            <div key={row.id} className="ad-row flex items-center gap-3 p-2.5 rounded-xl transition-colors">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
                <Play size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{row.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{row.type} · {row.published}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-semibold" style={{ color: "var(--ink)" }}>{fmtCompact(row.views)}</div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>views</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LocationsCard />
    </div>
  </div>
);
const ContentTrendChart = ({
  title,
  dataKey,
  color,
  suffix = "",
}) => {
  return (
    <div
      className="ad-card p-5"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      <div className="mb-4">

        <h3
          className="font-display text-base font-bold"
          style={{
            color: "#5A2720",
          }}
        >
          {title}
        </h3>

        <p
          className="text-xs mt-1"
          style={{
            color: "#8B6B65",
          }}
        >
          Content performance trend over time
        </p>

      </div>

      <div className="h-[270px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={contentTrendData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F4E5E1"
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 11,
              }}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
              tickFormatter={
                dataKey === "engagementRate"
                  ? (value) =>
                      `${value}%`
                  : fmtCompact
              }
            />

            <Tooltip
  contentStyle={tooltipStyle}
  labelStyle={{
    color: "#FFFFFF",
    fontWeight: 600,
  }}
  itemStyle={{
    color: "#FFFFFF",
    fontWeight: 500,
  }}
  formatter={(value) => fmtFull(value)}
/>

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 7,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};
const ContentAnalytics = () => {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All Platforms");
  const [type, setType] = useState("All Types");
  const [selectedContent, setSelectedContent] = useState([]);

  const filteredContent = topContent.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPlatform =
      platform === "All Platforms" ||
      item.platform === platform;

    const matchesType =
      type === "All Types" ||
      item.type === type;

    return (
      matchesSearch &&
      matchesPlatform &&
      matchesType
    );
  });

  const toggleComparison = (id) => {
    setSelectedContent((previous) => {
      if (previous.includes(id)) {
        return previous.filter(
          (itemId) => itemId !== id
        );
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, id];
    });
  };

  const comparisonData = topContent.filter(
    (item) =>
      selectedContent.includes(item.id)
  );

  const highestViews = [...topContent].sort(
    (a, b) => b.views - a.views
  )[0];

  const highestLikes = [...topContent].sort(
    (a, b) => b.likes - a.likes
  )[0];

  const highestEngagement = [...topContent].sort(
    (a, b) =>
      calculateEngagementRate(b) -
      calculateEngagementRate(a)
  )[0];
const highestComments = [...topContent].sort(
  (a, b) => b.comments - a.comments
)[0];

const highestShares = [...topContent].sort(
  (a, b) => b.shares - a.shares
)[0];

const highestWatchTime = [...topContent].sort(
  (a, b) =>
    b.watchTime - a.watchTime
)[0];
  return (
    <div className="space-y-6">

      <SectionHeader
        eyebrow="Content Intelligence"
        title="Content Analytics"
        subtitle="Analyze content performance across all connected platforms."
      />

      {/* CONTENT SEARCH AND FILTER */}

      <div
        className="ad-card p-4"
        style={{
          borderTop:
            "4px solid #E85D4A"
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3"
              style={{
                color: "#E85D4A"
              }}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search content..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none"
            />
          </div>

          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value)
            }
            className="px-3 py-2.5 rounded-xl border"
          >
            <option>
              All Platforms
            </option>

            <option>
              Instagram
            </option>

            <option>
              YouTube
            </option>

            <option>
              Facebook
            </option>

            <option>
              LinkedIn
            </option>
          </select>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="px-3 py-2.5 rounded-xl border"
          >
            <option>
              All Types
            </option>

            <option>
              Reel
            </option>

            <option>
              Video
            </option>

            <option>
              Live
            </option>

            <option>
              Post
            </option>

            <option>
              Article
            </option>
          </select>

          <div
            className="flex items-center justify-center rounded-xl font-semibold"
            style={{
              background:
                "#FFF0EB",
              color:
                "#C94C38"
            }}
          >
            {filteredContent.length}
            {" "}
            Content Found
          </div>

        </div>
      </div>

      {/* TOP CONTENT */}

      <div>

        <h2
          className="font-display text-xl font-bold mb-4"
          style={{
            color:
              "#9E3E2D"
          }}
        >
          Top Performing Content
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          <div
            className="ad-card p-5"
            style={{
              borderTop:
                "4px solid #E85D4A"
            }}
          >
            <Eye
              size={25}
              color="#E85D4A"
            />

            <p className="mt-3 text-sm">
              Highest Views
            </p>

            <h3 className="font-bold text-lg">
              {highestViews.title}
            </h3>

            <p
              className="font-bold mt-2"
              style={{
                color:
                  "#E85D4A"
              }}
            >
              {fmtCompact(
                highestViews.views
              )} views
            </p>
          </div>

          <div
            className="ad-card p-5"
            style={{
              borderTop:
                "4px solid #FF8A5B"
            }}
          >
            <Heart
              size={25}
              color="#FF8A5B"
            />

            <p className="mt-3 text-sm">
              Highest Likes
            </p>

            <h3 className="font-bold text-lg">
              {highestLikes.title}
            </h3>

            <p
              className="font-bold mt-2"
              style={{
                color:
                  "#D8663D"
              }}
            >
              {fmtCompact(
                highestLikes.likes
              )} likes
            </p>
          </div>

          <div
            className="ad-card p-5"
            style={{
              borderTop:
                "4px solid #F4B942"
            }}
          >
            <Award
              size={25}
              color="#F4B942"
            />

            <p className="mt-3 text-sm">
              Best Engagement
            </p>

            <h3 className="font-bold text-lg">
              {
                highestEngagement.title
              }
            </h3>

            <p
              className="font-bold mt-2"
              style={{
                color:
                  "#A96F00"
              }}
            >
              {
                calculateEngagementRate(
                  highestEngagement
                )
              }%
            </p>
          </div>

        </div>
      </div>
{/* PERFORMANCE TREND ANALYSIS */}

<div>

  <div className="mb-4">

    <h2
      className="font-display text-xl font-bold"
      style={{
        color: "#9E3E2D",
      }}
    >
      Performance Trend Analysis
    </h2>

    <p
      className="text-sm mt-1"
      style={{
        color: "#8B6B65",
      }}
    >
      Monitor how content performance changes over time.
    </p>

  </div>

  <div
    className="grid grid-cols-1 xl:grid-cols-2 gap-5"
  >

    <ContentTrendChart
      title="Views Growth"
      dataKey="views"
      color="#E85D4A"
    />

    <ContentTrendChart
      title="Likes Growth"
      dataKey="likes"
      color="#FF7A59"
    />

    <ContentTrendChart
      title="Comments Growth"
      dataKey="comments"
      color="#C85C8E"
    />

    <ContentTrendChart
      title="Shares Growth"
      dataKey="shares"
      color="#8C5CC7"
    />

    <ContentTrendChart
      title="Watch Time Growth"
      dataKey="watchTime"
      color="#D98C22"
      suffix=" min"
    />

    <ContentTrendChart
      title="Reach Growth"
      dataKey="reach"
      color="#D95D39"
    />

    <ContentTrendChart
      title="Engagement Rate Growth"
      dataKey="engagementRate"
      color="#A94734"
      suffix="%"
    />

  </div>

</div>
      {/* CONTENT TABLE */}

      <div className="ad-card overflow-x-auto">

        <table className="w-full min-w-[1300px]">

          <thead>

            <tr
              style={{
                background:
                  "#FFF0EB"
              }}
            >

              <th className="p-3">
                Compare
              </th>

              <th className="p-3">
                Content
              </th>

              <th className="p-3">
                Platform
              </th>

              <th className="p-3">
                Views
              </th>

              <th className="p-3">
                Likes
              </th>

              <th className="p-3">
                Comments
              </th>

              <th className="p-3">
                Shares
              </th>

              <th className="p-3">
                Saves
              </th>

              <th className="p-3">
                Watch Time
              </th>

              <th className="p-3">
                Reach
              </th>

              <th className="p-3">
                Engagement
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredContent.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-3 text-center">

                      <input
                        type="checkbox"
                        checked={
                          selectedContent.includes(
                            item.id
                          )
                        }
                        onChange={() =>
                          toggleComparison(
                            item.id
                          )
                        }
                      />

                    </td>

                    <td className="p-3">

                      <div className="flex items-center gap-3">

                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{
                            background:
                              "#FFF0EB"
                          }}
                        >
                          {
                            item.thumbnail
                          }
                        </div>

                        <div>

                          <p className="font-semibold">
                            {
                              item.title
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            {
                              item.published
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="p-3">
                      {
                        item.platform
                      }
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.views
                        )
                      }
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.likes
                        )
                      }
                    </td>

                    <td className="p-3">
                      {
                        item.comments
                      }
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.shares
                        )
                      }
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.saves
                        )
                      }
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.watchTime
                        )
                      }
                      {" min"}
                    </td>

                    <td className="p-3">
                      {
                        fmtCompact(
                          item.reach
                        )
                      }
                    </td>

                    <td
                      className="p-3 font-bold"
                      style={{
                        color:
                          "#E85D4A"
                      }}
                    >
                      {
                        calculateEngagementRate(
                          item
                        )
                      }%
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

      {/* CONTENT COMPARISON */}

      {
        comparisonData.length >= 2 && (

          <div
            className="ad-card p-6"
            style={{
              borderTop:
                "4px solid #F4B942"
            }}
          >

            <h2 className="text-xl font-bold mb-5">

              Content Comparison

            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr>

                    <th>
                      Metric
                    </th>

                    {
                      comparisonData.map(
                        (item) => (

                          <th
                            key={item.id}
                          >
                            {
                              item.title
                            }
                          </th>

                        )
                      )
                    }

                  </tr>

                </thead>

                <tbody>
                  {[
  "views",
  "likes",
  "comments",
  "shares",
  "saves",
  "watchTime",
  "reach",
].map((metric) => (
  <tr
    key={metric}
    className="border-t"
  >
    <td className="p-3 font-semibold capitalize">
      {metric}
    </td>

    {comparisonData.map((item) => (
      <td
        key={item.id}
        className="p-3 text-center"
      >
        {fmtCompact(item[metric])}

        {metric === "watchTime"
          ? " min"
          : ""}
      </td>
    ))}
  </tr>
))}

                  
                  <tr className="border-t">

                    <td className="p-3 font-semibold">

                      Engagement Rate

                    </td>

                    {
                      comparisonData.map(
                        (item) => (

                          <td
                            key={item.id}
                            className="p-3 text-center"
                          >

                            {
                              calculateEngagementRate(
                                item
                              )
                            }%

                          </td>

                        )
                      )
                    }

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        )
      }

    </div>
  );
};
const growthData = [
  {
    period: "Jan",
    followers: 8200,
    subscribers: 6100,
    views: 42000,
    watchTime: 2800,
    revenue: 12500,
    engagement: 5.2,
  },
  {
    period: "Feb",
    followers: 8750,
    subscribers: 6450,
    views: 46500,
    watchTime: 3100,
    revenue: 14200,
    engagement: 5.6,
  },
  {
    period: "Mar",
    followers: 9400,
    subscribers: 6900,
    views: 52000,
    watchTime: 3450,
    revenue: 16100,
    engagement: 6.1,
  },
  {
    period: "Apr",
    followers: 10100,
    subscribers: 7350,
    views: 59000,
    watchTime: 3900,
    revenue: 18400,
    engagement: 6.5,
  },
  {
    period: "May",
    followers: 10900,
    subscribers: 7900,
    views: 68000,
    watchTime: 4400,
    revenue: 21500,
    engagement: 7.0,
  },
  {
    period: "Jun",
    followers: 11800,
    subscribers: 8500,
    views: 76000,
    watchTime: 5000,
    revenue: 24800,
    engagement: 7.4,
  },
];

const growthMetrics = [
  {
    title: "Subscriber Growth",
    value: "+8.2%",
    subtitle: "Compared with last month",
    icon: Users,
  },
  {
    title: "Follower Growth",
    value: "+9.5%",
    subtitle: "1,020 new followers",
    icon: UserPlus,
  },
  {
    title: "Views Growth",
    value: "+11.8%",
    subtitle: "76K total views",
    icon: Eye,
  },
  {
    title: "Watch Time Growth",
    value: "+13.6%",
    subtitle: "5,000 hours watched",
    icon: Clock,
  },
  {
    title: "Revenue Growth",
    value: "+15.3%",
    subtitle: "₹24,800 this month",
    icon: IndianRupee,
  },
  {
    title: "Engagement Growth",
    value: "+7.4%",
    subtitle: "Higher audience interaction",
    icon: Heart,
  },
];
const GrowthTrendDashboard = () => {
  const [period, setPeriod] = useState("28D");
  const periodData = {
  "7D": [
    { period: "Mon", followers: 22000, views: 185000 },
    { period: "Tue", followers: 22450, views: 192000 },
    { period: "Wed", followers: 22900, views: 205000 },
    { period: "Thu", followers: 23400, views: 218000 },
    { period: "Fri", followers: 23900, views: 235000 },
    { period: "Sat", followers: 24400, views: 252000 },
    { period: "Sun", followers: 24812, views: 286000 },
  ],

  "28D": [
    { period: "Week 1", followers: 19000, views: 175000 },
    { period: "Week 2", followers: 21000, views: 205000 },
    { period: "Week 3", followers: 23000, views: 245000 },
    { period: "Week 4", followers: 24812, views: 286000 },
  ],

  "90D": [
  { period: "May 5", followers: 16400, views: 186000 },
  { period: "May 15", followers: 17200, views: 194000 },
  { period: "May 25", followers: 18100, views: 205000 },

  { period: "Jun 5", followers: 19000, views: 218000 },
  { period: "Jun 15", followers: 19800, views: 225000 },
  { period: "Jun 25", followers: 20700, views: 238000 },

  { period: "Jul 5", followers: 21600, views: 249000 },
  { period: "Jul 15", followers: 22500, views: 260000 },
  { period: "Jul 25", followers: 23600, views: 274000 },

  { period: "Aug 2", followers: 24812, views: 286000 },
],
};
  const categoryData = [
    {
      category: "Technology",
      views: 245000,
      likes: 28500,
      comments: 4200,
      engagement: 8.4,
    },
    {
      category: "Education",
      views: 218000,
      likes: 24200,
      comments: 3900,
      engagement: 7.8,
    },
    {
      category: "Entertainment",
      views: 196000,
      likes: 19800,
      comments: 2800,
      engagement: 6.9,
    },
    {
      category: "Lifestyle",
      views: 168000,
      likes: 15400,
      comments: 2100,
      engagement: 5.8,
    },
  ];

  const hashtagData = [
    {
      hashtag: "#AI",
      reach: 185000,
      impressions: 245000,
      engagement: 9.2,
    },
    {
      hashtag: "#MachineLearning",
      reach: 162000,
      impressions: 218000,
      engagement: 8.6,
    },
    {
      hashtag: "#Technology",
      reach: 148000,
      impressions: 196000,
      engagement: 7.9,
    },
    {
      hashtag: "#DataScience",
      reach: 132000,
      impressions: 175000,
      engagement: 7.3,
    },
    {
      hashtag: "#Creator",
      reach: 118000,
      impressions: 154000,
      engagement: 6.8,
    },
  ];

  const contentGrowthData = [
    {
      content: "AI Tools Explained",
      views7: "82K",
      likes30: "12.4K",
      watch60: "4.8K hrs",
      growth: "+42%",
    },
    {
      content: "Python Tutorial",
      views7: "71K",
      likes30: "10.8K",
      watch60: "4.2K hrs",
      growth: "+35%",
    },
    {
      content: "Machine Learning Basics",
      views7: "64K",
      likes30: "9.6K",
      watch60: "3.9K hrs",
      growth: "+28%",
    },
    {
      content: "Data Science Roadmap",
      views7: "58K",
      likes30: "8.2K",
      watch60: "3.4K hrs",
      growth: "+21%",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeader
          eyebrow="Growth Intelligence"
          title="Growth & Trend Analysis"
          subtitle="Analyze historical growth, detect trends and predict future performance."
        />

        <div className="flex gap-2">
          {["7D", "28D", "90D"].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                period === item
                  ? "bg-teal-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 1. GROWTH MONITORING */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Subscriber Growth
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            +24,812
          </h2>
          <p className="mt-2 text-sm text-emerald-600">
            ↑ 18.4% this month
          </p>
        </div>

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Views Growth
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            286K
          </h2>
          <p className="mt-2 text-sm text-emerald-600">
            ↑ 16.2% from last month
          </p>
        </div>

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Watch Time Growth
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            8.2K hrs
          </h2>
          <p className="mt-2 text-sm text-emerald-600">
            ↑ 14.8% improvement
          </p>
        </div>

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Revenue Growth
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹40.1K
          </h2>
          <p className="mt-2 text-sm text-emerald-600">
            ↑ 15.2% this month
          </p>
        </div>

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Engagement Growth
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            7.2%
          </h2>
          <p className="mt-2 text-sm text-emerald-600">
            ↑ 0.8% improvement
          </p>
        </div>

        <div className="ad-card p-5">
          <p className="text-sm text-slate-500">
            Overall Growth Score
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            92/100
          </h2>
          <p className="mt-2 text-sm text-teal-600">
            Strong growth trend
          </p>
        </div>

      </div>

      {/* GROWTH TREND CHART */}
      <div className="ad-card p-6">
        <h2 className="text-xl font-bold">
          Historical Growth Trend
        </h2>

        <p className="mb-5 text-sm text-slate-500">
          Monthly follower and views growth
        </p>

        <ResponsiveContainer width="100%" height={330}>
          <LineChart data={periodData[period]}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="period" />

            <YAxis />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="followers"
              name="Followers"
              stroke="#0f766e"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. TREND DETECTION */}
      <div className="ad-card overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold">
            Content Category Trends
          </h2>

          <p className="text-sm text-slate-500">
            Compare average performance by content category
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Average Views</th>
                <th className="p-4">Average Likes</th>
                <th className="p-4">Comments</th>
                <th className="p-4">Engagement</th>
              </tr>
            </thead>

            <tbody>
              {categoryData.map((item) => (
                <tr
                  key={item.category}
                  className="border-t"
                >
                  <td className="p-4 font-semibold">
                    {item.category}
                  </td>

                  <td className="p-4">
                    {item.views.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.likes.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.comments.toLocaleString()}
                  </td>

                  <td className="p-4 font-semibold text-teal-600">
                    {item.engagement}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. HASHTAG ANALYSIS */}
      <div className="ad-card overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold">
            Hashtag Performance Analysis
          </h2>

          <p className="text-sm text-slate-500">
            Identify hashtags with the highest reach and engagement
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Hashtag</th>
                <th className="p-4">Average Reach</th>
                <th className="p-4">Impressions</th>
                <th className="p-4">Engagement</th>
              </tr>
            </thead>

            <tbody>
              {hashtagData.map((item) => (
                <tr
                  key={item.hashtag}
                  className="border-t"
                >
                  <td className="p-4 font-semibold text-blue-600">
                    {item.hashtag}
                  </td>

                  <td className="p-4">
                    {item.reach.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.impressions.toLocaleString()}
                  </td>

                  <td className="p-4 font-semibold text-emerald-600">
                    {item.engagement}%
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* 4 + 6. PREDICTIONS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <div className="ad-card p-6">

          <h2 className="text-xl font-bold">
            Reach Prediction
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Estimated performance for the next 30 days
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">
              <span>Previous Reach</span>
              <b>286K</b>
            </div>

            <div className="flex justify-between">
              <span>Average Reach</span>
              <b>252K</b>
            </div>

            <div className="flex justify-between">
              <span>Predicted Reach</span>
              <b className="text-teal-600">
                328K
              </b>
            </div>

            <div className="flex justify-between">
              <span>Estimated Views</span>
              <b>365K</b>
            </div>

            <div className="flex justify-between">
              <span>Estimated Engagement</span>
              <b>8.1%</b>
            </div>

          </div>
        </div>

        <div className="ad-card p-6">

          <h2 className="text-xl font-bold">
            Audience Growth Forecast
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Expected follower growth based on historical trends
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">
              <span>Current Followers</span>
              <b>24,812</b>
            </div>

            <div className="flex justify-between">
              <span>Average Monthly Growth</span>
              <b>18.4%</b>
            </div>

            <div className="flex justify-between">
              <span>Expected Followers</span>
              <b className="text-teal-600">
                29,378
              </b>
            </div>

            <div className="flex justify-between">
              <span>Forecast Period</span>
              <b>Next 30 Days</b>
            </div>

          </div>
        </div>

      </div>

      {/* 5. CONTENT GROWTH TRACKING */}
      <div className="ad-card overflow-hidden">

        <div className="p-6">

          <h2 className="text-xl font-bold">
            Content Growth Tracking
          </h2>

          <p className="text-sm text-slate-500">
            Compare how quickly new and older content gain engagement
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4">Content</th>
                <th className="p-4">Views After 7 Days</th>
                <th className="p-4">Likes After 30 Days</th>
                <th className="p-4">Watch Time After 60 Days</th>
                <th className="p-4">Growth</th>
              </tr>

            </thead>

            <tbody>

              {contentGrowthData.map((item) => (

                <tr
                  key={item.content}
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {item.content}
                  </td>

                  <td className="p-4">
                    {item.views7}
                  </td>

                  <td className="p-4">
                    {item.likes30}
                  </td>

                  <td className="p-4">
                    {item.watch60}
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    {item.growth}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* 7. HISTORICAL PERFORMANCE */}
      <div className="ad-card p-6">

        <h2 className="text-xl font-bold">
          Historical Performance Comparison
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Daily Performance
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              +4.8%
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Weekly Performance
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              +12.6%
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Monthly Performance
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              +18.4%
            </h3>
          </div>

        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-emerald-200 p-5">

            <p className="text-sm text-slate-500">
              Highest Growth Period
            </p>

            <h3 className="mt-2 text-xl font-bold">
              June – +22.8%
            </h3>

          </div>

          <div className="rounded-xl border border-rose-200 p-5">

            <p className="text-sm text-slate-500">
              Lowest Growth Period
            </p>

            <h3 className="mt-2 text-xl font-bold">
              February – +4.2%
            </h3>

          </div>

        </div>

      </div>

      {/* 8. INSIGHTS */}
      <div className="ad-card p-6">

        <h2 className="text-xl font-bold">
          Growth Insights & Recommendations
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              🏆 Best Content Category
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Technology content generates the highest average views and engagement.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              🚀 Fastest Growing Content
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              AI Tools Explained achieved 42% growth within the first 60 days.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              #️⃣ Most Effective Hashtag
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              #AI has the highest reach and a 9.2% engagement rate.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              📈 Overall Growth Trend
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Your account shows consistent positive growth. Continue focusing on short-form technology content.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};
/* ============================================================
   APP ROOT
   ============================================================ */
export default function AnalyticsDashboard() {
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = NAV_ITEMS.find((n) => n.key === active)?.label || "Dashboard";

const renderPage = () => {
  // MARKETING TEAM
  if (userRole === "Marketing Team") {
    switch (active) {
      case "overview":
        return <MarketingOverview />;

      case "campaigns":
        return <CampaignAnalytics />;

      case "audience":
        return <AudienceDashboard />;

      case "growth":
        return <GrowthTrendDashboard />;

      case "reports":
        return <ReportDashboard />;

      default:
        return <MarketingOverview />;
    }
  }

  // AGENCY
  if (userRole === "Agency") {
    switch (active) {
      case "overview":
        return <AgencyOverview />;

      case "creators":
        return <CreatorsDashboard />;

      case "campaigns":
        return <CampaignDashboard />;

      case "revenue":
        return <RevenueDashboard />;

      case "reports":
        return <ReportDashboard />;

      default:
        return <AgencyOverview />;
    }
  }

  // ADMINISTRATOR
  if (userRole === "Administrator") {
    switch (active) {
      case "overview":
        return <AdminOverview />;

      case "users":
        return <UserManagement />;

      case "settings":
        return <SystemSettings />;

      case "reports":
        return <ReportDashboard />;

      default:
        return <AdminOverview />;
    }
  }

  // CREATOR
  switch (active) {
    case "overview":
      return (
        <DashboardHome
          user={user}
          userRole={userRole}
        />
      );

    case "content":
      return <ContentAnalytics />;

    case "audience":
      return <AudienceAnalytics />;

    case "growth":
      return <GrowthTrendDashboard />;

    case "revenue":
      return <RevenueDashboard />;

    case "reports":
      return <ReportDashboard />;

    default:
      return (
        <DashboardHome
          user={user}
          userRole={userRole}
        />
      );
  }
};
  return (
    <div className="ad-root flex min-h-screen w-full">
      <GlobalStyle />
      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={pageTitle} setMobileOpen={setMobileOpen} />
        <main
  className="flex-1 p-4 md:p-6 lg:p-8 ad-animate-in"
  key={active}
  style={{
    background: "#F3F6FF",
  }}
>

  <div
    className="w-full max-w-[1600px] mx-auto"
  >

    <div
      className="
      bg-white
      border
      border-[#DDE3F0]
      rounded-2xl
      p-4
      md:p-6
      lg:p-7
      shadow-sm
      "
    >

      {renderPage()}

    </div>

  </div>

</main>
      </div>
    </div>
  );
}
