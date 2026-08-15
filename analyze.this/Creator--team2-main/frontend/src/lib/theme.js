export function getThemePreference() {
  return localStorage.getItem('theme') || 'dark';
}

export function setThemePreference(theme) {
  localStorage.setItem('theme', theme);
}

export function applyThemeToDocument(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
}

