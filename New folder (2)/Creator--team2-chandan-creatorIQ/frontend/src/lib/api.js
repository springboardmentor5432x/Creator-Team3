import axios from 'axios';

const api = axios.create({
  // In development `VITE_API_BASE_URL` is set to `/api` and Vite proxies it to the backend.
  // In production replace with the real backend URL (e.g. https://api.example.com)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export async function registerUser({ name, email, password, role }) {
  const res = await api.post('/register', { name, email, password, role });
  return res.data;
}

export async function loginUser({ email, password }) {
  const res = await api.post('/login', { email, password });
  return res.data;
}

export async function getProfile() {
  const res = await api.get('/profile', { headers: authHeaders() });
  return res.data;
}

export async function getProfileSettings() {
  const res = await api.get('/settings/profile', { headers: authHeaders() });
  return res.data;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAccessToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (!error?.response) {
      error.message = 'The server could not be reached. Check that the app is running and try again.';
    } else if (status >= 500) {
      error.message = 'The server is temporarily unavailable. Please try again in a moment.';
    }

    return Promise.reject(error);
  }
);

export async function updateProfileSettings(payload) {
  const res = await api.put('/settings/profile', payload, { headers: authHeaders() });
  return res.data;
}

export async function updateSecuritySettings(payload) {
  const res = await api.put('/settings/security', payload, { headers: authHeaders() });
  return res.data;
}

export async function updateNotificationSettings(payload) {
  const res = await api.put('/settings/notifications', payload, { headers: authHeaders() });
  return res.data;
}

export async function updateAppearanceSettings(payload) {
  const res = await api.put('/settings/appearance', payload, { headers: authHeaders() });
  return res.data;
}


export function setAccessToken(token) {
  if (!token) return;
  localStorage.setItem('access_token', token);
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function authHeaders() {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createContent({ title, platform, views, likes }) {
  const res = await api.post(
    '/content',
    { title, platform, views, likes },
    { headers: authHeaders() }
  );
  return res.data;
}

export async function listContents(params = {}) {
  const res = await api.get('/content', {
    headers: authHeaders(),
    params,
  });
  return res.data?.data ?? res.data;
}

export async function deleteContent(contentId) {
  const res = await api.delete(`/content/${contentId}`, { headers: authHeaders() });
  return res.data;
}

export async function getAudienceAnalytics() {
  const res = await api.get('/audience/analytics', { headers: authHeaders() });
  return res.data;
}

export async function getAudienceDemographics() {
  const res = await api.get('/audience/demographics', { headers: authHeaders() });
  return res.data;
}

export async function getAudienceGrowth() {
  const res = await api.get('/audience/growth', { headers: authHeaders() });
  return res.data;
}

export async function getInstagramDashboard() {
  const res = await api.get('/dashboard/instagram', { headers: authHeaders() });
  return res.data;
}

export async function getDashboardSummary(period = '30d') {
  const res = await api.get('/dashboard', {
    headers: authHeaders(),
    params: { period },
  });
  return res.data;
}

export async function getInstagramAnalytics() {
  const res = await api.get('/instagram/analytics', { headers: authHeaders() });
  return res.data;
}

export async function getInstagramPosts() {
  const res = await api.get('/instagram/database-posts', { headers: authHeaders() });
  return res.data;
}

export async function getInstagramTrends() {
  const res = await api.get('/instagram/trends', { headers: authHeaders() });
  return res.data;
}

export async function getSocialDashboard(platform = 'instagram') {
  if (platform === 'instagram') return getInstagramDashboard();
  throw new Error(`Unsupported social platform: ${platform}`);
}

export async function getSocialAnalytics(platform = 'instagram') {
  if (platform === 'instagram') return getInstagramAnalytics();
  throw new Error(`Unsupported social platform: ${platform}`);
}

export async function getSocialPosts(platform = 'instagram') {
  if (platform === 'instagram') return getInstagramPosts();
  throw new Error(`Unsupported social platform: ${platform}`);
}

export async function getSocialTrends(platform = 'instagram') {
  if (platform === 'instagram') return getInstagramTrends();
  throw new Error(`Unsupported social platform: ${platform}`);
}

export async function listTeamMembers() {
  const res = await api.get('/team/', { headers: authHeaders() });
  return res.data;
}

export async function createTeamMember(payload) {
  const res = await api.post('/team/', payload, { headers: authHeaders() });
  return res.data;
}

export async function deleteTeamMember(memberId) {
  const res = await api.delete(`/team/${memberId}`, { headers: authHeaders() });
  return res.data;
}

export function clearAccessToken() {
  localStorage.removeItem('access_token');
}



