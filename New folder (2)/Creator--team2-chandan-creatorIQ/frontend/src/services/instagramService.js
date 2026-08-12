import {
  getSocialDashboard,
  getSocialAnalytics,
  getSocialPosts,
  getSocialTrends,
} from '../lib/api';

const platform = 'instagram';

export async function loadInstagramDashboard() {
  return getSocialDashboard(platform);
}

export async function loadInstagramAnalytics() {
  return getSocialAnalytics(platform);
}

export async function loadInstagramPosts() {
  return getSocialPosts(platform);
}

export async function loadInstagramTrends() {
  return getSocialTrends(platform);
}
