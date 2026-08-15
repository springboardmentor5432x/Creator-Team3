
import RevenueDashboard from "./revenue/RevenueDashboard";
import ReportDashboard from "./reports/ReportDashboard";
import AdminOverview from "./admin/AdminOverview";
import UserManagement from "./admin/UserManagement";
import SystemSettings from "./admin/SystemSettings";
import AgencyDashboard from "./agency/AgencyDashboard";
import CreatorsDashboard from "./agency/CreatorsDashboard";
import CampaignDashboard from "./agency/CampaignDashboard";
import MarketingOverview from "./Marketting/MarketingOverview";
import CampaignAnalytics from "./Marketting/CampaignAnalytics";
import AudienceInsights from "./Marketting/AudienceInsights";
import MarkettingPerformance from "./Marketting/MarkettingPerformance";
import MarketingReports from "./Marketting/MarketingReports";
import AudienceAnalytics from "./audience/AudienceAnalytics";
import SecurityAudit from "./admin/SecurityAudit";
import AdminReports from "./admin/AdminReports";
import AdminNotifications from "./admin/AdminNotifications";
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
  Settings, Sparkles,Video,Award,BadgeDollarSign,IndianRupee,ShieldCheck,
} from "lucide-react";
const user = JSON.parse(localStorage.getItem("creatorUser"));
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #CBD5E1",
        borderRadius: "10px",
        padding: "12px 14px",
        minWidth: "180px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          color: "#111827",
          fontWeight: 700,
          marginBottom: "8px",
          fontSize: "13px",
        }}
      >
        {label}
      </div>

      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <span
            style={{
              color: "#111827",
              fontWeight: 600,
            }}
          >
            {entry.name}
          </span>

          <span
            style={{
              color: "#111827",
              fontWeight: 700,
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};
/* ============================================================
   DESIGN TOKENS — injected once as global CSS custom properties
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    /* =====================================================
       PULSE STUDIO - DARK PROFESSIONAL DASHBOARD THEME
    ===================================================== */

    :root {
      /* Main Background */
      --bg: #0F172A;

      /* Cards and Sections */
      --surface: #182235;
      --surface-alt: #202D40;

      /* Text Colors */
      --ink: #F8FAFC;
      --ink-soft: #D7E0EC;
      --muted: #AAB7CC;

      /* Borders */
      --border: #34435A;

      /* Main Accent */
      --accent: #FF765C;
      --accent-ink: #FFFFFF;

      /* Accent Background */
      --accent-soft: #3A2930;
      --accent-soft-ink: #FFB4A5;

      /* Success */
      --teal: #2DD4BF;
      --teal-soft: #173B3B;

      /* Alert */
      --rose: #FB7185;
      --rose-soft: #40232D;

      /* Warning */
      --amber: #FBBF24;
      --amber-soft: #40351D;

      /* Sidebar */
      --sidebar-bg: #0B1220;
      --sidebar-bg-hover: #1E2A3D;

      --sidebar-text: #AAB7CC;
      --sidebar-text-active: #FFFFFF;

      --radius: 14px;
    }


    /* =====================================================
       GLOBAL SETTINGS
    ===================================================== */

    * {
      box-sizing: border-box;
    }

    html {
      background: var(--bg);
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }


    /* =====================================================
       MAIN DASHBOARD
    ===================================================== */

    main,
    .dashboard,
    .dashboard-container,
    .dashboard-content {
      background-color: var(--bg) !important;
      color: var(--ink);
    }


    /* =====================================================
       ALL HEADINGS - ALWAYS VISIBLE
    ===================================================== */

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #ffffff4e !important;
    }


    /* =====================================================
       NORMAL TEXT
    ===================================================== */

    p,
    span,
    label,
    li,
    td,
    div {
      color: var(--ink-soft);
    }


    /* =====================================================
       IMPORTANT TEXT
    ===================================================== */

    .font-bold,
    .font-semibold {
      color: #FFFFFF !important;
    }


    /* =====================================================
       MUTED TEXT
    ===================================================== */

    .text-slate-400,
    .text-slate-500,
    .text-slate-600,
    .text-gray-400,
    .text-gray-500,
    .text-gray-600 {
      color: #AAB7CC !important;
    }


    

    /* =====================================================
       CARDS
    ===================================================== */

    .card,
    .dashboard-card,
    .analytics-card,
    .stat-card,
    .chart-card,
    .widget-card {
      background-color: var(--surface) !important;
      border: 1px solid var(--border) !important;
      color: var(--ink) !important;
      border-radius: var(--radius);
    }


    /* =====================================================
       TAILWIND WHITE / LIGHT BACKGROUND FIX
    ===================================================== */

    .bg-white {
      background-color: var(--surface) !important;
    }

    .bg-slate-50,
    .bg-slate-100,
    .bg-gray-50,
    .bg-gray-100 {
      background-color: var(--surface-alt) !important;
    }


    /* =====================================================
       BORDERS
    ===================================================== */

    .border,
    .border-slate-100,
    .border-slate-200,
    .border-slate-300,
    .border-gray-100,
    .border-gray-200,
    .border-gray-300 {
      border-color: var(--border) !important;
    }


    /* =====================================================
       TABLES
    ===================================================== */

    table {
      width: 100%;
      color: var(--ink-soft) !important;
    }

    thead,
    thead tr {
      background-color: #26344A !important;
    }

    th {
      background-color: #26344A !important;
      color: #FFFFFF !important;
      font-weight: 700;
    }

    td {
      color: #D7E0EC !important;
      border-color: var(--border) !important;
    }

    tbody tr {
      background-color: transparent !important;
      border-color: var(--border) !important;
    }

    tbody tr:hover {
      background-color: #243249 !important;
    }


    /* =====================================================
       INPUTS
    ===================================================== */

    input,
    select,
    textarea {
      background-color: #202D40 !important;
      color: #F8FAFC !important;
      border-color: #3B4B63 !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: #8492A6 !important;
    }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--accent) !important;
      outline: none;
    }


    /* =====================================================
       SELECT OPTIONS
    ===================================================== */

    option {
      background-color: #202D40;
      color: #FFFFFF;
    }


    /* =====================================================
       RECOMMENDATION / INSIGHT CARDS
    ===================================================== */

    .recommendation-card,
    .recommendation,
    .insight-card,
    .tip-card,
    .suggestion-card {
      background-color: #243249 !important;
      color: #FFFFFF !important;
      border: 1px solid #3B4B63 !important;
    }

    .recommendation-card *,
    .recommendation *,
    .insight-card *,
    .tip-card *,
    .suggestion-card * {
      color: #E2E8F0 !important;
    }


    /* =====================================================
       BUTTONS
    ===================================================== */

    button {
      color: inherit;
    }

    button.bg-white {
      background-color: #E2E8F0 !important;
      color: #172033 !important;
    }
/* =====================================================
   RECHARTS CHART TEXT
===================================================== */

.recharts-text,
.recharts-cartesian-axis-tick-value,
.recharts-cartesian-axis text,
.recharts-cartesian-axis-ticks text,
.recharts-label,
.recharts-xAxis text,
.recharts-yAxis text {
    fill: #FFFFFF !important;
    color: #FFFFFF !important;
    font-size: 12px !important;
    font-weight: 600 !important;
}
.recharts-wrapper text {
    fill: #F8FAFC !important;
}
.recharts-legend-item-text {
    fill: #FFFFFF !important;
    color: #FFFFFF !important;
}

/* =====================================================
   RECHARTS TOOLTIP
===================================================== */

.recharts-default-tooltip {
    background: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 10px !important;
    padding: 10px !important;
}

.recharts-tooltip-label {
    color: #111827 !important;
    font-weight: 700 !important;
}

.recharts-tooltip-item,
.recharts-tooltip-item-name,
.recharts-tooltip-item-value {
    color: #111827 !important;
    fill: #111827 !important;
}
/* =====================================================
   SVG ICON VISIBILITY FIX
===================================================== */

svg {
  stroke: currentColor;
}

/* KPI icon containers */
.w-10.h-10 svg,
.w-11.h-11 svg,
.w-12.h-12 svg,
.w-14.h-14 svg {
    color: currentColor !important;
    stroke: currentColor !important;
}

/* Recent Top Content icons */
.recent-content svg,
.content-card svg,
.top-content svg {
  color: #FFFFFF !important;
  stroke: #FFFFFF !important;
}

    /* =====================================================
       SIDEBAR
    ===================================================== */

    aside {
      background-color: var(--sidebar-bg) !important;
    }

    aside a,
    aside button {
      color: var(--sidebar-text) !important;
    }

    aside a:hover,
    aside button:hover {
      background-color: var(--sidebar-bg-hover) !important;
      color: #FFFFFF !important;
    }


    /* =====================================================
       SCROLLBAR
    ===================================================== */

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #0B1220;
    }

    ::-webkit-scrollbar-thumb {
      background: #3B4B63;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #53647D;
    }
/* =====================================================
   REVENUE CHART TEXT VISIBILITY FIX
===================================================== */


/* X-axis and Y-axis labels */
.recharts-cartesian-axis-tick text,
.recharts-cartesian-axis-tick-value {
  fill: #B8C5D8 !important;
}

