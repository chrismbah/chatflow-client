// utils/cookies.ts

/**
 * Gets a cookie value by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null; // Handle server-side rendering
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    console.log("Cookie: " + cookieValue);
    return cookieValue ?? null;
  }
  return null;
};

/**
 * Sets a cookie with the specified name, value and expiration
 * @param name The name of the cookie
 * @param value The value to store in the cookie
 * @param days Number of days until the cookie expires
 * @param options Additional cookie options
 */
export const setCookie = (
  name: string,
  value: string,
  days: number,
  options: {
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
): void => {
  if (typeof document === "undefined") {
    return; // Handle server-side rendering
  }

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}`;

  if (options.path) cookieString += `; path=${options.path}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;
  if (options.secure) cookieString += "; secure";
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

  document.cookie = cookieString;
};

/**
 * Deletes a cookie by setting its expiration to a past date
 * @param name The name of the cookie to delete
 * @param options Additional cookie options
 */
export const deleteCookie = (
  name: string,
  options: {
    path?: string;
    domain?: string;
  } = {}
): void => {
  if (typeof document === "undefined") {
    return; // Handle server-side rendering
  }

  let cookieString = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

  if (options.path) cookieString += `; path=${options.path}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;

  document.cookie = cookieString;
};

/**
 * Checks if a cookie exists
 * @param name The name of the cookie to check
 * @returns True if the cookie exists, false otherwise
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Gets all cookies as an object
 * @returns An object with all cookies
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof document === "undefined") {
    return {}; // Handle server-side rendering
  }

  return document.cookie
    .split(";")
    .reduce((cookies: Record<string, string>, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return cookies;
    }, {});
};
