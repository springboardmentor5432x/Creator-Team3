import {
  getSocialDashboard as fetchSocialDashboard,
  getSocialAnalytics as fetchSocialAnalytics,
  getSocialPosts as fetchSocialPosts,
  getSocialTrends as fetchSocialTrends,
} from '../lib/api';

const normalizePlatform = (platform) => (platform || 'instagram').toLowerCase();

export async function loadSocialDashboard(platform = 'instagram') {
  return fetchSocialDashboard(normalizePlatform(platform));
}

export async function loadSocialAnalytics(platform = 'instagram') {
  return fetchSocialAnalytics(normalizePlatform(platform));
}

export async function loadSocialPosts(platform = 'instagram') {
  return fetchSocialPosts(normalizePlatform(platform));
}

export async function loadSocialTrends(platform = 'instagram') {
  return fetchSocialTrends(normalizePlatform(platform));
}
