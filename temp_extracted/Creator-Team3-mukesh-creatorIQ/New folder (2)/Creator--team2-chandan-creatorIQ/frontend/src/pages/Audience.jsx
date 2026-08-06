import { useEffect, useMemo, useState } from 'react';
import { Eye, ThumbsUp, Users, Target, TrendingUp, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FilterDrawer from '../components/FilterDrawer';
import { getAccessToken, getAudienceAnalytics, getAudienceDemographics, getAudienceGrowth, listContents } from '../lib/api';

export default function Audience() {
  const [prefs, setPrefs] = useState({
    showInsights: true,
    country: 'All',
    period: '30d',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [demographics, setDemographics] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      try {
        const token = getAccessToken();
        if (!token) throw new Error('Please login to view Audience.');

        const [analyticsResult, demographicsResult, growthResult, contentsResult] = await Promise.allSettled([
          getAudienceAnalytics(),
          getAudienceDemographics(),
          getAudienceGrowth(),
          listContents({ period: prefs.period }),
        ]);

        if (!cancelled) {
          setAnalytics(analyticsResult.status === 'fulfilled' ? analyticsResult.value : null);
          setDemographics(demographicsResult.status === 'fulfilled' && Array.isArray(demographicsResult.value) ? demographicsResult.value : []);
          setGrowth(growthResult.status === 'fulfilled' && Array.isArray(growthResult.value) ? growthResult.value : []);
          setContents(contentsResult.status === 'fulfilled' && Array.isArray(contentsResult.value) ? contentsResult.value : []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load audience');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [prefs.period, prefs.country]);

  const filteredDemographics = useMemo(() => {
    if (!Array.isArray(demographics)) return [];
    if (prefs.country === 'All') return demographics;
    return demographics.filter((item) => item.country === prefs.country);
  }, [demographics, prefs.country]);

  const visibleAudienceSummary = useMemo(() => {
    const summary = analytics?.summary || {};
    const filtered = filteredDemographics;
    const totalFollowers = filtered.length
      ? filtered.reduce((sum, item) => sum + Number(item.followers || 0), 0)
      : Number(summary.total_followers || 0);
    const avgFollowers = filtered.length
      ? totalFollowers / filtered.length
      : Number(summary.average_followers || 0);
    const avgGrowth = filtered.length
      ? filtered.reduce((sum, item) => sum + Number(item.growth_rate || 0), 0) / filtered.length
      : Number(summary.average_growth_rate || 0);
    const topSegment = filtered.length
      ? filtered.reduce((best, current) => (Number(current.followers || 0) > Number(best.followers || 0) ? current : best), filtered[0])
      : analytics?.top_followers_segment || null;

    return {
      totalFollowers,
      avgFollowers,
      avgGrowth,
      topSegment,
    };
  }, [analytics, filteredDemographics]);

  const cards = useMemo(() => {
    const { totalFollowers, avgFollowers, avgGrowth, topSegment } = visibleAudienceSummary;
    const hasData = totalFollowers > 0 || avgFollowers > 0 || avgGrowth > 0 || filteredDemographics.length > 0 || growth.length > 0;

    return [
      {
        title: 'Total Followers',
        value: hasData ? totalFollowers.toLocaleString() : '0',
        icon: Users,
        hint: hasData ? 'Your audience size across the records you have stored.' : 'Add audience data to start tracking growth.'
      },
      {
        title: 'Avg Growth',
        value: hasData ? `${avgGrowth.toFixed(1)}%` : '0.0%',
        icon: TrendingUp,
        hint: hasData ? 'Average audience growth rate across your tracked segments.' : 'No growth rate available yet.'
      },
      {
        title: 'Avg Followers',
        value: hasData ? Math.round(avgFollowers).toLocaleString() : '0',
        icon: Eye,
        hint: hasData ? 'Average follower size per audience segment.' : 'No audience segments available yet.'
      },
      {
        title: 'Top Segment',
        value: topSegment ? `${topSegment.country}` : 'No data',
        icon: Target,
        hint: hasData ? 'The segment with the highest follower count in your report.' : 'A segment will appear here after data is available.'
      },
    ];
  }, [filteredDemographics.length, growth.length, visibleAudienceSummary]);

  const demographicBreakdown = useMemo(() => {
    const grouped = {};

    (filteredDemographics || []).forEach((item) => {
      const key = `${item.country || 'Unknown'} • ${item.age_group || 'Unknown'} • ${item.gender || 'Unknown'}`;
      grouped[key] = (grouped[key] || 0) + Number(item.followers || 0);
    });

    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredDemographics]);

  const contentSignals = useMemo(() => {
    const totalPosts = contents.length;
    const totalViews = contents.reduce((sum, item) => sum + Number(item.views || 0), 0);
    const totalLikes = contents.reduce((sum, item) => sum + Number(item.likes || 0), 0);
    const totalComments = contents.reduce((sum, item) => sum + Number(item.comments || 0), 0);
    const avgViews = totalPosts ? totalViews / totalPosts : 0;
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    return {
      totalPosts,
      totalViews,
      totalLikes,
      totalComments,
      avgViews,
      engagementRate,
    };
  }, [contents]);

  const simpleInsight = useMemo(() => {
    const averageGrowth = visibleAudienceSummary.avgGrowth;
    const hasAudienceData = averageGrowth !== 0 || filteredDemographics.length > 0 || growth.length > 0;
    const hasContentData = contentSignals.totalPosts > 0 || contentSignals.totalViews > 0;

    if (!hasAudienceData && !hasContentData) return 'Add audience records or create content to start building your first report.';
    if (!hasAudienceData && hasContentData) return 'Your content is creating audience signals. The audience view is reflecting recent post performance until audience records are added.';

    if (averageGrowth > 5) {
      return 'Your audience is growing steadily. Your current strategy looks healthy and worth repeating.';
    }
    if (averageGrowth > 0) {
      return 'Your audience is growing, but the pace is moderate. Small improvements could increase results.';
    }
    if (averageGrowth < 0) {
      return 'Your audience is shrinking. Review recent content and test a new topic, format, or posting schedule.';
    }
    return 'Audience growth is flat right now. Try testing new content themes or posting schedules.';
  }, [contentSignals, filteredDemographics.length, growth.length, visibleAudienceSummary.avgGrowth]);

  const growthTrend = useMemo(() => (
    (growth || []).map((item) => ({
      date: item.date || 'Unknown',
      followers: Number(item.followers || 0),
      growthRate: Number(item.growth_rate || 0),
    }))
  ), [growth]);

  function resetFilters() {
    setPrefs({ showInsights: true, country: 'All', period: '30d' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text">Audience</h1>
          <p className="text-muted mt-1">Quick insights for your viewers and growth patterns. Showing {prefs.period === '7d' ? 'the last 7 days' : prefs.period === '90d' ? 'the last 90 days' : 'the last 30 days'}.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="rounded-xl border border-slate-700/50 bg-surface/60 px-4 py-3 text-text font-medium hover:bg-surface transition-colors flex items-center gap-2"
          >
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        values={prefs}
        onChange={(next) => setPrefs(next)}
        onReset={() => {
          resetFilters();
        }}
      />


      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4">
          <div className="text-red-200 text-sm">{error}</div>
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-700/50 bg-surface p-6"
            >
              <div className="h-4 w-24 rounded bg-slate-700/60 animate-pulse" />
              <div className="mt-3 h-10 w-32 rounded bg-slate-700/60 animate-pulse" />
              <div className="mt-4 h-4 w-48 rounded bg-slate-700/60 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className={`rounded-2xl border border-emerald-400/15 bg-surface p-6 hover:border-emerald-400/35 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted">{c.title}</p>
                    <h3 className="text-2xl font-bold text-text mt-2">{c.value}</h3>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  {prefs.showInsights ? c.hint : 'Hidden'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-surface p-6">
          <h3 className="text-xl font-bold text-text">Follower growth over time</h3>
          <p className="text-muted mt-2">See whether your audience is expanding or slowing down across each recorded period.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrend.length ? growthTrend : [{ date: 'No data', followers: 0, growthRate: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis yAxisId="followers" stroke="#94a3b8" tickFormatter={(value) => Number(value).toLocaleString()} />
                <YAxis yAxisId="growth" orientation="right" stroke="#f59e0b" tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value, name) => [name === 'Growth rate' ? `${Number(value).toFixed(1)}%` : Number(value).toLocaleString(), name]} />
                <Line yAxisId="followers" type="monotone" dataKey="followers" stroke="#10b981" strokeWidth={3} dot={false} name="Followers" />
                <Line yAxisId="growth" type="monotone" dataKey="growthRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Growth rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-surface p-6">
          <h3 className="text-xl font-bold text-text">Audience report</h3>
          <p className="text-muted mt-2">
            This gives you a simple view of who your audience is and whether your audience is growing.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
              <p className="text-sm font-semibold text-text">What the numbers mean</p>
              <p className="text-sm text-muted mt-1">
                {simpleInsight}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
              <p className="text-sm font-semibold text-text">Content-driven signals</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Posts</p>
                  <p className="mt-1 text-lg font-semibold text-text">{contentSignals.totalPosts}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Views</p>
                  <p className="mt-1 text-lg font-semibold text-text">{contentSignals.totalViews.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Engagement</p>
                  <p className="mt-1 text-lg font-semibold text-text">{contentSignals.engagementRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
              <p className="text-sm font-semibold text-text">Top audience segments</p>
              <div className="mt-3 space-y-2">
                {demographicBreakdown.length ? demographicBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{item.label}</span>
                    <span className="text-text font-medium">{Number(item.value).toLocaleString()} followers</span>
                  </div>
                )) : <p className="text-sm text-muted">No demographic data available yet.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-surface p-6">
          <h3 className="text-xl font-bold text-text">Quick read</h3>
          <p className="text-muted mt-2">Plain-language takeaways from your report.</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <TrendingUp size={16} />
                <span className="text-sm font-semibold">Growth</span>
              </div>
              <p className="mt-2 text-sm text-muted">{analytics?.summary?.average_growth_rate ? `${Number(analytics.summary.average_growth_rate).toFixed(1)}% average growth` : 'No growth data yet'}</p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={16} />
                <span className="text-sm font-semibold">Best segment</span>
              </div>
              <p className="mt-2 text-sm text-muted">{analytics?.top_followers_segment ? `${analytics.top_followers_segment.country} • ${analytics.top_followers_segment.age_group}` : 'No segment data yet'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

