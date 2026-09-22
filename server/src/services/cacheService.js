/**
 * Simple in-memory cache with TTL (time-to-live).
 * Good enough for one server process in an internship assignment.
 */
const store = new Map();

function buildKey(parts) {
  return parts.join('|');
}

function getCache(key) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

function setCache(key, value, ttlMs) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

function clearCache() {
  store.clear();
}

export { buildKey, getCache, setCache, clearCache };
