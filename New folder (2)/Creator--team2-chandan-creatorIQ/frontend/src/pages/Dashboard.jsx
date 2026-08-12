import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardSummary,
  getSocialAnalytics,
  getSocialDashboard,
  getSocialPosts,
  getSocialTrends,
  listContents,
} from '../lib/api';

import ChartWidget from '../components/ChartWidget';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';

import { Eye, Heart, ListChecks, TrendingUp } from 'lucide-react';

import '../neon-bar.css';


// Dashboard charts use real content totals from backend.
// We derive a simple distribution across platforms and compute engagement from likes/views.
function buildChartDataFromContents(contents) {
  const groups = {};
  for (const c of contents || []) {
    const views = Number(c.views) || 0;
    const likes = Number(c.likes) || 0;
    const engagement = views > 0 ? (likes / views) * 100 : 0;
    const key = c.platform || 'Other';
    if (!groups[key]) groups[key] = { name: key, views: 0, engagement: 0, count: 0 };
    groups[key].views += views;
    groups[key].engagement += engagement;
    groups[key].count += 1;
  }

  const data = Object.values(groups).map((g) => ({
    name: g.name,
    views: g.views,
    // Use average engagement across posts in that platform
    engagement: g.count ? g.engagement / g.count : 0,
  }));

  // Sort by views desc and limit to 7 bars for readability
  data.sort((a, b) => (b.views || 0) - (a.views || 0));
  return data.slice(0, 7);
}


function formatCompactNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${n}`;
}

function formatPct(num) {
  const n = Number(num) || 0;
  return `${n}%`;
}

function buildInstagramChartData(posts = []) {
  return (posts || [])
    .slice()
    .sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0)))
    .slice(0, 7)
    .map((post) => ({
      name: post.caption
        ? post.caption.length > 18
          ? `${post.caption.slice(0, 18)}...`
          : post.caption
        : post.media_id,
      views: Number(post.reach || post.impressions || 0),
      engagement: Number(post.engagement_rate || 0),
      likes: Number(post.like_count || 0),
      comments: Number(post.comments_count || 0),
    }));
}


export default function Dashboard() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState({
    total_posts: 0,
    total_views: 0,
    total_likes: 0,
    engagement_rate: 0,
  });

  const [instagramSummary, setInstagramSummary] = useState(null);
  const [instagramAnalytics, setInstagramAnalytics] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [instagramTrends, setInstagramTrends] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const token = localStorage.getItem('access_token');

  const [contents, setContents] = useState([]);
  const [previousContents, setPreviousContents] = useState([]);
  const [period, setPeriod] = useState('30d');
  const chartData = useMemo(() => buildChartDataFromContents(contents), [contents]);
  const instagramChartData = useMemo(() => buildInstagramChartData(instagramPosts), [instagramPosts]);

  const trendData = useMemo(() => {
    const buckets = {};

    (contents || []).forEach((item) => {
      const date = item.created_at ? item.created_at.split('T')[0] : 'unknown';
      if (!buckets[date]) {
        buckets[date] = { date, views: 0, likes: 0, comments: 0, engagement: 0, posts: 0 };
      }
      buckets[date].views += Number(item.views || 0);
      buckets[date].likes += Number(item.likes || 0);
      buckets[date].comments += Number(item.comments || 0);
      buckets[date].engagement += Number(item.views || 0) > 0
        ? ((Number(item.likes || 0) + Number(item.comments || 0)) / Number(item.views || 0)) * 100
        : 0;
      buckets[date].posts += 1;
    });

    return Object.values(buckets)
      .map((bucket) => ({
        ...bucket,
        engagement: bucket.posts ? bucket.engagement / bucket.posts : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [contents]);

  async function runDashboardLoad() {
    try {
      setLoading(true);
      setError('');

      if (!token) {
        setSummary({
          total_posts: 0,
          total_views: 0,
          total_likes: 0,
          engagement_rate: 0,
        });
        setError('Please sign in to view your analytics dashboard.');
        return;
      }

      const data = await getDashboardSummary(period);

      const previousPeriod = period === '7d' ? 'prev7d' : period === '90d' ? 'prev90d' : 'prev30d';

      const [instagramSummaryData, instagramAnalyticsData, instagramPostsData, instagramTrendsData, contentsData, previousContentsData] = await Promise.all([
        getSocialDashboard('instagram'),
        getSocialAnalytics('instagram'),
        getSocialPosts('instagram'),
        getSocialTrends('instagram'),
        listContents({ period }),
        listContents({ period: previousPeriod }),
      ]);

      setSummary({
        total_posts: data?.total_posts ?? data?.overview?.total_posts ?? 0,
        total_views: data?.total_views ?? data?.overview?.total_views ?? 0,
        total_likes: data?.total_likes ?? data?.overview?.total_likes ?? 0,
        engagement_rate: data?.engagement_rate ?? data?.overview?.average_engagement ?? 0,
      });
      setInstagramSummary(instagramSummaryData);
      setInstagramAnalytics(instagramAnalyticsData);
      setInstagramPosts(Array.isArray(instagramPostsData) ? instagramPostsData : []);
      setInstagramTrends(instagramTrendsData);
      setContents(Array.isArray(contentsData) ? contentsData : []);
      setPreviousContents(Array.isArray(previousContentsData) ? previousContentsData : []);
    } catch (e) {
      setError(e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!cancelled) {
        await runDashboardLoad();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, period, token]);

  useEffect(() => {
    function onResize() {
      setIsSmallScreen(window.innerWidth < 768);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentMetrics = useMemo(() => {
    const contentPostCount = Array.isArray(contents) ? contents.length : 0;
    const contentLikeTotal = (contents || []).reduce((sum, item) => sum + Number(item.likes || 0), 0);
    const contentCommentTotal = (contents || []).reduce((sum, item) => sum + Number(item.comments || 0), 0);
    const contentViewTotal = (contents || []).reduce((sum, item) => sum + Number(item.views || 0), 0);

    return {
      totalPosts: Number(summary.total_posts || contentPostCount || instagramAnalytics?.total_posts || 0),
      totalLikes: Number(summary.total_likes || contentLikeTotal || instagramAnalytics?.total_likes || 0),
      totalComments: Number(contentCommentTotal || instagramAnalytics?.total_comments || 0),
      totalViews: Number(contentViewTotal || summary.total_views || instagramAnalytics?.total_views || 0),
      engagementRate: Number(summary.engagement_rate || instagramAnalytics?.average_engagement || 0),
    };
  }, [summary, contents, instagramAnalytics]);

  const previousMetrics = useMemo(() => {
    const contentPostCount = Array.isArray(previousContents) ? previousContents.length : 0;
    const contentLikeTotal = (previousContents || []).reduce((sum, item) => sum + Number(item.likes || 0), 0);
    const contentCommentTotal = (previousContents || []).reduce((sum, item) => sum + Number(item.comments || 0), 0);
    const contentViewTotal = (previousContents || []).reduce((sum, item) => sum + Number(item.views || 0), 0);

    return {
      totalPosts: Number(contentPostCount || 0),
      totalLikes: Number(contentLikeTotal || 0),
      totalComments: Number(contentCommentTotal || 0),
      totalViews: Number(contentViewTotal || 0),
      engagementRate: 0,
    };
  }, [previousContents]);

  const comparisonMetrics = useMemo(() => {
    const delta = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return [
      { label: 'Posts', current: currentMetrics.totalPosts, previous: previousMetrics.totalPosts, delta: delta(currentMetrics.totalPosts, previousMetrics.totalPosts) },
      { label: 'Views', current: currentMetrics.totalViews, previous: previousMetrics.totalViews, delta: delta(currentMetrics.totalViews, previousMetrics.totalViews) },
      { label: 'Likes', current: currentMetrics.totalLikes, previous: previousMetrics.totalLikes, delta: delta(currentMetrics.totalLikes, previousMetrics.totalLikes) },
      { label: 'Comments', current: currentMetrics.totalComments, previous: previousMetrics.totalComments, delta: delta(currentMetrics.totalComments, previousMetrics.totalComments) },
    ];
  }, [currentMetrics, previousMetrics]);

  const derivedStats = useMemo(() => ({
    totalPosts: currentMetrics.totalPosts,
    totalLikes: currentMetrics.totalLikes,
    totalComments: currentMetrics.totalComments,
    engagementRate: currentMetrics.engagementRate,
  }), [currentMetrics]);

  const platformInsights = useMemo(() => {
    const grouped = {};

    (contents || []).forEach((item) => {
      const platform = (item.platform || 'Other').toString();
      if (!grouped[platform]) {
        grouped[platform] = {
          platform,
          posts: 0,
          views: 0,
          likes: 0,
          engagement: 0,
        };
      }

      grouped[platform].posts += 1;
      grouped[platform].views += Number(item.views || 0);
      grouped[platform].likes += Number(item.likes || 0);
      grouped[platform].engagement += Number(item.engagement_rate || 0);
    });

    return Object.values(grouped)
      .map((entry) => ({
        ...entry,
        averageEngagement: entry.posts ? entry.engagement / entry.posts : 0,
      }))
      .sort((a, b) => b.views - a.views);
  }, [contents]);

  const bestPlatform = useMemo(() => {
    if (!platformInsights.length) return null;
    return platformInsights.reduce((best, current) => {
      const bestScore = (best.averageEngagement || 0) * 10 + (best.views || 0) / 1000;
      const currentScore = (current.averageEngagement || 0) * 10 + (current.views || 0) / 1000;
      return currentScore > bestScore ? current : best;
    });
  }, [platformInsights]);

  const needsAttentionPlatform = useMemo(() => {
    if (!platformInsights.length) return null;
    return [...platformInsights].sort((a, b) => a.averageEngagement - b.averageEngagement)[0];
  }, [platformInsights]);

  const stats = [
    {
      title: 'Total Posts',
      value: formatCompactNumber(derivedStats.totalPosts),
      icon: ListChecks,
      tone: 'bg-blue-500/10',
      iconClass: 'text-blue-500',
    },
    {
      title: 'Total Likes',
      value: formatCompactNumber(derivedStats.totalLikes),
      icon: TrendingUp,
      tone: 'bg-emerald-500/10',
      iconClass: 'text-emerald-500',
    },
    {
      title: 'Total Comments',
      value: formatCompactNumber(derivedStats.totalComments),
      icon: Eye,
      tone: 'bg-purple-500/10',
      iconClass: 'text-purple-500',
    },
    {
      title: 'Engagement Rate',
      value: formatPct(derivedStats.engagementRate),
      icon: Heart,
      tone: 'bg-pink-500/10',
      iconClass: 'text-pink-500',
    },
  ];

  const instagramMediaTypes = useMemo(() => {
    const counts = {};
    for (const post of instagramPosts || []) {
      const type = post.media_type || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      color: ['#3b82f6', '#ec4899', '#10b981', '#f97316', '#8b5cf6'][index % 5],
    }));
  }, [instagramPosts]);

  const topInstagramPosts = useMemo(() => {
    return (instagramPosts || [])
      .slice()
      .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      .slice(0, 5);
  }, [instagramPosts]);

  const recentPosts = useMemo(() => {
    const source = instagramPosts.length ? instagramPosts : contents;
    return (source || [])
      .slice()
      .sort((a, b) => {
        const aMetric = Number(a.like_count || a.likes || 0) + Number(a.comments_count || a.comments || 0);
        const bMetric = Number(b.like_count || b.likes || 0) + Number(b.comments_count || b.comments || 0);
        return bMetric - aMetric;
      })
      .slice(0, 5)
      .map((p) => ({
        id: p.media_id || p.id,
        platform: p.media_type || p.platform || 'Instagram',
        views: Number(p.reach || p.views || 0),
        likes: Number(p.like_count || p.likes || 0),
        comments: Number(p.comments_count || p.comments || 0),
        engagement: Number(p.engagement_rate || 0),
      }));
  }, [instagramPosts, contents]);

  const engagementData = useMemo(() => {
    // Build per-post engagement breakdown: likes, comments, shares
    return (instagramPosts || [])
      .slice()
      .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      .slice(0, 7)
      .map((p) => ({
        name: p.caption ? (p.caption.length > 18 ? `${p.caption.slice(0, 18)}...` : p.caption) : (p.media_id || p.id),
        likes: Number(p.like_count || 0),
        comments: Number(p.comments_count || 0),
        shares: Number(p.shares || 0),
      }));
  }, [instagramPosts]);

  const socialPlatformData = useMemo(() => {
    const platformOrder = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'YouTube'];
    const base = platformOrder.map((name) => ({ name, views: 0 }));
    const lookup = Object.fromEntries(base.map((item) => [item.name, item]));

    for (const item of contents || []) {
      const platform = (item.platform || 'Other').toString();
      if (!lookup[platform]) continue;
      lookup[platform].views += Number(item.views || 0);
    }

    return platformOrder.map((name) => lookup[name]);
  }, [contents]);

  const platformColors = {
    Instagram: '#E1306C',
    Facebook: '#1877F2',
    Twitter: '#1DA1F2',
    LinkedIn: '#0A66C2',
    YouTube: '#FF0000',
  };

  const [visiblePlatforms, setVisiblePlatforms] = useState(() => {
    return Object.keys(platformColors).reduce((acc, k) => ({ ...acc, [k]: true }), {});
  });

  function togglePlatform(name) {
    setVisiblePlatforms((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const filteredSocialPlatformData = useMemo(() => {
    return (socialPlatformData || [])
      .filter((p) => visiblePlatforms[p.name])
      .slice()
      .sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [socialPlatformData, visiblePlatforms]);

  return (


    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Dashboard</h1>
          <p className="text-muted">Track your performance and audience growth.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="bg-surface border border-slate-700/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            type="button"
            className="bg-primary/10 hover:bg-primary/15 text-primary border border-primary/30 rounded-xl px-4 py-3 font-medium transition-colors"
          >
            Filters
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4">
          <div className="text-red-200 text-sm">{error}</div>
          {token ? (
            <button
              type="button"
              onClick={() => runDashboardLoad()} 
              className="mt-3 rounded-lg border border-red-400/30 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-400/10"
            >
              Try again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-3 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
            >
              Go to sign in
            </button>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-surface p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-text">
                    {loading ? <div className="h-8 w-24 rounded bg-slate-700/60 animate-pulse" /> : stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.tone}`}>
                  <Icon className={`w-6 h-6 ${stat.iconClass}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-muted text-sm">Updated from Instagram</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text">Compared to the previous period</h3>
            <p className="text-sm text-muted">This shows how the current range performs against the one before it.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {comparisonMetrics.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
              <div className="text-sm text-muted">{item.label}</div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <div className="text-xl font-semibold text-text">{formatCompactNumber(item.current)}</div>
                  <div className="text-xs text-slate-400">Prev {formatCompactNumber(item.previous)}</div>
                </div>
                <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.delta >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {item.delta >= 0 ? '+' : ''}{item.delta.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-slate-700/50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text">Performance highlights</h3>
            <p className="text-sm text-muted">A quick read on where momentum is strongest and where attention may be needed.</p>
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3 text-sm text-muted">
            {bestPlatform ? `${bestPlatform.platform} is leading with ${bestPlatform.averageEngagement.toFixed(1)}% average engagement` : 'No platform data yet'}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="text-sm text-emerald-300">Best performer</div>
            <div className="mt-2 text-xl font-semibold text-text">{bestPlatform ? bestPlatform.platform : 'No data'}</div>
            <div className="mt-1 text-sm text-muted">{bestPlatform ? `${formatCompactNumber(bestPlatform.views)} views • ${formatCompactNumber(bestPlatform.likes)} likes` : 'Add content to see platform highlights'}</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="text-sm text-amber-300">Needs attention</div>
            <div className="mt-2 text-xl font-semibold text-text">{needsAttentionPlatform ? needsAttentionPlatform.platform : 'No data'}</div>
            <div className="mt-1 text-sm text-muted">{needsAttentionPlatform ? `${needsAttentionPlatform.averageEngagement.toFixed(1)}% avg engagement • ${needsAttentionPlatform.posts} posts` : 'All platforms look healthy'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <ChartWidget title="Trend Over Time">
          <ResponsiveContainer width="100%" height={isSmallScreen ? 360 : 300}>
            <AreaChart data={trendData.length ? trendData : [{ date: 'No Data', views: 0, likes: 0, comments: 0, engagement: 0 }]}> 
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
              <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
              <Legend />
              <Area type="monotone" dataKey="views" stroke="#06b6d4" fill="url(#viewsGradient)" name="Views" />
              <Area type="monotone" dataKey="likes" stroke="#10b981" fillOpacity={0} name="Likes" />
              <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} dot={false} name="Engagement %" yAxisId="engagement" />
              <YAxis yAxisId="engagement" orientation="right" stroke="#f59e0b" tickFormatter={(v) => `${v}%`} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Engagement Breakdown">
          <ResponsiveContainer width="100%" height={isSmallScreen ? 360 : 300}>
            <BarChart data={engagementData} layout={isSmallScreen ? 'vertical' : 'horizontal'}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              {isSmallScreen ? (
                <>
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={160} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                </>
              )}
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" stackId="a" fill="#ef4444" />
              <Bar dataKey="comments" stackId="a" fill="#f59e0b" />
              <Bar dataKey="shares" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>

        <div className="mb-2">
          <div role="list" aria-label="Social platform legend" className="flex flex-col items-start gap-2 mb-3 rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 min-w-[37.5px]">
            {Object.entries(platformColors).map(([name, color]) => (
              <button
                key={name}
                role="listitem"
                aria-label={`${name} platform toggle`}
                aria-pressed={!!visiblePlatforms[name]}
                onClick={() => togglePlatform(name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePlatform(name);
                  }
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-all ${visiblePlatforms[name] ? 'bg-slate-800/80 text-text' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'}`}
              >
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <ChartWidget title="Social Platform Views">
          <div className="overflow-hidden">
            <ResponsiveContainer width="100%" height={360} minWidth={200} minHeight={200}>
                {/* Use horizontal layout (categories on X axis) to render vertical bars */}
                <BarChart
                  data={filteredSocialPlatformData}
                  layout={'horizontal'}
                  barSize={40}
                  barCategoryGap="20%"
                  margin={{ top: 16, right: 12, left: 12, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  {/* Categories on X axis */}
                  <XAxis dataKey="name" type="category" stroke="#94a3b8" interval={0} angle={-25} textAnchor="end" />
                  {/* Values on Y axis */}
                  <YAxis type="number" stroke="#94a3b8" tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    {filteredSocialPlatformData.map((entry) => (
                      <Cell key={entry.name} fill={platformColors[entry.name] || '#64748b'} />
                    ))}
                    {/* Place labels on top of bars */}
                    <LabelList dataKey="views" position={'top'} formatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)} />
                  </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWidget>
      </div>

      <div className="bg-surface rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-muted">Recent Posts</h3>
          <div className="text-sm text-muted">Last updated just now</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[180px]">
            <thead>
              <tr className="text-left text-muted text-sm">
                <th className="font-medium py-3">Post ID</th>
                <th className="font-medium py-3">Platform</th>
                <th className="font-medium py-3">Views</th>
                <th className="font-medium py-3">Likes</th>
                <th className="font-medium py-3">Engagement %</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-slate-700/50">
                      <td className="py-4">
                        <div className="h-4 w-12 rounded bg-slate-700/60 animate-pulse" />
                      </td>
                      <td className="py-4">
                        <div className="h-4 w-28 rounded bg-slate-700/60 animate-pulse" />
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
                    </tr>
                  ))
                : recentPosts.map((p) => (
                    <tr key={p.id} className="border-t border-slate-700/50 text-sm">
                      <td className="py-4 text-text">{p.id}</td>
                      <td className="py-4 text-text">{p.platform}</td>
                      <td className="py-4 text-text">{formatCompactNumber(p.views)}</td>
                      <td className="py-4 text-text">{formatCompactNumber(p.likes)}</td>
                      <td className="py-4 text-text">{p.engagement.toFixed(2)}%</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


