const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;
}

function authHeaders() {
  const token = localStorage.getItem('trackstack_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeSong(s) {
  if (!s) return s;
  const id = s.id || s._id;
  return {
    ...s,
    id,
    beatUrl: toAbsoluteUrl(s.beatUrl || null),
    recordingUrl: toAbsoluteUrl(s.recordingUrl || null),
  };
}

export async function listSongs() {
  const res = await fetch(`${API_BASE}/api/songs`, { headers: { ...authHeaders() } });
  const data = await res.json();
  return data.map(normalizeSong);
}

export async function createSong(payload) {
  const res = await fetch(`${API_BASE}/api/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || 'Create song failed');
  }
  const data = await res.json();
  return normalizeSong(data);
}

export async function updateSong(id, payload) {
  const res = await fetch(`${API_BASE}/api/songs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || 'Update song failed');
  }
  const data = await res.json();
  return normalizeSong(data);
}

export async function removeSong(id) {
  const res = await fetch(`${API_BASE}/api/songs/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || 'Delete song failed');
  }
}

export async function uploadBeat(fileOrBlob) {
  const form = new FormData();
  const file = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], 'beat.webm', { type: fileOrBlob.type || 'audio/webm' });
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload/beat`, { method: 'POST', body: form, headers: { ...authHeaders() } });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || 'Beat upload failed');
  }
  const data = await res.json();
  return { url: toAbsoluteUrl(data.url), publicId: data.publicId };
}

export async function uploadRecording(fileOrBlob) {
  const form = new FormData();
  const file = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], 'recording.webm', { type: fileOrBlob.type || 'audio/webm' });
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload/recording`, { method: 'POST', body: form, headers: { ...authHeaders() } });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || 'Recording upload failed');
  }
  const data = await res.json();
  return { url: toAbsoluteUrl(data.url), publicId: data.publicId };
}

// Auth
export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  // persist token
  localStorage.setItem('trackstack_token', data.token);
  localStorage.setItem('trackstack_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('trackstack_token');
  localStorage.removeItem('trackstack_user');
}

export { API_BASE };

