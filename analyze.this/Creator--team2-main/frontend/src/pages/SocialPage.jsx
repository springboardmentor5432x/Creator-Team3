import { useEffect, useMemo, useState } from 'react';
import {
  loadSocialDashboard,
  loadSocialAnalytics,
  loadSocialPosts,
  loadSocialTrends,
} from '../services/socialService';
import ChartWidget from '../components/ChartWidget';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Eye, Heart, ListChecks, TrendingUp } from 'lucide-react';

function formatCompactNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function formatPct(num) {
  const n = Number(num) || 0;
  return `${n.toFixed(2)}%`;
}

function buildChartData(posts = []) {
  return (posts || [])
    .slice()
    .sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0)))
    .slice(0, 7)
    .map((post) => ({
      name: post.caption ? post.caption.slice(0, 18) : post.media_id,
      views: Number(post.reach || post.impressions || 0),
      engagement: Number(post.engagement_rate || 0),
    }));
}

export default function SocialPage({ platform, title, subtitle }) {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const connectYouTube = async () => {
  const res = await fetch("http://localhost:8000/auth/youtube/login");
  const data = await res.json();
  window.location.href = data.login_url;
};

const connectFacebook = async () => {
  const res = await fetch("http://localhost:8000/auth/facebook/login");
  const data = await res.json();
  window.location.href = data.login_url;
};

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const [dashboardData, analyticsData, postsData, trendsData] = await Promise.all([
          loadSocialDashboard(platform),
          loadSocialAnalytics(platform),
          loadSocialPosts(platform),
          loadSocialTrends(platform),
        ]);

        if (!cancelled) {
          setDashboard(dashboardData);
          setAnalytics(analyticsData);
          setPosts(Array.isArray(postsData) ? postsData : []);
          setTrends(trendsData);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load social data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [platform]);

  const chartData = useMemo(() => buildChartData(posts), [posts]);
  const mediaTypes = useMemo(() => {
    const counts = {};
    for (const post of posts || []) {
      const type = post.media_type || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      color: ['#3b82f6', '#ec4899', '#10b981', '#f97316', '#8b5cf6'][index % 5],
    }));
  }, [posts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">{title}</h1>
          <div className="flex gap-3 mb-6">
  <button
    onClick={connectYouTube}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Connect YouTube
  </button>

  <button
    onClick={connectFacebook}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Connect Facebook
  </button>
</div>
          <p className="text-muted">{subtitle}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4 text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Followers', value: formatCompactNumber(dashboard?.followers), icon: Eye, tone: 'bg-blue-500/10', iconClass: 'text-blue-500' },
          { title: 'Following', value: formatCompactNumber(dashboard?.following), icon: ListChecks, tone: 'bg-emerald-500/10', iconClass: 'text-emerald-500' },
          { title: 'Total Posts', value: formatCompactNumber(dashboard?.total_posts), icon: TrendingUp, tone: 'bg-purple-500/10', iconClass: 'text-purple-500' },
          { title: 'Engagement', value: formatPct(analytics?.average_engagement), icon: Heart, tone: 'bg-pink-500/10', iconClass: 'text-pink-500' },
        ].map((stat) => (
          <div key={stat.title} className="bg-surface p-6 rounded-2xl border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-text">{loading ? '—' : stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.tone}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartWidget title={`${title} Post Views`}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData.length ? chartData : [{ name: 'No Data', views: 0, engagement: 0 }]}>
              <defs>
                <linearGradient id="socialViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="url(#socialViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Media Type Share">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={mediaTypes.length ? mediaTypes : [{ name: 'No Data', value: 1, color: '#334155' }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
              >
                {mediaTypes.length
                  ? mediaTypes.map((entry) => <Cell key={entry.name} fill={entry.color} />)
                  : <Cell fill="#334155" />}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Top Posts">
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.media_id} className="rounded-2xl border border-slate-700/50 bg-surface p-4">
                <p className="text-sm text-muted truncate">{post.caption || post.media_id}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-text">
                  <span>{formatCompactNumber(post.like_count)} likes</span>
                  <span>{formatCompactNumber(post.comments_count)} comments</span>
                </div>
              </div>
            ))}
            {!loading && posts.length === 0 ? <p className="text-sm text-muted">No posts synced yet.</p> : null}
          </div>
        </ChartWidget>
      </div>
    </div>
  );
}
