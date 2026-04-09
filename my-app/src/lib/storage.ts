// Safe storage utilities that work with SSR

export const isClient = typeof window !== "undefined";

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem(key: string, value: string): void {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },
  
  removeItem(key: string): void {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (!isClient) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem(key: string, value: string): void {
    if (!isClient) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },
  
  removeItem(key: string): void {
    if (!isClient) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },
};
