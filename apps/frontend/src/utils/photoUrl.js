export function resolvePhotoUrl(photoUrl) {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http')) return photoUrl; // Cloudinary URLs, already complete
  return photoUrl; // /photos/... served locally by the frontend itself
}