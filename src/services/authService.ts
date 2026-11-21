import { LanguageCode } from '../i18n/translations';
import { NewspaperArticle, ReaderUser } from '../types/newspaper';

const AUTH_TOKEN_KEY = 'dailynews_auth_token_v1';

export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

interface AuthResponse {
  token: string;
  user: ReaderUser;
}

export async function registerReaderAccount(payload: {
  name: string;
  number: string;
  password: string;
  language: LanguageCode;
  bookmarks: NewspaperArticle[];
}): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Could not create account.');
  }
  setStoredAuthToken(data.token);
  return data as AuthResponse;
}

export async function loginReaderAccount(payload: {
  name: string;
  number: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Invalid login credentials.');
  }
  setStoredAuthToken(data.token);
  return data as AuthResponse;
}

export async function fetchCurrentReader(): Promise<ReaderUser | null> {
  const token = getStoredAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setStoredAuthToken(null);
      return null;
    }
    const data = await res.json();
    return data.user as ReaderUser;
  } catch {
    return null;
  }
}

export async function syncReaderState(payload: {
  language: LanguageCode;
  bookmarks: NewspaperArticle[];
}): Promise<void> {
  const token = getStoredAuthToken();
  if (!token) return;
  try {
    await fetch('/api/user/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Offline fallback stays intact in localStorage
  }
}

export function logoutReaderAccount(): void {
  setStoredAuthToken(null);
}
