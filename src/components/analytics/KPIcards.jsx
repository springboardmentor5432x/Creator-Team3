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

  const metricDefs = [
    { key: 'followers', fallbackLabel: 'Followers', spark: [{v:100},{v:120},{v:150},{v:140},{v:170},{v:210},{v:240}] },
    { key: 'views', fallbackLabel: 'Total Views', spark: [{v:250},{v:290},{v:270},{v:350},{v:310},{v:410},{v:450}] },
    { key: 'shortsViews', fallbackLabel: 'Shorts Views', spark: [{v:80},{v:110},{v:95},{v:140},{v:125},{v:160},{v:180}] },
    { key: 'videoViews', fallbackLabel: 'Video Views', spark: [{v:170},{v:180},{v:175},{v:210},{v:185},{v:250},{v:270}] },
    { key: 'reelsViews', fallbackLabel: 'Reels Views', spark: [{v:60},{v:75},{v:70},{v:110},{v:90},{v:130},{v:150}] },
    { key: 'postViews', fallbackLabel: 'Post Views', spark: [{v:110},{v:105},{v:110},{v:100},{v:95},{v:120},{v:120}] },
    { key: 'likes', fallbackLabel: 'Total Likes', spark: [{v:90},{v:130},{v:110},{v:160},{v:140},{v:180},{v:200}] },
    { key: 'comments', fallbackLabel: 'Total Comments', spark: [{v:40},{v:30},{v:45},{v:35},{v:50},{v:42},{v:55}] },
    { key: 'watchTime', fallbackLabel: 'Watch Time', spark: [{v:200},{v:220},{v:210},{v:260},{v:250},{v:300},{v:320}] },
    { key: 'engagementRate', fallbackLabel: 'Engagement Rate', spark: [{v:4.2},{v:4.5},{v:4.1},{v:4.8},{v:4.6},{v:5.1},{v:5.6}], suffix: '%' },
  ];

  for (const def of metricDefs) {
    if (data[def.key]) {
      metrics.push({
        key: def.key,
        label: data[def.key].label || def.fallbackLabel,
        value: data[def.key].value,
        change: data[def.key].change,
        status: data[def.key].status || 'positive',
        spark: def.spark,
        suffix: def.suffix
      });
    }
  }

  return (
    <div className="kpi-grid stagger-children">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.label}
          value={metric.key === 'engagementRate' ? `${metric.value}%` : formatNumber(metric.value)}
          change={metric.change}
          changeStatus={metric.status}
          sparkData={metric.spark}
        />
      ))}
    </div>
  );
}
