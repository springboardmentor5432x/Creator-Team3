import { getAccessToken } from './api';

// Minimal MVP role helper.
// Backend `/profile` is the source of truth; for now we decode role from JWT payload if possible.
// If decoding fails, return null and UI can hide restricted menus.

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getRoleFromToken() {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  // JWT payload uses `sub` only in this codebase; role is not stored in token.
  // Return null so UI can rely on `/profile` in a later refinement.
  return payload?.role ?? null;
}

export function canAccessRole(role, allowedRoles = []) {
  if (!role) return false;
  return allowedRoles.includes(role);
}

