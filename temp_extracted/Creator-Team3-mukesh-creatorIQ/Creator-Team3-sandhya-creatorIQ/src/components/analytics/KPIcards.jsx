import React from 'react';
import { kpiData as defaultKpiData } from '../../data/dummyAnalytics';
import MetricCard from './MetricCard';

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
};

export default function KPICards({ data = defaultKpiData }) {
  const metrics = [];

  if (data.followers) {
    metrics.push({
      key: 'followers',
      label: data.followers.label || 'Followers',
      value: data.followers.value,
      change: data.followers.change,
      status: data.followers.status || 'positive',
      icon: '👥',
      spark: [{v: 100}, {v: 120}, {v: 150}, {v: 140}, {v: 170}, {v: 210}, {v: 240}]
    });
  }

  if (data.views) {
    metrics.push({
      key: 'views',
      label: data.views.label || 'Total Views',
      value: data.views.value,
      change: data.views.change,
      status: data.views.status || 'positive',
      icon: '👁️',
      spark: [{v: 250}, {v: 290}, {v: 270}, {v: 350}, {v: 310}, {v: 410}, {v: 450}]
    });
  }

  if (data.shortsViews) {
    metrics.push({
      key: 'shortsViews',
      label: data.shortsViews.label,
      value: data.shortsViews.value,
      change: data.shortsViews.change,
      status: data.shortsViews.status || 'positive',
      icon: '⚡',
      spark: [{v: 80}, {v: 110}, {v: 95}, {v: 140}, {v: 125}, {v: 160}, {v: 180}]
    });
  }

  if (data.videoViews) {
    metrics.push({
      key: 'videoViews',
      label: data.videoViews.label,
      value: data.videoViews.value,
      change: data.videoViews.change,
      status: data.videoViews.status || 'positive',
      icon: '📺',
      spark: [{v: 170}, {v: 180}, {v: 175}, {v: 210}, {v: 185}, {v: 250}, {v: 270}]
    });
  }

  if (data.reelsViews) {
    metrics.push({
      key: 'reelsViews',
      label: data.reelsViews.label,
      value: data.reelsViews.value,
      change: data.reelsViews.change,
      status: data.reelsViews.status || 'positive',
      icon: '🌀',
      spark: [{v: 60}, {v: 75}, {v: 70}, {v: 110}, {v: 90}, {v: 130}, {v: 150}]
    });
  }

  if (data.postViews) {
    metrics.push({
      key: 'postViews',
      label: data.postViews.label,
      value: data.postViews.value,
      change: data.postViews.change,
      status: data.postViews.status || 'positive',
      icon: '🖼️',
      spark: [{v: 110}, {v: 105}, {v: 110}, {v: 100}, {v: 95}, {v: 120}, {v: 120}]
    });
  }

  if (data.likes) {
    metrics.push({
      key: 'likes',
      label: data.likes.label || 'Total Likes',
      value: data.likes.value,
      change: data.likes.change,
      status: data.likes.status || 'positive',
      icon: '❤️',
      spark: [{v: 90}, {v: 130}, {v: 110}, {v: 160}, {v: 140}, {v: 180}, {v: 200}]
    });
  }

  if (data.comments) {
    metrics.push({
      key: 'comments',
      label: data.comments.label || 'Total Comments',
      value: data.comments.value,
      change: data.comments.change,
      status: data.comments.status || 'positive',
      icon: '💬',
      spark: [{v: 40}, {v: 30}, {v: 45}, {v: 35}, {v: 50}, {v: 42}, {v: 55}]
    });
  }

  if (data.engagementRate) {
    metrics.push({
      key: 'engagementRate',
      label: data.engagementRate.label || 'Engagement Rate',
      value: data.engagementRate.value,
      change: data.engagementRate.change,
      status: data.engagementRate.status || 'positive',
      suffix: '%',
      icon: '📈',
      spark: [{v: 4.2}, {v: 4.5}, {v: 4.1}, {v: 4.8}, {v: 4.6}, {v: 5.1}, {v: 5.6}]
    });
  }

  return (
    <div className="kpi-grid">
      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }
      `}</style>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.label}
          value={metric.key === 'engagementRate' ? `${metric.value}%` : formatNumber(metric.value)}
          change={metric.change}
          changeStatus={metric.status}
          icon={metric.icon}
          sparkData={metric.spark}
        />
      ))}
    </div>
  );
}
