// src/utils/cache.js
class FrontendCache {
  constructor() {
    this.prefix = 'carhub_';
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  get(key) {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(this.prefix + key);
      return null;
    }
    
    return parsed.data;
  }

  invalidate(key) {
    localStorage.removeItem(this.prefix + key);
  }

  invalidatePattern(pattern) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix + pattern)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const frontendCache = new FrontendCache();