/* Chart legend */
.recharts-legend-item-text {
  color: #F1F5F9 !important;
}

/* Chart tooltip */
.recharts-tooltip-wrapper,
.recharts-default-tooltip {
  background-color: #1E2B3E !important;
  color: #FFFFFF !important;
  border: 1px solid #465873 !important;
}

.recharts-tooltip-label,
.recharts-tooltip-item {
  color: #FFFFFF !important;
}


/* =====================================================
   CHART BELOW INFORMATION / SUMMARY BOX
===================================================== */

/* Chart keela irukkura box */
.chart-summary,
.chart-info,
.chart-description,
.chart-insight,
.chart-footer,
.chart-note,
.chart-caption {
  background-color: #26364D !important;
  border: 1px solid #435570 !important;
  color: #FFFFFF !important;
}

/* Box ulla ellaa text */
.chart-summary *,
.chart-info *,
.chart-description *,
.chart-insight *,
.chart-footer *,
.chart-note *,
.chart-caption * {
  color: #E8EEF7 !important;
}


/* =====================================================
   REVENUE COMPONENT CARDS
===================================================== */

.revenue-card,
.revenue-summary,
.revenue-insight,
.revenue-stat,
.revenue-analysis {
  background-color: #223047 !important;
  border: 1px solid #40516B !important;
  color: #FFFFFF !important;
}

.revenue-card h1,
.revenue-card h2,
.revenue-card h3,
.revenue-card h4,
.revenue-summary h1,
.revenue-summary h2,
.revenue-summary h3,
.revenue-summary h4,
.revenue-insight h1,
.revenue-insight h2,
.revenue-insight h3,
.revenue-insight h4 {
  color: #FFFFFF !important;
}

.revenue-card p,
.revenue-summary p,
.revenue-insight p,
.revenue-analysis p {
  color: #CBD5E1 !important;
}


/* =====================================================
   RECOMMENDATION TEXT FIX
===================================================== */

.recommendation,
.recommendations,
.recommendation-card,
.ai-recommendation,
.ai-suggestion,
.suggestion,
.suggestion-card,
.insight,
.insight-card {
  background-color: #26364D !important;
  border: 1px solid #435570 !important;
  color: #FFFFFF !important;
}

/* Recommendation ulla heading */
.recommendation h1,
.recommendation h2,
.recommendation h3,
.recommendation h4,
.recommendations h1,
.recommendations h2,
.recommendations h3,
.recommendations h4,
.ai-recommendation h1,
.ai-recommendation h2,
.ai-recommendation h3,
.ai-recommendation h4,
.suggestion-card h1,
.suggestion-card h2,
.suggestion-card h3,
.suggestion-card h4 {
  color: #FFFFFF !important;
}

/* Recommendation ulla normal letters */
.recommendation p,
.recommendation span,
.recommendation li,
.recommendations p,
.recommendations span,
.recommendations li,
.ai-recommendation p,
.ai-recommendation span,
.ai-recommendation li,
.ai-suggestion p,
.ai-suggestion span,
.suggestion p,
.suggestion span,
.suggestion-card p,
.suggestion-card span,
.insight-card p,
.insight-card span {
  color: #DCE5F0 !important;
}


/* =====================================================
   LIGHT COLORED INSIGHT BOX TEXT FIX
===================================================== */

/* Green, pink, yellow, blue insight boxes */
.bg-emerald-50,
.bg-green-50,
.bg-teal-50,
.bg-blue-50,
.bg-indigo-50,
.bg-purple-50,
.bg-pink-50,
.bg-rose-50,
.bg-orange-50,
.bg-amber-50,
.bg-yellow-50 {
  color: #172033 !important;
}

/* Above boxes ulla text */
.bg-emerald-50 *,
.bg-green-50 *,
.bg-teal-50 *,
.bg-blue-50 *,
.bg-indigo-50 *,
.bg-purple-50 *,
.bg-pink-50 *,
.bg-rose-50 *,
.bg-orange-50 *,
.bg-amber-50 *,
.bg-yellow-50 * {
  color: #172033 !important;
}


/* =====================================================
   SPECIAL SUMMARY BOXES
===================================================== */

.bg-emerald-100,
.bg-green-100,
.bg-teal-100,
.bg-blue-100,
.bg-indigo-100,
.bg-purple-100,
.bg-pink-100,
.bg-rose-100,
.bg-orange-100,
.bg-amber-100,
.bg-yellow-100 {
  color: #172033 !important;
}

.bg-emerald-100 *,
.bg-green-100 *,
.bg-teal-100 *,
.bg-blue-100 *,
.bg-indigo-100 *,
.bg-purple-100 *,
.bg-pink-100 *,
.bg-rose-100 *,
.bg-orange-100 *,
.bg-amber-100 *,
.bg-yellow-100 * {
  color: #172033 !important;
}
  /* =====================================================
   FIX LIGHT INSIGHT BOX TEXT VISIBILITY
===================================================== */

/* Audience chart keela irukkura insight boxes */
.bg-white\/10,
.bg-white\/5,
.bg-white\/\[0\.08\],
.bg-white\/\[0\.06\] {
  color: #1E293B !important;
}

