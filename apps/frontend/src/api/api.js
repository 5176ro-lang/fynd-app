const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || 'Something went wrong');
  }

  return body;
}

// Listings
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const signup = (data) =>
  request('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const getListings = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();
  return request(`/listings${query ? `?${query}` : ''}`);
};
export const getListing = (id) => request(`/listings/${id}`);
export const createListing = (data) =>
  request('/listings', { method: 'POST', body: JSON.stringify(data) });
export const updateListing = (id, data) =>
  request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteListing = (id) =>
  request(`/listings/${id}`, { method: 'DELETE' });
export const getMyAvailableListings = (userId) => request(`/listings/mine/${userId}`);

// Swaps
export const getSwaps = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();
  return request(`/swaps${query ? `?${query}` : ''}`);
};
export const createSwap = (data) =>
  request('/swaps', { method: 'POST', body: JSON.stringify(data) });
export const updateSwap = (id, data) =>
  request(`/swaps/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSwap = (id) =>
  request(`/swaps/${id}`, { method: 'DELETE' });

// Users
export const getUsers = () => request('/users');
export const getUserProfile = (id) => request(`/users/${id}/profile`);
export const updateUser = (id, data) =>
  request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const checkUsername = (username, excludeId) =>
  request(`/users/check-username?username=${encodeURIComponent(username)}${excludeId ? `&exclude_id=${excludeId}` : ''}`);

export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`${API_URL}/uploads`, { method: 'POST', body: formData });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Upload failed');
  return body;
}