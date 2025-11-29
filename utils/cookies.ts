/**
 * Cookie utility functions for storing user preferences
 */

export const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
};

export const getBooleanCookie = (name: string, defaultValue: boolean = false): boolean => {
  const value = getCookie(name);
  if (value === null) return defaultValue;
  return value === 'true';
};

export const setBooleanCookie = (name: string, value: boolean, days: number = 365) => {
  setCookie(name, value.toString(), days);
};
