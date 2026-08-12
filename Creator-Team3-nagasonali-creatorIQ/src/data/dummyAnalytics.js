/**
 * Dummy Analytics Data for CreatorIQ Analytics Dashboard
 * Contains mock metrics representing a creator's audience and performance.
 */

// KPI Overall Metrics
export const kpiData = {
  followers: {
    label: 'Total Followers',
    value: 1254300,
    change: 12.4, // percentage change from last period
    status: 'positive'
  },
  views: {
    label: 'Total Views',
    value: 8432000,
    change: 8.2,
    status: 'positive'
  },
  likes: {
    label: 'Total Likes',
    value: 1240000,
    change: 5.1,
    status: 'positive'
  },
  comments: {
    label: 'Total Comments',
    value: 89300,
    change: -2.4,
    status: 'negative'
  },
  shares: {
    label: 'Total Shares',
    value: 45200,
    change: 18.7,
    status: 'positive'
  },
  watchTime: {
    label: 'Total Watch Time',
    value: 345000, // in hours
    change: 15.3,
    status: 'positive'
  },
  engagementRate: {
    label: 'Engagement Rate',
    value: 4.85, // percentage
    change: 0.6,
    status: 'positive'
  }
};

// Monthly views history (Past 12 Months)
export const monthlyViews = [
  { month: 'Jul 2025', views: 580000, likes: 85000, comments: 6200, shares: 3100 },
  { month: 'Aug 2025', views: 610000, likes: 92000, comments: 7200, shares: 3400 },
  { month: 'Sep 2025', views: 590000, likes: 88000, comments: 6900, shares: 3200 },
  { month: 'Oct 2025', views: 640000, likes: 95000, comments: 7500, shares: 3600 },
  { month: 'Nov 2025', views: 680000, likes: 101000, comments: 7800, shares: 3900 },
  { month: 'Dec 2025', views: 790000, likes: 118000, comments: 8400, shares: 4800 },
  { month: 'Jan 2026', views: 720000, likes: 105000, comments: 8100, shares: 4100 },
  { month: 'Feb 2026', views: 750000, likes: 110000, comments: 8300, shares: 4300 },
  { month: 'Mar 2026', views: 810000, likes: 122000, comments: 8900, shares: 4700 },
  { month: 'Apr 2026', views: 880000, likes: 130000, comments: 9400, shares: 5100 },
  { month: 'May 2026', views: 920000, likes: 138000, comments: 9900, shares: 5400 },
  { month: 'Jun 2026', views: 950000, likes: 142000, comments: 10100, shares: 5600 }
];

// Monthly followers count (Past 12 Months)
export const monthlyFollowers = [
  { month: 'Jul 2025', count: 1010000, netGain: 12000 },
  { month: 'Aug 2025', count: 1032000, netGain: 22000 },
  { month: 'Sep 2025', count: 1051000, netGain: 19000 },
  { month: 'Oct 2025', count: 1074000, netGain: 23000 },
  { month: 'Nov 2025', count: 1098000, netGain: 24000 },
  { month: 'Dec 2025', count: 1130000, netGain: 32000 },
  { month: 'Jan 2026', count: 1152000, netGain: 22000 },
  { month: 'Feb 2026', count: 1175000, netGain: 23000 },
  { month: 'Mar 2026', count: 1198000, netGain: 23000 },
  { month: 'Apr 2026', count: 1221000, netGain: 23000 },
  { month: 'May 2026', count: 1240000, netGain: 19000 },
  { month: 'Jun 2026', count: 1254300, netGain: 14300 }
];

// Audience Demographics
export const audienceDemographics = {
  gender: [
    { name: 'Female', value: 58 },
    { name: 'Male', value: 36 },
    { name: 'Non-binary / Other', value: 6 }
  ],
  age: [
    { name: '13-17', value: 8 },
    { name: '18-24', value: 42 },
    { name: '25-34', value: 32 },
    { name: '35-44', value: 12 },
    { name: '45+', value: 6 }
  ],
  locations: [
    { name: 'United States', value: 38 },
    { name: 'United Kingdom', value: 14 },
    { name: 'Canada', value: 9 },
    { name: 'Germany', value: 7 },
    { name: 'Australia', value: 6 },
    { name: 'Others', value: 26 }
  ]
};

// Performance Broken Down by Platform
export const platformPerformance = [
  {
    platform: 'YouTube',
    followers: 520000,
    engagementRate: 5.6,
    posts: 12,
    views: 4200000,
    likes: 580000,
    comments: 48000,
    shares: 12000,
    watchTime: 215000,
    color: '#FF0000'
  },
  {
    platform: 'Instagram',
    followers: 450000,
    engagementRate: 4.2,
    posts: 38,
    views: 1800000,
    likes: 390000,
    comments: 22000,
    shares: 18000,
    watchTime: 45000,
    color: '#E1306C'
  },
  {
    platform: 'LinkedIn',
    followers: 234300,
    engagementRate: 7.8,
    posts: 56,
    views: 2432000,
    likes: 270000,
    comments: 19300,
    shares: 15200,
    watchTime: 85000,
    color: '#0077b5'
  },
  {
    platform: 'Facebook',
    followers: 50000,
    engagementRate: 2.1,
    posts: 15,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    watchTime: 0,
    color: '#1877F2'
  }
];

export const contentGrowthData = [
  { content: "AI Automation Guide", growth: 85 },
  { content: "React 19 Deep Dive", growth: 72 },
  { content: "Fullstack Architecture", growth: 64 },
  { content: "Python FastAPI Setup", growth: 58 },
  { content: "Tailwind vs Vanilla CSS", growth: 46 }
];

export const growthInsightsData = [
  { title: "Peak Posting Time", value: "Tuesdays & Thursdays at 6:00 PM EST" },
  { title: "Highest Converting Content", value: "Technical Tutorials (+34% Reach)" },
  { title: "Audience Retention Spike", value: "First 30 seconds of Shorts/Reels" },
  { title: "Virality Score", value: "8.4 / 10 (High Share Velocity)" }
];

export const historicalPerformanceData = [
  { period: "Q1 2025", views: 1800000, engagement: 4.2 },
  { period: "Q2 2025", views: 2200000, engagement: 4.5 },
  { period: "Q3 2025", views: 2700000, engagement: 4.9 },
  { period: "Q4 2025", views: 3400000, engagement: 5.3 },
  { period: "Q1 2026", views: 4100000, engagement: 5.8 }
];

export const categoryPerformance = [
  { category: "Tutorials", views: 450000, likes: 52000 },
  { category: "Vlogs", views: 280000, likes: 31000 },
  { category: "Reviews", views: 390000, likes: 44000 },
  { category: "Shorts", views: 820000, likes: 98000 },
  { category: "Live Streams", views: 190000, likes: 21000 }
];

