import { LanguageCode } from '../i18n/translations';
import { NewspaperArticle } from '../types/newspaper';

const BOOKMARKS_KEY = 'dailynews_bookmarks_v1';
const OFFLINE_EDITIONS_KEY = 'dailynews_offline_editions_v1';
const LAST_PAGE_KEY = 'dailynews_last_page_v1';
const LANGUAGE_KEY = 'dailynews_language_v1';

export function getSavedLanguage(): LanguageCode {
  try {
    const raw = localStorage.getItem(LANGUAGE_KEY);
    if (raw === 'en' || raw === 'hi' || raw === 'ta' || raw === 'te') {
      return raw;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguagePreference(lang: LanguageCode): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}

export interface OfflineEditionRecord {
  editionId: string;
  downloadedAt: string;
  sizeLabel: string;
}

export function getBookmarkedArticles(): NewspaperArticle[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleArticleBookmark(article: NewspaperArticle): NewspaperArticle[] {
  const existing = getBookmarkedArticles();
  const exists = existing.some((item) => item.id === article.id);
  const next = exists
    ? existing.filter((item) => item.id !== article.id)
    : [article, ...existing];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors gracefully
  }
  return next;
}

export function removeArticleBookmark(articleId: string): NewspaperArticle[] {
  const next = getBookmarkedArticles().filter((item) => item.id !== articleId);
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors gracefully
  }
  return next;
}

export function getOfflineEditions(): Record<string, OfflineEditionRecord> {
  try {
    const raw = localStorage.getItem(OFFLINE_EDITIONS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, OfflineEditionRecord>;
  } catch {
    return {};
  }
}

export function markEditionOffline(
  editionId: string,
  sizeLabel: string,
): Record<string, OfflineEditionRecord> {
  const current = getOfflineEditions();
  const updated: Record<string, OfflineEditionRecord> = {
    ...current,
    [editionId]: {
      editionId,
      downloadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      sizeLabel,
    },
  };
  try {
    localStorage.setItem(OFFLINE_EDITIONS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
}

export function removeOfflineEdition(editionId: string): Record<string, OfflineEditionRecord> {
  const current = { ...getOfflineEditions() };
  delete current[editionId];
  try {
    localStorage.setItem(OFFLINE_EDITIONS_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage errors
  }
  return current;
}

export function saveLastReadPage(editionId: string, pageNumber: number): void {
  try {
    const raw = localStorage.getItem(LAST_PAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[editionId] = pageNumber;
    localStorage.setItem(LAST_PAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage errors
  }
}

export function getLastReadPage(editionId: string): number {
  try {
    const raw = localStorage.getItem(LAST_PAGE_KEY);
    if (!raw) return 1;
    const map = JSON.parse(raw) as Record<string, number>;
    return map[editionId] || 1;
  } catch {
    return 1;
  }
}
