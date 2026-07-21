const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');

export function resolvePhotoUrl(photoUrl) {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http')) return photoUrl;
  if (photoUrl.startsWith('/uploads/')) return `${API_BASE}${photoUrl}`;
  return photoUrl; // /photos/... served locally by the frontend itself
}