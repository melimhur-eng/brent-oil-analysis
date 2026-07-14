const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const getPrices = ({ start, end, resample } = {}) =>
  fetchJson(`/prices${buildQuery({ start, end, resample })}`);

export const getEvents = ({ start, end, category } = {}) =>
  fetchJson(`/events${buildQuery({ start, end, category })}`);

export const getChangepoints = () => fetchJson('/changepoints');

export const getSummary = ({ start, end } = {}) =>
  fetchJson(`/summary${buildQuery({ start, end })}`);

export const getEventImpact = (eventId, windowDays = 30) =>
  fetchJson(`/events/${eventId}/impact${buildQuery({ window_days: windowDays })}`);
