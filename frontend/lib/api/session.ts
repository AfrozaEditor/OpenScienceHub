import type { AuthTokens } from "./types";

const ACCESS_KEY = "osh.access";
const REFRESH_KEY = "osh.refresh";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredTokens(): AuthTokens | null {
  if (!canUseStorage()) return null;
  const access = window.localStorage.getItem(ACCESS_KEY);
  const refresh = window.localStorage.getItem(REFRESH_KEY);
  return access && refresh ? { access, refresh } : null;
}

export function setStoredTokens(tokens: AuthTokens) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCESS_KEY, tokens.access);
  window.localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearStoredTokens() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
