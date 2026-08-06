export function saveAuthUser(user) {
  if (!user) {
    localStorage.removeItem('auth_user');
    return;
  }
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function loadAuthUser() {
  const stored = localStorage.getItem('auth_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
}