/* Light background cards - all text dark */
.bg-\[\#F4EDEE\],
.bg-\[\#E8F3F1\],
.bg-\[\#F5EBDD\],
.bg-\[\#EEE8F0\],
.bg-\[\#EAF0F8\] {
  color: #1E293B !important;
}

/* Light cards ulla heading, paragraph and span */
.bg-\[\#F4EDEE\] *,
.bg-\[\#E8F3F1\] *,
.bg-\[\#F5EBDD\] *,
.bg-\[\#EEE8F0\] *,
.bg-\[\#EAF0F8\] * {
  color: #1E293B !important;
}


/* Chart insight / recommendation boxes */
[class*="Peak"],
[class*="peak"],
[class*="Active"],
[class*="active"] {
  color: #1E293B;
}


/* =====================================================
   GENERAL LIGHT BOX FIX
===================================================== */

/* Light background irundha dark font */
div[style*="background-color: rgb(255"],
div[style*="background-color: rgb(245"],
div[style*="background-color: rgb(240"],
div[style*="background-color: rgb(235"] {
  color: #1E293B !important;
}

div[style*="background-color: rgb(255"] *,
div[style*="background-color: rgb(245"] *,
div[style*="background-color: rgb(240"] *,
div[style*="background-color: rgb(235"] * {
  color: #1E293B !important;
}
  /* =====================================================
   FINAL TEXT VISIBILITY FIX – ALL DASHBOARD MODULES
===================================================== */

/* DARK DASHBOARD – MAIN HEADINGS */
.ad-card h1,
.ad-card h2,
.ad-card h3,
.ad-card h4,
.ad-card h5,
.ad-card h6,
.content-card h1,
.content-card h2,
.content-card h3,
.content-card h4,
.content-card h5,
.content-card h6,
.revenue-card h1,
.revenue-card h2,
.revenue-card h3,
.revenue-card h4,
.growth-card h1,
.growth-card h2,
.growth-card h3,
.growth-card h4 {
  color: #F8FAFC !important;
}


/* DARK DASHBOARD – NORMAL TEXT */
.ad-card p,
.ad-card span,
.content-card p,
.content-card span,
.revenue-card p,
.revenue-card span,
.growth-card p,
.growth-card span {
  color: #CBD5E1 !important;
}


/* =====================================================
   CONTENT ANALYTICS – 6 CONTENT FOUND
===================================================== */

/* Search result count button */
[class*="content-found"],
[class*="result-count"],
[class*="resultCount"] {
  color: #1E293B !important;
  font-weight: 700 !important;
}


/* Light background button text */
button[style*="background"],
button[class*="bg-[#"] {
  color: #1E293B;
}


/* =====================================================
   LIGHT INSIGHT / RECOMMENDATION BOXES
===================================================== */

.ad-card div[style*="background"],
.content-card div[style*="background"],
.revenue-card div[style*="background"],
.growth-card div[style*="background"] {
  color: #1E293B;
}


/* Light box ulla all text */
.ad-card div[style*="background"] *,
.content-card div[style*="background"] *,
.revenue-card div[style*="background"] *,
.growth-card div[style*="background"] * {
  color: #1E293B !important;
}


/* =====================================================
   GROWTH & TRENDS – CHART TEXT
===================================================== */

/* Chart headings */
.recharts-wrapper text {
  fill: #CBD5E1 !important;
}




/* Chart grid lines */
.recharts-cartesian-grid line {
  stroke: #475569 !important;
}


/* Chart axis lines */
.recharts-cartesian-axis-line {
  stroke: #64748B !important;
}


/* =====================================================
   TABLE HEADINGS
===================================================== */

table th {
  color: #1E293B !important;
  font-weight: 700 !important;
}

table td {
  color: #CBD5E1 !important;
}

/* ===== TABLE HEADER FIX ===== */

table th,
thead th,
thead tr th,
.ad-table th,
.ad-card table th {
  color: #F8FAFC !important;
  font-weight: 700 !important;
  opacity: 1 !important;
}

table td,
tbody td {
  color: #E5E7EB !important;
}
/* =====================================================
   REVENUE SECTION
===================================================== */

[class*="revenue"] h1,
[class*="revenue"] h2,
[class*="revenue"] h3,
[class*="revenue"] h4 {
  color: #F8FAFC !important;
}

[class*="revenue"] p,
[class*="revenue"] span,
[class*="revenue"] label {
  color: #CBD5E1 !important;
}


/* Revenue light summary boxes */
[class*="revenue"] div[style*="background"] {
  color: #1E293B !important;
}

[class*="revenue"] div[style*="background"] * {
  color: #1E293B !important;
}
/* =====================================================
   RECHARTS TEXT VISIBILITY FIX
===================================================== */

/* All chart text */
.recharts-text,
.recharts-layer text,
.recharts-label,
.recharts-cartesian-axis text,
.recharts-cartesian-axis-tick-value,
.recharts-cartesian-axis-ticks text {
  fill: #FFFFFF !important;
  color: #FFFFFF !important;
  opacity: 1 !important;
  visibility: visible !important;
  font-size: 12px !important;
  font-weight: 600 !important;
}

/* X Axis */
.recharts-xAxis text {
  fill: #FFFFFF !important;
}

/* Y Axis */
.recharts-yAxis text {
  fill: #FFFFFF !important;
}

/* Legend text */
.recharts-legend-item-text,
.recharts-default-legend text {
  fill: #FFFFFF !important;
  color: #FFFFFF !important;
  opacity: 1 !important;
}

/* Pie labels */
.recharts-pie-label-text,
.recharts-pie-label-line {
  fill: #FFFFFF !important;
  stroke: #FFFFFF !important;
}

/* LabelList */
.recharts-label-list text {
  fill: #FFFFFF !important;
}

/* Reference line labels */
.recharts-reference-line-label text {
  fill: #FFFFFF !important;
}

/* =====================================================
   GROWTH & TRENDS
===================================================== */

[class*="growth"] h1,
[class*="growth"] h2,
[class*="growth"] h3,
[class*="growth"] h4 {
  color: #F8FAFC !important;
}

[class*="growth"] p,
[class*="growth"] span,
[class*="growth"] label {
  color: #CBD5E1 !important;
}`

}


</style>
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
    {
  key: "performance",
  label: "Performance",
  icon: TrendingUp,
},

    {
  key: "reports",
  label: "Marketing Reports",
  icon: FileText,
},
  ];
}

else if (userRole === "Administrator") {
  NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "users", label: "User Management", icon: Users },
    { key: "settings", label: "System Settings", icon: Settings },
    {
  key: "security-audit",
  label: "Security & Audit",
  icon: ShieldCheck,
},
  {
  key: "admin-reports",
  label: "Reports",
  icon: FileText,
},
{
  key: "admin-notifications",
  label: "Notifications",
  icon: Bell,
}
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
  accent: {
    fg: "#FF7A59",
    soft: "rgba(255,122,89,0.18)",
  },

  teal: {
    fg: "#14B8A6",
    soft: "rgba(20,184,166,0.18)",
  },

  rose: {
    fg: "#F43F5E",
    soft: "rgba(244,63,94,0.18)",
  },

  amber: {
    fg: "#FBBF24",
    soft: "rgba(251,191,36,0.18)",
  },
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
  const Icon = item.icon;

  return (
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            {item.label}
          </p>

          <h2
            className="text-3xl font-bold mt-2"
            style={{ color: "var(--ink)" }}
          >
            {item.prefix || ""}
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
            {item.suffix || ""}
          </h2>

          <p
            className="text-sm mt-2 font-semibold"
            style={{
              color: item.positive ? "#16A34A" : "#DC2626",
            }}
          >
            {item.positive ? "▲" : "▼"} {Math.abs(item.delta)}%
          </p>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "#EFF6FF",
            color: "#2563EB",
          }}
        >
          <Icon size={28} strokeWidth={2} />
        </div>

      </div>

      <div className="mt-5 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={item.spark}>
            <Area
              dataKey="v"
              stroke="#2563EB"
              fill="#BFDBFE"
              fillOpacity={0.4}
              strokeWidth={2}
            />
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
  backgroundColor: "#1E293B",
  border: "1px solid #475569",
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 14px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
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
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
      <XAxis
  dataKey="date"
 tick={{
  fill: "#FFFFFF",
  fontSize: 12,
  fontWeight: 600,
}}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
      <YAxis
 tick={{
  fill: "#FFFFFF",
  fontSize: 12,
  fontWeight: 600,
}}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
<Tooltip content={<CustomTooltip />} />

<Area
  type="monotone"
  dataKey="lastPeriod"
  name="Last Period"
  stroke="#D6D9E6"
  strokeWidth={2}
  fill="none"
  strokeDasharray="4 4"
/>

<Area
  type="monotone"
  dataKey="views"
  name="Views"
  stroke="#D95D47"
  strokeWidth={2.5}
  fill="url(#viewsFill)"
/>
      <Area type="monotone" dataKey="lastPeriod" name="Last Period" stroke="#D6D9E6" strokeWidth={2} fill="none" strokeDasharray="4 4" />
      <Area type="monotone" dataKey="views" name ="Views"stroke="#D95D47" strokeWidth={2.5} fill="url(#viewsFill)" />
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
     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
     <XAxis
  dataKey="type"
  tick={{
    fontSize: 12,
    fill: "#FFFFFF",
    fontWeight: 600,
  }}axisLine={false} tickLine={false} width={40}  />
      <YAxis
  tick={{
    fontSize: 12,
    fill: "#FFFFFF",
    fontWeight: 600,
  }}axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={40} />
<Tooltip content={<CustomTooltip />} />
      <Bar
  dataKey="value"
  name="Interactions"
  radius={[8,8,0,0]}
>
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
      <XAxis
  dataKey="date"
  tick={{ fill: "#F8FAFC", fontSize: 12 }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
<YAxis
  tick={{ fill: "#F8FAFC", fontSize: 12 }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
     <Tooltip content={CustomTooltip } />

    return (
      <div
        style={{
          background: "#1E293B",
          border: "1px solid #475569",
          borderRadius: "12px",
          padding: "12px",
          color: "#FFFFFF",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {label}
        </p>

        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: "#FFFFFF",
              margin: "4px 0",
              fontWeight: 600,
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
      <Line
  type="monotone"
  dataKey="revenue"
  name="Revenue"
  stroke="#F5A524"
  strokeWidth={2.5}
  dot={false}
  activeDot={{ r: 5 }}
/>
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
      <XAxis
  dataKey="date"
  tick={{ fill: "#F8FAFC", fontSize: 12 }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
      <YAxis
  tick={{ fill: "#F8FAFC", fontSize: 12 }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
/>
<Tooltip content={CustomTooltip} />

    return (
      <div
        style={{
          background: "#1E293B",
          border: "1px solid #475569",
          borderRadius: "12px",
          padding: "12px",
          color: "#FFFFFF",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {label}
        </p>

        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: "#FFFFFF",
              margin: "4px 0",
              fontWeight: 600,
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
      <Area type="monotone" dataKey="followers" name="Followers"stroke="#12B5A6" strokeWidth={2.5} fill="url(#followFill)" />
      <Line type="monotone" dataKey="unfollows" name="Unfollows" stroke="#F0466E" strokeWidth={2} dot={false} />
    </AreaChart>
  </ChartCard>
);

const DemographicsPie = () => (
  <ChartCard title="Age Distribution" subtitle="Share of total audience" height={260}>
    <PieChart>
      <Pie data={ageGroups} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={4}>
        {ageGroups.map((g, i) => <Cell key={i} fill={g.color} stroke="none" />)}
      </Pie>
<Tooltip content={<CustomTooltip />} />

    return (
      <div
        style={{
          background: "#1E293B",
          border: "1px solid #475569",
          borderRadius: "12px",
          padding: "12px",
          color: "#FFFFFF",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {label}
        </p>

        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: "#FFFFFF",
              margin: "4px 0",
              fontWeight: 600,
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
      <Legend
  verticalAlign="bottom"
  height={36}
  formatter={(v) => (
    <span
      style={{
        color: "#111827",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {v}
    </span>
  )}
  iconType="circle"
  iconSize={10}
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
     <Tooltip content={<CustomTooltip />} />
    return (
      <div
        style={{
          background: "#1E293B",
          border: "1px solid #475569",
          borderRadius: "12px",
          padding: "12px",
          color: "#FFFFFF",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {label}
        </p>

        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: "#FFFFFF",
              margin: "4px 0",
              fontWeight: 600,
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );

     <Legend
  verticalAlign="bottom"
  height={36}
  formatter={(v) => (
    <span
      style={{
        color: "#111827",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {v}
    </span>
  )}
  iconType="circle"
  iconSize={10}
/>
    </PieChart>
  </ChartCard>
);

const LocationsCard = () => (
  <div className="ad-card p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-sm font-semibold" style={{ color: "var(--ink)" }}>Top Locations</h3>
      <Globe
  size={18}
  color="#F8FAFC"
  strokeWidth={2.2}
style={{ color: "var(--muted)" }} />
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
const Navbar = ({globalSearch,setGlobalSearch,handleGlobalSearch,}) => {
  <header
    className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-7 h-16 shrink-0 backdrop-blur"
    style={{ background: "rgba(245,246,250,0.85)", borderBottom: "1px solid var(--border)" }}
  >
    <button className="md:hidden" onClick={() => setMobileOpen(true)}>
      <Menu size={20} style={{ color: "var(--ink)" }} />
    </button>

    <div className="hidden md:block">
      <h1 className="font-display text-base font-semibold" style={{ color: "var(--ink)" }}>Dashboard</h1>
    </div>

    <div className="flex-1 flex justify-end md:justify-center">
      <div className="relative w-full max-w-sm hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
      <input
  type="text"
  value={globalSearch}
  onChange={(e) =>
    setGlobalSearch(e.target.value)
  }
  onKeyDown={handleGlobalSearch}
  placeholder="Search dashboard features..."
  className="w-full bg-transparent outline-none text-sm"
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
};

/* ============================================================
   PAGES
   ============================================================ */
const DashboardHome = ({ user, userRole }) => (
  <div className="space-y-6">
    <SectionHeader
      eyebrow="Overview"
      title={`Welcome back, ${user?.fullName || "User"}`}
      Eye size={40} color="red"
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
            style={{
  background: "#eb3a0a",
  color: "#FFFFFF",
}}

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
    background: "#14B8A6",
  }}
>
  <Users
    size={22}
    color="#FFFFFF"
    strokeWidth={2.8}
  />
        </div>
      </div>
    </div>

    {/* Engagement Rate */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">
        

        <div>
          <p
            className="text-xs font-medium"
            style={{
  background: "#EA580C",
  color: "#FFFFFF",
}}
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
    background: "#F97316",
  }}
>
  <Heart
    size={22}
    color="#FFFFFF"
    strokeWidth={2.8}
  />

        </div>

      </div>
    </div>

    {/* Average Watch Time */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-xs font-medium"
            style={{
  background: "#CA8A04",
  color: "#FFFFFF",
}}
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
    background: "#EAB308",
  }}
>
  <Clock
    size={22}
    color="#FFFFFF"
    strokeWidth={2.8}
  />
</div>
      </div>
    </div>

    {/* Total Interactions */}
    <div className="ad-card ad-card-hover p-5">
      <div className="flex items-center justify-between">

        <div>
          <p
            className="text-xs font-medium"
            style={{
  background: "#BE185D",
  color: "#FFFFFF",
}}
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
    background: "#EC4899",
  }}
>
  <MessageCircle
    size={22}
    color="#FFFFFF"
    strokeWidth={2.8}
  />
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
                <Play
  size={18}
  color="#FFFFFF"
  strokeWidth={2.4}
 style={{
  background: "#334155"
}} />
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

<Tooltip content={<CustomTooltip />} />
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
                "#e64713",
              color:
                "#bfaca9"
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
// ==========================================
// AGENCY DASHBOARD
// ==========================================

const AgencyDashboard = () => {
  const [searchCreator, setSearchCreator] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const agencyGrowthData = [
    { month: "Jan", creators: 18, campaigns: 10, revenue: 2.1 },
    { month: "Feb", creators: 21, campaigns: 13, revenue: 2.6 },
    { month: "Mar", creators: 24, campaigns: 16, revenue: 3.2 },
    { month: "Apr", creators: 27, campaigns: 19, revenue: 3.8 },
    { month: "May", creators: 31, campaigns: 23, revenue: 4.5 },
    { month: "Jun", creators: 36, campaigns: 28, revenue: 5.2 },
  ];

  const campaignData = [
    { name: "Beauty Launch", progress: 92, status: "Active" },
    { name: "Tech Product", progress: 76, status: "Active" },
    { name: "Fashion Week", progress: 100, status: "Completed" },
    { name: "Food Promotion", progress: 48, status: "In Progress" },
  ];

  const creatorPerformance = [
    {
      name: "Ananya",
      followers: "2.4M",
      engagement: "8.9%",
      revenue: "₹1.25L",
    },
    {
      name: "Kavin",
      followers: "1.8M",
      engagement: "7.8%",
      revenue: "₹98K",
    },
    {
      name: "Priya",
      followers: "1.3M",
      engagement: "7.2%",
      revenue: "₹82K",
    },
    {
      name: "Arun",
      followers: "950K",
      engagement: "6.8%",
      revenue: "₹67K",
    },
  ];

  return (
    <div className="space-y-6">

      <SectionHeader
        eyebrow="Agency Intelligence"
        title="Agency Performance Dashboard"
        subtitle="Monitor creators, campaigns, revenue and agency growth from one intelligent workspace."
      />

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="ad-card p-5 border-l-4 border-blue-600">
          <p className="text-sm text-slate-500">
            Total Creators
          </p>

          <h2 className="text-3xl font-bold mt-2">
            36
          </h2>

          <p className="text-green-600 text-sm mt-2">
            +16% this month
          </p>
        </div>

        <div className="ad-card p-5 border-l-4 border-purple-600">
          <p className="text-sm text-slate-500">
            Active Campaigns
          </p>

          <h2 className="text-3xl font-bold mt-2">
            28
          </h2>

          <p className="text-green-600 text-sm mt-2">
            +8 new campaigns
          </p>
        </div>

        <div className="ad-card p-5 border-l-4 border-emerald-600">
          <p className="text-sm text-slate-500">
            Agency Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹5.2L
          </h2>

          <p className="text-green-600 text-sm mt-2">
            +24% growth
          </p>
        </div>

        <div className="ad-card p-5 border-l-4 border-orange-500">
          <p className="text-sm text-slate-500">
            Campaign Success
          </p>

          <h2 className="text-3xl font-bold mt-2">
            91%
          </h2>

          <p className="text-green-600 text-sm mt-2">
            Above target
          </p>
        </div>

      </div>


      {/* GROWTH CHART */}

      <div className="ad-card p-6">

        <h2 className="text-xl font-bold">
          Agency Growth Overview
        </h2>

        <p className="text-sm text-slate-500 mb-5">
          Creator growth and campaign performance over time
        </p>

        <ResponsiveContainer
          width="100%"
          height={330}
        >

          <LineChart
            data={agencyGrowthData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />
<Tooltip content={<CustomTooltip />} />

           <Legend
  wrapperStyle={{
    color: "#F8FAFC"
  }}
/>

            <Line
              type="monotone"
              dataKey="creators"
              stroke="#2563EB"
              strokeWidth={3}
              name="Creators"
            />

            <Line
              type="monotone"
              dataKey="campaigns"
              stroke="#9333EA"
              strokeWidth={3}
              name="Campaigns"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* CAMPAIGN + CREATOR */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* CAMPAIGN TRACKER */}

        <div className="ad-card p-6">

          <h2 className="text-xl font-bold mb-5">
            Campaign Progress
          </h2>

          <div className="space-y-5">

            {campaignData.map(
              (campaign, index) => (

                <div key={index}>

                  <div className="flex justify-between">

                    <div>

                      <p className="font-semibold">
                        {campaign.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {campaign.status}
                      </p>

                    </div>

                    <span className="font-bold">
                      {campaign.progress}%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full mt-2">

                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{
                        width:
                          `${campaign.progress}%`
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* CREATOR SEARCH AND FILTER */}

<div className="ad-card p-6">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

    <div>

      <h2 className="text-2xl font-bold">
        Creator Management
      </h2>

      <p className="text-base text-slate-500 mt-1">
        Search and filter creators based on category.
      </p>

    </div>

    <div className="flex flex-col sm:flex-row gap-3">

      <input
        type="text"
        value={searchCreator}
        onChange={(e) =>
          setSearchCreator(e.target.value)
        }
        placeholder="Search creator..."
        className="w-full sm:w-64 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={selectedCategory}
        onChange={(e) =>
          setSelectedCategory(e.target.value)
        }
        className="border border-slate-300 rounded-xl px-4 py-3 bg-white"
      >

        <option value="All">
          All Categories
        </option>

        <option value="Beauty & Lifestyle">
          Beauty & Lifestyle
        </option>

        <option value="Technology">
          Technology
        </option>

        <option value="Fashion">
          Fashion
        </option>

        <option value="Food & Travel">
          Food & Travel
        </option>

        <option value="Fitness">
          Fitness
        </option>

      </select>

    </div>

  </div>

</div>
        {/* TOP CREATORS */}

        <div className="ad-card p-6">

          <h2 className="text-xl font-bold mb-5">
            Top Creator Performance
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Creator
                  </th>

                  <th className="text-left">
                    Followers
                  </th>

                  <th className="text-left">
                    Engagement
                  </th>

                  <th className="text-left">
                    Revenue
                  </th>

                </tr>

              </thead>

              <tbody>

                {creatorPerformance.map(
                  (creator, index) => (

                    <tr
                      key={index}
                      className="border-b"
                    >

                      <td className="py-4 font-semibold">

                        <div className="flex items-center gap-2">

                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">

                            {creator.name[0]}

                          </div>

                          {creator.name}

                        </div>

                      </td>

                      <td>
                        {creator.followers}
                      </td>

                      <td className="text-green-600">
                        {creator.engagement}
                      </td>

                      <td className="font-semibold">
                        {creator.revenue}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* AGENCY INSIGHTS */}

      <div className="ad-card p-6">

        <h2 className="text-xl font-bold mb-4">

          🤖 AI Agency Insights

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="border rounded-xl p-4">

            <h3 className="font-semibold">
              Best Creator
            </h3>

            <p className="text-sm text-slate-500 mt-2">

              Ananya generated the highest
              engagement and revenue this month.

            </p>

          </div>

          <div className="border rounded-xl p-4">

            <h3 className="font-semibold">
              Campaign Opportunity
            </h3>

            <p className="text-sm text-slate-500 mt-2">

              Technology campaigns show
              strong audience growth.

            </p>

          </div>

          <div className="border rounded-xl p-4">

            <h3 className="font-semibold">
              Revenue Forecast
            </h3>

            <p className="text-sm text-slate-500 mt-2">

              Agency revenue may reach
              ₹6.4L next month.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
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
<Tooltip content={<CustomTooltip />} />

           <Legend
  wrapperStyle={{
    color: "#F8FAFC"
  }}
/>

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

            <p className="mt-2 text-base text-slate-600">
              Technology content generates the highest average views and engagement.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              🚀 Fastest Growing Content
            </h3>

            <p className="mt-2 text-base text-slate-600">
              AI Tools Explained achieved 42% growth within the first 60 days.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              #️⃣ Most Effective Hashtag
            </h3>

            <p className="mt-2 text-base text-slate-600">
              #AI has the highest reach and a 9.2% engagement rate.
            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="font-bold">
              📈 Overall Growth Trend
            </h3>

            <p className="mt-2 text-base text-slate-600">
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
  const [globalSearch, setGlobalSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
const handleGlobalSearch = (e) => {
  if (e.key !== "Enter") return;

  const search = globalSearch
    .trim()
    .toLowerCase();

  if (!search) return;

  if (
    search.includes("overview") ||
    search.includes("dashboard") ||
    search.includes("home")
  ) {
    setActiveNav("overview");
  } else if (
    search.includes("campaign")
  ) {
    setActiveNav("campaigns");
  } else if (
    search.includes("audience")
  ) {
    setActiveNav("audience");
  } else if (
    search.includes("performance")
  ) {
    setActiveNav("performance");
  } else if (
    search.includes("report")
  ) {
    setActiveNav("reports");
  } else if (
    search.includes("revenue")
  ) {
    setActiveNav("revenue");
  } else if (
    search.includes("creator")
  ) {
    setActiveNav("creators");
  } else if (
    search.includes("user")
  ) {
    setActiveNav("users");
  } else if (
    search.includes("setting")
  ) {
    setActiveNav("settings");
  } else {
    alert(`No dashboard page found for "${globalSearch}"`);
  }

  setGlobalSearch("");
};
  const pageTitle = NAV_ITEMS.find((n) => n.key === active)?.label || "Dashboard";
  // ==========================================
// AGENCY CREATORS DASHBOARD
// ==========================================

const AgencyCreatorsDashboard = () => {
  const [searchCreator, setSearchCreator] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const creatorGrowthData = [
    { month: "Jan", creators: 18, engagement: 6.2 },
    { month: "Feb", creators: 21, engagement: 6.5 },
    { month: "Mar", creators: 24, engagement: 6.9 },
    { month: "Apr", creators: 28, engagement: 7.2 },
    { month: "May", creators: 33, engagement: 7.6 },
    { month: "Jun", creators: 36, engagement: 8.1 },
  ];

  const creators = [
    {
      name: "Ananya",
      category: "Beauty & Lifestyle",
      followers: "2.4M",
      engagement: "8.9%",
      reach: "1.8M",
      performance: 96,
      status: "Excellent",
    },
    {
      name: "Kavin",
      category: "Technology",
      followers: "1.8M",
      engagement: "8.2%",
      reach: "1.4M",
      performance: 92,
      status: "Excellent",
    },
    {
      name: "Priya",
      category: "Fashion",
      followers: "1.3M",
      engagement: "7.5%",
      reach: "980K",
      performance: 84,
      status: "Good",
    },
    {
      name: "Arun",
      category: "Food & Travel",
      followers: "950K",
      engagement: "6.8%",
      reach: "760K",
      performance: 76,
      status: "Good",
    },
    {
      name: "Divya",
      category: "Fitness",
      followers: "720K",
      engagement: "5.9%",
      reach: "580K",
      performance: 90,
      status: "Needs Attention",
    },
  ];
  const filteredCreators = creators.filter((creator) => {
  const matchesSearch = creator.name
    .toLowerCase()
    .includes(searchCreator.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    creator.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
  return (
    <div className="space-y-6">

      <SectionHeader
        eyebrow="Creator Management"
        title="Agency Creator Analytics"
        subtitle="Monitor creator growth, engagement, reach and overall performance."
      />
    

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="ad-card p-6 border-l-4 border-blue-600">
          <p className="text-base text-slate-500">
            Total Creators
          </p>

          <h2 className="text-3xl font-bold mt-2">
            36
          </h2>

          <p className="text-green-600 mt-2">
            +5 this month
          </p>
        </div>

        <div className="ad-card p-6 border-l-4 border-green-600">
          <p className="text-base text-slate-500">
            Active Creators
          </p>

          <h2 className="text-3xl font-bold mt-2">
            31
          </h2>

          <p className="text-green-600 mt-2">
            86% active rate
          </p>
        </div>

        <div className="ad-card p-6 border-l-4 border-purple-600">
          <p className="text-base text-slate-500">
            Average Engagement
          </p>

          <h2 className="text-3xl font-bold mt-2">
            7.6%
          </h2>

          <p className="text-purple-600 mt-2">
            +0.8% improvement
          </p>
        </div>

        <div className="ad-card p-6 border-l-4 border-orange-500">
          <p className="text-base text-slate-500">
            New Creators
          </p>

          <h2 className="text-3xl font-bold mt-2">
            5
          </h2>

          <p className="text-orange-600 mt-2">
            Joined this month
          </p>
        </div>

      </div>


      {/* CREATOR GROWTH CHART */}

      <div className="ad-card p-6">

        <h2 className="text-2xl font-bold">
          Creator Growth & Engagement
        </h2>

        <p className="text-base text-slate-500 mb-5">
          Agency creator count and average engagement over time
        </p>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart data={creatorGrowthData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />

<Tooltip content={<CustomTooltip />} />

            <Legend
  wrapperStyle={{
    color: "#F8FAFC"
  }}
/>
            <Line
              type="monotone"
              dataKey="creators"
              stroke="#2563EB"
              strokeWidth={3}
              name="Creators"
            />

            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#9333EA"
              strokeWidth={3}
              name="Engagement %"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* TOP CREATORS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="ad-card p-6 xl:col-span-2">

          <h2 className="text-2xl font-bold mb-5">
            Creator Performance
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-base">

              <thead>

                <tr className="border-b bg-slate-50">

                  <th className="text-left p-4">
                    Creator
                  </th>

                  <th className="text-left p-4">
                    Category
                  </th>

                  <th className="text-left p-4">
                    Followers
                  </th>

                  <th className="text-left p-4">
                    Engagement
                  </th>

                  <th className="text-left p-4">
                    Reach
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCreators.map((creator, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                          {creator.name[0]}

                        </div>

                        <span className="font-semibold">

                          {creator.name}

                        </span>

                      </div>

                    </td>

                    <td className="p-4">

                      {creator.category}

                    </td>

                    <td className="p-4 font-semibold">

                      {creator.followers}

                    </td>

                    <td className="p-4 text-green-600 font-semibold">

                      {creator.engagement}

                    </td>

                    <td className="p-4">

                      {creator.reach}

                    </td>
                    <td className="p-4">
  <div className="min-w-[110px]">
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm font-semibold text-slate-700">
        {creator.performance}%
      </span>
    </div>

    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className={
          creator.performance >= 80
            ? "h-full bg-green-500 rounded-full"
            : creator.performance >= 60
            ? "h-full bg-blue-500 rounded-full"
            : "h-full bg-orange-500 rounded-full"
        }
        style={{
          width: `${creator.performance}%`,
        }}
      />
    </div>
  </div>
</td>

                    <td className="p-4">

                      <span
                        className={
                          creator.status === "Excellent"
                            ? "px-3 py-1 rounded-full bg-green-100 text-green-700"
                            : creator.status === "Good"
                            ? "px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                            : "px-3 py-1 rounded-full bg-red-100 text-red-700"
                        }
                      >

                        {creator.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* AI INSIGHTS */}

        <div className="ad-card p-6">

          <h2 className="text-2xl font-bold mb-5">

            🤖 Creator Insights

          </h2>

          <div className="space-y-5">

            <div className="border rounded-xl p-4">

              <p className="font-bold">

                Top Performer

              </p>

              <p className="text-base text-slate-500 mt-2">

                Ananya has the highest engagement
                rate at 8.9%.

              </p>

            </div>

            <div className="border rounded-xl p-4">

              <p className="font-bold">

                Growth Opportunity

              </p>

              <p className="text-base text-slate-500 mt-2">

                Technology creators show the
                fastest audience growth.

              </p>

            </div>

            <div className="border rounded-xl p-4">

              <p className="font-bold">

                Attention Required

              </p>

              <p className="text-base text-slate-500 mt-2">

                Divya's engagement dropped.
                Consider improving posting time.

              </p>

            </div>

          </div>

        </div>

      </div>
             {/* ========================================== */}
      {/* CREATOR CATEGORY PERFORMANCE */}
      {/* ========================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="ad-card p-6">

          <h2 className="text-2xl font-bold">
            Content Category Performance
          </h2>

          <p className="text-base text-slate-500 mb-5">
            Compare creator performance across content categories
          </p>

          <ResponsiveContainer width="100%" height={330}>

            <BarChart
              data={[
                {
                  category: "Beauty",
                  engagement: 8.9,
                  reach: 1.8,
                },
                {
                  category: "Technology",
                  engagement: 8.2,
                  reach: 1.4,
                },
                {
                  category: "Fashion",
                  engagement: 7.5,
                  reach: 0.98,
                },
                {
                  category: "Food",
                  engagement: 6.8,
                  reach: 0.76,
                },
                {
                  category: "Fitness",
                  engagement: 5.9,
                  reach: 0.58,
                },
              ]}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="category"
              />

              <YAxis />
<Tooltip content={<CustomTooltip />} />

             <Legend
  wrapperStyle={{
    color: "#F8FAFC"
  }}
/>
              <Bar
                dataKey="engagement"
                name="Engagement %"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey="reach"
                name="Reach (Millions)"
                fill="#8B5CF6"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* CREATOR STATUS */}

        <div className="ad-card p-6">

          <h2 className="text-2xl font-bold">
            Creator Status Overview
          </h2>

          <p className="text-base text-slate-500 mb-6">
            Current performance status of agency creators
          </p>

          <div className="space-y-5">

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  Excellent
                </span>

                <span className="font-bold text-green-600">
                  2 Creators
                </span>

              </div>

              <div className="w-full bg-slate-200 rounded-full h-3">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: "40%" }}
                />

              </div>

            </div>


            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  Good
                </span>

                <span className="font-bold text-blue-600">
                  2 Creators
                </span>

              </div>

              <div className="w-full bg-slate-200 rounded-full h-3">

                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "40%" }}
                />

              </div>

            </div>


            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  Needs Attention
                </span>

                <span className="font-bold text-red-600">
                  1 Creator
                </span>

              </div>

              <div className="w-full bg-slate-200 rounded-full h-3">

                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: "20%" }}
                />

              </div>

            </div>

          </div>


          <div className="mt-8 border rounded-2xl p-5 bg-slate-50">

            <p className="font-bold text-lg">

              📊 Agency Health Score

            </p>

            <div className="flex items-end gap-3 mt-3">

              <h2 className="text-5xl font-bold text-blue-700">

                91

              </h2>

              <span className="text-slate-500 mb-2">

                / 100

              </span>

            </div>

            <p className="text-green-600 font-semibold mt-2">

              Excellent agency performance

            </p>

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* CREATOR MANAGEMENT ACTIONS */}
      {/* ========================================== */}

      <div className="ad-card p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-2xl font-bold">

              Creator Management Center

            </h2>

            <p className="text-base text-slate-500 mt-1">

              Monitor creator activity and manage agency operations.

            </p>

          </div>

          <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
          >

            + Add New Creator

          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

          <div className="border rounded-2xl p-5">

            <h3 className="font-bold text-lg">

              📅 Upcoming Reviews

            </h3>

            <p className="text-3xl font-bold mt-3">

              8

            </p>

            <p className="text-slate-500">

              Creator performance reviews

            </p>

          </div>


          <div className="border rounded-2xl p-5">

            <h3 className="font-bold text-lg">

              🤝 Campaign Assignments

            </h3>

            <p className="text-3xl font-bold mt-3">

              14

            </p>

            <p className="text-slate-500">

              Active creator campaigns

            </p>

          </div>


          <div className="border rounded-2xl p-5">

            <h3 className="font-bold text-lg">

              🔔 Pending Actions

            </h3>

            <p className="text-3xl font-bold mt-3">

              5

            </p>

            <p className="text-slate-500">

              Tasks requiring attention

            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
// ==========================================
// AGENCY CAMPAIGNS DASHBOARD
// ==========================================

const AgencyCampaignsDashboard = () => {
  const campaignPerformanceData = [
  {
    month: "Jan",
    reach: 120,
    engagement: 5.8,
    conversions: 420,
  },
  {
    month: "Feb",
    reach: 145,
    engagement: 6.4,
    conversions: 510,
  },
  {
    month: "Mar",
    reach: 168,
    engagement: 6.9,
    conversions: 620,
  },
  {
    month: "Apr",
    reach: 195,
    engagement: 7.3,
    conversions: 740,
  },
  {
    month: "May",
    reach: 230,
    engagement: 8.1,
    conversions: 890,
  },
  {
    month: "Jun",
    reach: 275,
    engagement: 8.7,
    conversions: 1080,
  },
];
  const campaignData = [
    { month: "Jan", reach: 1.2, engagement: 6.1 },
    { month: "Feb", reach: 1.6, engagement: 6.8 },
    { month: "Mar", reach: 2.1, engagement: 7.2 },
    { month: "Apr", reach: 2.5, engagement: 7.8 },
    { month: "May", reach: 3.1, engagement: 8.4 },
    { month: "Jun", reach: 3.8, engagement: 9.1 },
  ];

  const campaigns = [
    {
      brand: "Glow Beauty",
      campaign: "Summer Glow 2026",
      creators: 8,
      budget: "₹4.5L",
      reach: "2.1M",
      status: "Active",
    },
    {
      brand: "TechNova",
      campaign: "Smart Device Launch",
      creators: 6,
      budget: "₹3.8L",
      reach: "1.7M",
      status: "Active",
    },
    {
      brand: "StyleHub",
      campaign: "Monsoon Fashion",
      creators: 5,
      budget: "₹2.9L",
      reach: "1.2M",
      status: "Scheduled",
    },
    {
      brand: "FitLife",
      campaign: "Fitness Challenge",
      creators: 4,
      budget: "₹2.2L",
      reach: "980K",
      status: "Completed",
    },
  ];
const campaignTableData = [
  {
    name: "Beauty Launch",
    brand: "Glow Beauty",
    creator: "Ananya",
    budget: "₹4.5L",
    spent: "₹3.8L",
    reach: "2.8M",
    engagement: "9.2%",
    roi: "218%",
    progress: 92,
    status: "Active",
  },
  {
    name: "Tech Product Launch",
    brand: "TechNova",
    creator: "Kavin",
    budget: "₹3.8L",
    spent: "₹2.9L",
    reach: "2.1M",
    engagement: "8.4%",
    roi: "196%",
    progress: 76,
    status: "Active",
  },
  {
    name: "Fashion Week",
    brand: "StyleHub",
    creator: "Priya",
    budget: "₹5.2L",
    spent: "₹5.2L",
    reach: "3.6M",
    engagement: "10.1%",
    roi: "245%",
    progress: 100,
    status: "Completed",
  },
  {
    name: "Food Promotion",
    brand: "TasteBox",
    creator: "Arun",
    budget: "₹2.7L",
    spent: "₹1.4L",
    reach: "1.2M",
    engagement: "5.8%",
    roi: "112%",
    progress: 48,
    status: "In Progress",
  },
];
const budgetData = [
  {
    title: "Total Campaign Budget",
    value: "₹16.2L",
    subtitle: "Allocated across 24 campaigns",
    percentage: 100,
    color: "bg-blue-600",
  },
  {
    title: "Budget Used",
    value: "₹11.8L",
    subtitle: "72.8% of total budget",
    percentage: 73,
    color: "bg-purple-600",
  },
  {
    title: "Remaining Budget",
    value: "₹4.4L",
    subtitle: "Available for active campaigns",
    percentage: 27,
    color: "bg-emerald-600",
  },
];

const campaignAlerts = [
  {
    title: "Budget Alert",
    message: "Beauty Launch has used 90% of its allocated budget.",
    type: "warning",
  },
  {
    title: "Approval Pending",
    message: "Tech Product campaign content is waiting for approval.",
    type: "info",
  },
  {
    title: "Campaign Ending",
    message: "Food Promotion ends in 3 days.",
    type: "danger",
  },
];

const upcomingCampaigns = [
  {
    name: "Summer Fashion Campaign",
    brand: "StyleHub",
    date: "Aug 08",
    status: "Content Review",
  },
  {
    name: "AI Product Launch",
    brand: "TechNova",
    date: "Aug 12",
    status: "Creator Assignment",
  },
  {
    name: "Healthy Food Promotion",
    brand: "TasteBox",
    date: "Aug 18",
    status: "Scheduled",
  },
];
const creatorMatches = [
  {
    creator: "Ananya",
    category: "Beauty & Lifestyle",
    campaign: "Beauty Launch",
    audienceMatch: 96,
    expectedReach: "2.8M",
    expectedEngagement: "9.2%",
    score: "Excellent Match",
  },
  {
    creator: "Kavin",
    category: "Technology",
    campaign: "AI Product Launch",
    audienceMatch: 93,
    expectedReach: "2.3M",
    expectedEngagement: "8.6%",
    score: "Excellent Match",
  },
  {
    creator: "Priya",
    category: "Fashion",
    campaign: "Summer Fashion",
    audienceMatch: 89,
    expectedReach: "1.9M",
    expectedEngagement: "7.8%",
    score: "Strong Match",
  },
];

const roiRanking = [
  {
    rank: 1,
    campaign: "Fashion Week",
    revenue: "₹12.7L",
    roi: "245%",
    growth: "+32%",
  },
  {
    rank: 2,
    campaign: "Beauty Launch",
    revenue: "₹9.8L",
    roi: "218%",
    growth: "+26%",
  },
  {
    rank: 3,
    campaign: "Tech Product Launch",
    revenue: "₹7.4L",
    roi: "196%",
    growth: "+18%",
  },
];
  return (
     <div className="space-y-6">
      {/* CAMPAIGN KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="ad-card p-6 border-l-4 border-blue-600">

          <p className="text-base text-slate-500">
            Total Campaigns
          </p>

          <h2 className="text-3xl font-bold mt-2">
            24
          </h2>

          <p className="text-green-600 mt-2">
            +4 this month
          </p>

      </div>
      <div className="ad-card p-6 border-l-4 border-green-600">

        <p className="text-base text-slate-500">
          Active Campaigns
        </p>

    <h2 className="text-3xl font-bold mt-2">
      12
    </h2>

    <p className="text-green-600 mt-2">
      50% currently active
    </p>

  </div>


  <div className="ad-card p-6 border-l-4 border-purple-600">

    <p className="text-base text-slate-500">
      Average ROI
    </p>

    <h2 className="text-3xl font-bold mt-2">
      184%
    </h2>

    <p className="text-purple-600 mt-2">
      +22% from last month
    </p>

  </div>


  <div className="ad-card p-6 border-l-4 border-orange-500">

    <p className="text-base text-slate-500">
      Campaign Revenue
    </p>

    <h2 className="text-3xl font-bold mt-2">
      ₹18.6L
    </h2>

    <p className="text-orange-600 mt-2">
      +31% growth
    </p>

  </div>

</div>
    <div className="space-y-6">

      <SectionHeader
        eyebrow="Campaign Management"
        title="Agency Campaign Analytics"
        subtitle="Track campaign performance, budget, creators and brand results."
      />


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="ad-card p-6 border-l-4 border-blue-600">

          <p className="text-base text-slate-500">
            Active Campaigns
          </p>

          <h2 className="text-3xl font-bold mt-2">
            12
          </h2>

          <p className="text-green-600 mt-2">
            +3 this month
          </p>

        </div>


        <div className="ad-card p-6 border-l-4 border-purple-600">

          <p className="text-base text-slate-500">
            Total Campaign Reach
          </p>

          <h2 className="text-3xl font-bold mt-2">
            8.6M
          </h2>

          <p className="text-purple-600 mt-2">
            +24% growth
          </p>

        </div>


        <div className="ad-card p-6 border-l-4 border-green-600">

          <p className="text-base text-slate-500">
            Campaign Engagement
          </p>

          <h2 className="text-3xl font-bold mt-2">
            8.4%
          </h2>

          <p className="text-green-600 mt-2">
            Above target
          </p>

        </div>


        <div className="ad-card p-6 border-l-4 border-orange-500">

          <p className="text-base text-slate-500">
            Campaign Budget
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹18.6L
          </h2>

          <p className="text-orange-600 mt-2">
            76% utilized
          </p>

        </div>

      </div>
      {/* CAMPAIGN PERFORMANCE ANALYTICS */}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

  {/* PERFORMANCE CHART */}

  <div className="ad-card p-6 xl:col-span-2">

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-2xl font-bold">
          Campaign Performance Trend
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Reach, engagement and conversions over the last 6 months
        </p>

      </div>

      <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
        Last 6 Months
      </span>

    </div>

    <ResponsiveContainer
      width="100%"
      height={330}
    >

      <LineChart
        data={campaignPerformanceData}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="month"
        />

        <YAxis />
<Tooltip content={<CustomTooltip />} />
        <Legend
  wrapperStyle={{
    color: "#F8FAFC"
  }}
  wrapperStyle={{
    color: "#F8FAFC"
  }}
/>

        <Line
          type="monotone"
          dataKey="reach"
          stroke="#2563EB"
          strokeWidth={3}
          name="Reach (K)"
          dot={{
            r: 4,
          }}
        />

        <Line
          type="monotone"
          dataKey="engagement"
          stroke="#9333EA"
          strokeWidth={3}
          name="Engagement %"
          dot={{
            r: 4,
          }}
        />

        <Line
          type="monotone"
          dataKey="conversions"
          stroke="#059669"
          strokeWidth={3}
          name="Conversions"
          dot={{
            r: 4,
          }}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>


  {/* AI CAMPAIGN INSIGHTS */}

  <div className="ad-card p-6">

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-xl font-bold">
          🤖 AI Campaign Insights
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Smart performance recommendations
        </p>

      </div>

    </div>


    <div className="space-y-4">

      <div className="border border-green-200 bg-green-50 rounded-xl p-4">

        <p className="font-bold text-green-800">
          Top Campaign
        </p>

        <p className="text-sm text-green-700 mt-2">
          Beauty Launch achieved 92% of its target
          with the highest engagement rate.
        </p>

      </div>


      <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">

        <p className="font-bold text-blue-800">
          Growth Opportunity
        </p>

        <p className="text-sm text-blue-700 mt-2">
          Short-form video campaigns are generating
          28% more reach this month.
        </p>

      </div>


      <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">

        <p className="font-bold text-orange-800">
          Action Required
        </p>

        <p className="text-sm text-orange-700 mt-2">
          Food Promotion is below its expected
          engagement target.
        </p>

      </div>

    </div>

  </div>

</div>

      {/* CAMPAIGN PERFORMANCE CHART */}

      <div className="ad-card p-6">

        <h2 className="text-2xl font-bold">
          Campaign Reach & Engagement
        </h2>

        <p className="text-base text-slate-500 mb-5">
          Monthly campaign performance trend
        </p>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart data={campaignData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />
<Tooltip content={<CustomTooltip />} />

            <Legend/>

            <Line
              type="monotone"
              dataKey="reach"
              name="Reach (Millions)"
              stroke="#2563EB"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="engagement"
              name="Engagement %"
              stroke="#9333EA"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* CAMPAIGN TABLE */}

      <div className="ad-card p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

          <div>

            <h2 className="text-2xl font-bold">
              Campaign Performance
            </h2>

            <p className="text-base text-slate-500">
              Monitor brand campaigns and creator assignments
            </p>

          </div>

          <button
            type="button"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
          >
            + Create Campaign
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-base">

            <thead>

              <tr className="border-b bg-slate-50">

                <th className="text-left p-4">
                  Brand
                </th>

                <th className="text-left p-4">
                  Campaign
                </th>

                <th className="text-left p-4">
                  Creators
                </th>

                <th className="text-left p-4">
                  Budget
                </th>

                <th className="text-left p-4">
                  Reach
                </th>

                <th className="text-left p-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {campaigns.map((campaign, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4 font-semibold">

                    {campaign.brand}

                  </td>

                  <td className="p-4">

                    {campaign.campaign}

                  </td>

                  <td className="p-4">

                    {campaign.creators}

                  </td>

                  <td className="p-4 font-semibold">

                    {campaign.budget}

                  </td>

                  <td className="p-4">

                    {campaign.reach}

                  </td>

                  <td className="p-4">

                    <span
                      className={
                        campaign.status === "Active"
                          ? "px-3 py-1 rounded-full bg-green-100 text-green-700"
                          : campaign.status === "Scheduled"
                          ? "px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                          : "px-3 py-1 rounded-full bg-slate-200 text-slate-700"
                      }
                    >

                      {campaign.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* CAMPAIGN INSIGHTS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="ad-card p-6">

          <h2 className="text-xl font-bold">
            🏆 Best Campaign
          </h2>

          <p className="text-2xl font-bold mt-4">
            Summer Glow 2026
          </p>

          <p className="text-slate-500 mt-2">
            Generated 2.1M reach with 9.2% engagement.
          </p>

        </div>


        <div className="ad-card p-6">

          <h2 className="text-xl font-bold">
            💡 AI Recommendation
          </h2>

          <p className="text-slate-500 mt-4">
            Assign technology creators to the TechNova campaign.
            Their audience engagement is growing rapidly.
          </p>

        </div>


        <div className="ad-card p-6">

          <h2 className="text-xl font-bold">
            ⚠️ Attention Required
          </h2>

          <p className="text-slate-500 mt-4">
            Two campaigns have used more than 85% of their
            allocated budget.
          </p>

        </div>

      </div>

    </div>
    {/* CAMPAIGN MANAGEMENT TABLE */}

<div className="ad-card p-6">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

    <div>

      <h2 className="text-2xl font-bold">
        Campaign Management
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Monitor campaign budget, creator performance,
        reach, ROI and campaign progress.
      </p>

    </div>

    <button
      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
    >
      + Create Campaign
    </button>

  </div>


  <div className="overflow-x-auto">

    <table className="w-full min-w-[1150px] text-sm">

      <thead>

        <tr className="bg-slate-50 border-y">

          <th className="text-left p-4 font-bold">
            Campaign
          </th>

          <th className="text-left p-4 font-bold">
            Brand
          </th>

          <th className="text-left p-4 font-bold">
            Creator
          </th>

          <th className="text-left p-4 font-bold">
            Budget
          </th>

          <th className="text-left p-4 font-bold">
            Reach
          </th>

          <th className="text-left p-4 font-bold">
            Engagement
          </th>

          <th className="text-left p-4 font-bold">
            ROI
          </th>

          <th className="text-left p-4 font-bold">
            Progress
          </th>

          <th className="text-left p-4 font-bold">
            Status
          </th>

        </tr>

      </thead>


      <tbody>

        {campaignTableData.map(
          (campaign, index) => (

            <tr
              key={index}
              className="border-b hover:bg-slate-50"
            >

              <td className="p-4">

                <p className="font-bold">
                  {campaign.name}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Spent: {campaign.spent}
                </p>

              </td>


              <td className="p-4">

                {campaign.brand}

              </td>


              <td className="p-4">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                    {campaign.creator[0]}

                  </div>

                  <span className="font-semibold">

                    {campaign.creator}

                  </span>

                </div>

              </td>


              <td className="p-4 font-semibold">

                {campaign.budget}

              </td>


              <td className="p-4 font-semibold">

                {campaign.reach}

              </td>


              <td className="p-4 text-green-600 font-bold">

                {campaign.engagement}

              </td>


              <td className="p-4 text-purple-600 font-bold">

                {campaign.roi}

              </td>


              <td className="p-4 min-w-[150px]">

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">

                    {campaign.progress}%

                  </span>

                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full">

                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${campaign.progress}%`,
                    }}
                  />

                </div>

              </td>


              <td className="p-4">

                <span
                  className={
                    campaign.status === "Completed"
                      ? "px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold"
                      : campaign.status === "Active"
                      ? "px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold"
                      : "px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold"
                  }
                >

                  {campaign.status}

                </span>

              </td>

            </tr>

          )
        )}

      </tbody>

    </table>

  </div>

</div>
{/* BUDGET UTILIZATION */}

<div className="ad-card p-6">

  <div className="mb-6">

    <h2 className="text-2xl font-bold">
      Budget Utilization
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Track allocated, used and remaining campaign budgets.
    </p>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {budgetData.map((budget, index) => (

      <div
        key={index}
        className="border border-slate-200 rounded-2xl p-5"
      >

        <p className="text-sm text-slate-500">

          {budget.title}

        </p>

        <h3 className="text-3xl font-bold mt-2">

          {budget.value}

        </h3>

        <p className="text-sm text-slate-500 mt-2">

          {budget.subtitle}

        </p>

        <div className="w-full h-2.5 bg-slate-200 rounded-full mt-5">

          <div
            className={`h-2.5 rounded-full ${budget.color}`}
            style={{
              width: `${budget.percentage}%`,
            }}
          />

        </div>

      </div>

    ))}

  </div>

</div>


{/* ALERTS + UPCOMING CAMPAIGNS */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


  {/* CAMPAIGN ALERTS */}

  <div className="ad-card p-6">

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-2xl font-bold">
          Campaign Alerts
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Important actions requiring attention.
        </p>

      </div>

      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">

        {campaignAlerts.length} Alerts

      </span>

    </div>


    <div className="space-y-4">

      {campaignAlerts.map((alert, index) => (

        <div
          key={index}
          className={
            alert.type === "warning"
              ? "border border-orange-200 bg-orange-50 rounded-xl p-4"
              : alert.type === "danger"
              ? "border border-red-200 bg-red-50 rounded-xl p-4"
              : "border border-blue-200 bg-blue-50 rounded-xl p-4"
          }
        >

          <p className="font-bold">

            {alert.title}

          </p>

          <p className="text-sm text-slate-600 mt-2">

            {alert.message}

          </p>

        </div>

      ))}

    </div>

  </div>


  {/* UPCOMING CAMPAIGNS */}

  <div className="ad-card p-6">

    <div className="mb-5">

      <h2 className="text-2xl font-bold">
        Upcoming Campaigns
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Upcoming campaign schedules and workflow status.
      </p>

    </div>


    <div className="space-y-4">

      {upcomingCampaigns.map((campaign, index) => (

        <div
          key={index}
          className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50"
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex flex-col items-center justify-center font-bold">

              <span className="text-xs">

                AUG

              </span>

              <span>

                {campaign.date.split(" ")[1]}

              </span>

            </div>

            <div>

              <p className="font-bold">

                {campaign.name}

              </p>

              <p className="text-sm text-slate-500">

                {campaign.brand}

              </p>

            </div>

          </div>


          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">

            {campaign.status}

          </span>

        </div>

      ))}

    </div>

  </div>

</div>
{/* CREATOR MATCHING + ROI RANKING */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


  {/* AI CREATOR MATCHING */}

  <div className="ad-card p-6">

    <div className="flex items-start justify-between gap-4 mb-6">

      <div>

        <h2 className="text-2xl font-bold">
          🤖 AI Creator Matching
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Recommended creators based on audience,
          category and expected campaign performance.
        </p>

      </div>

      <span className="hidden sm:block px-3 py-2 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
        AI Powered
      </span>

    </div>


    <div className="space-y-4">

      {creatorMatches.map((match, index) => (

        <div
          key={index}
          className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
        >

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">

                {match.creator[0]}

              </div>

              <div>

                <p className="font-bold text-lg">

                  {match.creator}

                </p>

                <p className="text-sm text-slate-500">

                  {match.category}

                </p>

              </div>

            </div>


            <span
              className={
                match.score === "Excellent Match"
                  ? "px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"
                  : "px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"
              }
            >

              {match.score}

            </span>

          </div>


          <div className="grid grid-cols-3 gap-3 mt-5">

            <div className="bg-slate-50 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Audience Match
              </p>

              <p className="font-bold text-green-600 mt-1">

                {match.audienceMatch}%

              </p>

            </div>


            <div className="bg-slate-50 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Expected Reach
              </p>

              <p className="font-bold mt-1">

                {match.expectedReach}

              </p>

            </div>


            <div className="bg-slate-50 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Engagement
              </p>

              <p className="font-bold text-purple-600 mt-1">

                {match.expectedEngagement}

              </p>

            </div>

          </div>


          <div className="mt-4">

            <p className="text-xs text-slate-500 mb-2">

              Recommended for:
              <span className="font-bold text-slate-700 ml-1">

                {match.campaign}

              </span>

            </p>

            <div className="w-full h-2 bg-slate-200 rounded-full">

              <div
                className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                style={{
                  width: `${match.audienceMatch}%`,
                }}
              />

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>


  {/* CAMPAIGN ROI RANKING */}

  <div className="ad-card p-6">

    <div className="mb-6">

      <h2 className="text-2xl font-bold">
        Campaign ROI Ranking
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Top campaigns ranked by revenue and
        return on investment.
      </p>

    </div>


    <div className="space-y-4">

      {roiRanking.map((item, index) => (

        <div
          key={index}
          className="flex items-center gap-4 border border-slate-200 rounded-2xl p-5 hover:bg-slate-50"
        >

          <div
            className={
              item.rank === 1
                ? "w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-xl font-black"
                : item.rank === 2
                ? "w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xl font-black"
                : "w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-black"
            }
          >

            #{item.rank}

          </div>


          <div className="flex-1">

            <p className="font-bold text-lg">

              {item.campaign}

            </p>

            <p className="text-sm text-slate-500 mt-1">

              Revenue: {item.revenue}

            </p>

          </div>


          <div className="text-right">

            <p className="text-xl font-black text-purple-600">

              {item.roi}

            </p>

            <p className="text-sm font-semibold text-green-600">

              {item.growth}

            </p>

          </div>

        </div>

      ))}

    </div>


    <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">

      <p className="font-bold text-lg">

        📈 Campaign Growth Insight

      </p>

      <p className="text-sm mt-2 text-blue-100">

        Fashion campaigns currently generate the
        highest ROI. Increasing investment in
        fashion creators may improve agency revenue.

      </p>

    </div>

  </div>

</div>
  </div>

  );
};
const renderPage = () => {
  // MARKETING TEAM
  if (userRole === "Marketing Team") {
    switch (active) {
      case "overview":
        return <MarketingOverview />;

      case "campaigns":
        return <CampaignAnalytics />;

      case "audience":
  return <AudienceInsights />;
  case "performance":
  return <MarkettingPerformance />;
      case "growth":
        return <GrowthTrendDashboard />;

      case "reports":
  return <MarketingReports />;

      default:
        return <MarketingOverview />;
    }
  }

  // AGENCY
  if (userRole === "Agency") {
    switch (active) {
      case "overview":
        return <AgencyDashboard />;
      case "creators":
        return <AgencyCreatorsDashboard />;

      case "campaigns":
        return <AgencyCampaignsDashboard />;

      case "revenue":
        return <RevenueDashboard />;

      case "reports":
        return <ReportDashboard />;

      default:
        return <AgencyDashboard />;
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
      case "security-audit":
  return <SecurityAudit />;

      case "admin-reports":
  return <AdminReports />;
  case "admin-notifications":
  return <AdminNotifications />;

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
        <Navbar
        title="Analytics Dashboard"
  userRole={userRole}
  globalSearch={globalSearch}
  setGlobalSearch={setGlobalSearch}
  handleGlobalSearch={handleGlobalSearch}
/>
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
