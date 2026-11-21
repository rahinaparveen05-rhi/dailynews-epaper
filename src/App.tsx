import { useEffect, useMemo, useState } from 'react';
import ArchivesView from './components/ArchivesView';
import BookmarksView from './components/BookmarksView';
import EpaperReaderView from './components/EpaperReaderView';
import HomeEditionView from './components/HomeEditionView';
import LoginView from './components/LoginView';
import MobileBottomBar from './components/MobileBottomBar';
import SearchModal from './components/SearchModal';
import TopNavBar from './components/TopNavBar';
import { buildEditionsForDate, getLocalDateKey } from './data/editions';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  UI_STRINGS,
  localizeEditionMeta,
} from './i18n/translations';
import {
  fetchCurrentReader,
  logoutReaderAccount,
  syncReaderState,
} from './services/authService';
import {
  OfflineEditionRecord,
  getBookmarkedArticles,
  getLastReadPage,
  getOfflineEditions,
  getSavedLanguage,
  markEditionOffline,
  removeArticleBookmark,
  removeOfflineEdition,
  saveLanguagePreference,
  saveLastReadPage,
  toggleArticleBookmark,
} from './services/localStore';
import { downloadEditionPdfFile } from './services/pdfGenerator';
import {
  AppTab,
  NewspaperArticle,
  NewspaperEdition,
  ReaderUser,
} from './types/newspaper';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [language, setLanguage] = useState<LanguageCode>(() => getSavedLanguage());
  const [currentUser, setCurrentUser] = useState<ReaderUser | null>(null);
  const [currentDateKey, setCurrentDateKey] = useState<string>(() => getLocalDateKey());
  const editions = useMemo(() => buildEditionsForDate(new Date()), [currentDateKey]);
  const [selectedEditionId, setSelectedEditionId] = useState<string>(() => editions[0].id);
  const selectedEdition = useMemo(
    () => editions.find((ed) => ed.id === selectedEditionId) || editions[0],
    [editions, selectedEditionId],
  );
  const [currentPage, setCurrentPage] = useState<number>(() =>
    getLastReadPage(editions[0].id),
  );
  const [bookmarks, setBookmarks] = useState<NewspaperArticle[]>(() => getBookmarkedArticles());
  const [offlineMap, setOfflineMap] = useState<Record<string, OfflineEditionRecord>>(() =>
    getOfflineEditions(),
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const todayEdition = editions[0];
  const previousEditions = editions.slice(1);
  const t = UI_STRINGS[language];

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((item) => item.id)),
    [bookmarks],
  );

  // Keep edition dates synced to the current local calendar date
  useEffect(() => {
    const syncDateKey = () => {
      const nextKey = getLocalDateKey();
      setCurrentDateKey((prev) => (prev === nextKey ? prev : nextKey));
    };
    const interval = setInterval(syncDateKey, 60_000);
    window.addEventListener('focus', syncDateKey);
    document.addEventListener('visibilitychange', syncDateKey);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', syncDateKey);
      document.removeEventListener('visibilitychange', syncDateKey);
    };
  }, []);

  // Restore existing signed-in session if token exists
  useEffect(() => {
    fetchCurrentReader().then((user) => {
      if (!user) return;
      setCurrentUser(user);
      if (user.language) {
        setLanguage(user.language);
        saveLanguagePreference(user.language);
      }
      if (Array.isArray(user.bookmarks) && user.bookmarks.length > 0) {
        setBookmarks(user.bookmarks);
      }
    });
  }, []);

  useEffect(() => {
    if (!statusNotice) return;
    const timer = setTimeout(() => setStatusNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [statusNotice]);

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLanguage(nextLang);
    saveLanguagePreference(nextLang);
    if (currentUser) {
      syncReaderState({ language: nextLang, bookmarks });
    }
    const label = SUPPORTED_LANGUAGES.find((l) => l.code === nextLang)?.nativeName || nextLang;
    setStatusNotice(`${UI_STRINGS[nextLang].languageLabel}: ${label}`);
  };

  const handleOpenReader = (edition: NewspaperEdition, pageNumber?: number) => {
    const targetPage = pageNumber ?? getLastReadPage(edition.id);
    const clamped = Math.min(edition.totalPages, Math.max(1, targetPage));
    setSelectedEditionId(edition.id);
    setCurrentPage(clamped);
    saveLastReadPage(edition.id, clamped);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (pageNumber: number) => {
    const clamped = Math.min(selectedEdition.totalPages, Math.max(1, pageNumber));
    setCurrentPage(clamped);
    saveLastReadPage(selectedEdition.id, clamped);
  };

  const handleSelectEditionInReader = (edition: NewspaperEdition) => {
    setSelectedEditionId(edition.id);
    const lastPage = Math.min(edition.totalPages, Math.max(1, getLastReadPage(edition.id)));
    setCurrentPage(lastPage);
  };

  const handleToggleBookmark = (article: NewspaperArticle) => {
    const next = toggleArticleBookmark(article);
    setBookmarks(next);
    if (currentUser) {
      syncReaderState({ language, bookmarks: next });
    }
    const saved = next.some((item) => item.id === article.id);
    setStatusNotice(saved ? t.saved : t.remove);
  };

  const handleRemoveBookmark = (articleId: string) => {
    const next = removeArticleBookmark(articleId);
    setBookmarks(next);
    if (currentUser) {
      syncReaderState({ language, bookmarks: next });
    }
    setStatusNotice(t.remove);
  };

  const handleDownloadPdf = async (edition: NewspaperEdition) => {
    if (downloadingId) return;
    setDownloadingId(edition.id);
    try {
      const { sizeLabel } = await downloadEditionPdfFile(edition);
      const updated = markEditionOffline(edition.id, sizeLabel);
      setOfflineMap(updated);
      const localizedDate = localizeEditionMeta(edition, language).formattedDate;
      setStatusNotice(`${t.savedOffline}: DailyNews ${localizedDate} (${sizeLabel})`);
    } catch {
      setStatusNotice(t.pdfGenerationError);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemoveOffline = (editionId: string) => {
    setOfflineMap(removeOfflineEdition(editionId));
    setStatusNotice(t.offlineCacheCleared);
  };

  const handleJumpFromArticle = (article: NewspaperArticle) => {
    const targetEdition =
      editions.find((ed) => ed.id === article.editionId) || todayEdition;
    handleOpenReader(targetEdition, article.pageNumber);
  };

  const handleAuthSuccess = (user: ReaderUser) => {
    setCurrentUser(user);
    if (user.language) {
      setLanguage(user.language);
      saveLanguagePreference(user.language);
    }
    if (Array.isArray(user.bookmarks) && user.bookmarks.length > 0) {
      setBookmarks(user.bookmarks);
    }
    setStatusNotice(`${t.accountActiveLabel}: ${user.name}`);
  };

  const handleSignOut = () => {
    logoutReaderAccount();
    setCurrentUser(null);
    setStatusNotice(t.signOut);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col">
      <TopNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkCount={bookmarks.length}
        language={language}
        currentUser={currentUser}
      />

      <div className="flex-1">
        {activeTab === 'today' && (
          <HomeEditionView
            todayEdition={todayEdition}
            previousEditions={previousEditions}
            offlineMap={offlineMap}
            downloadingId={downloadingId}
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenReader={handleOpenReader}
            onDownloadPdf={handleDownloadPdf}
            onOpenArchives={() => setActiveTab('archives')}
          />
        )}

        {activeTab === 'reader' && (
          <EpaperReaderView
            editions={editions}
            edition={selectedEdition}
            currentPage={currentPage}
            bookmarkedIds={bookmarkedIds}
            offlineMap={offlineMap}
            downloadingId={downloadingId}
            language={language}
            onLanguageChange={handleLanguageChange}
            onSelectEdition={handleSelectEditionInReader}
            onPageChange={handlePageChange}
            onToggleBookmark={handleToggleBookmark}
            onDownloadPdf={handleDownloadPdf}
          />
        )}

        {activeTab === 'archives' && (
          <ArchivesView
            editions={editions}
            offlineMap={offlineMap}
            downloadingId={downloadingId}
            language={language}
            onOpenReader={handleOpenReader}
            onDownloadPdf={handleDownloadPdf}
            onRemoveOffline={handleRemoveOffline}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            language={language}
            onRemoveBookmark={handleRemoveBookmark}
            onJumpToPage={handleJumpFromArticle}
          />
        )}

        {activeTab === 'login' && (
          <LoginView
            currentUser={currentUser}
            language={language}
            bookmarks={bookmarks}
            onAuthSuccess={handleAuthSuccess}
            onSignOut={handleSignOut}
            onContinueReading={() => handleOpenReader(todayEdition, 1)}
          />
        )}
      </div>

      {activeTab !== 'reader' && (
        <footer className="hidden md:block border-t border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <span>{t.footerTagline}</span>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleOpenReader(todayEdition, 1)}
                className="hover:text-neutral-950 cursor-pointer"
              >
                {t.navToday}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('archives')}
                className="hover:text-neutral-950 cursor-pointer"
              >
                {t.navArchives}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className="hover:text-neutral-950 cursor-pointer"
              >
                {t.navBookmarks}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="hover:text-neutral-950 cursor-pointer"
              >
                {currentUser ? currentUser.name : t.signIn}
              </button>
            </div>
          </div>
        </footer>
      )}

      <MobileBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        currentUser={currentUser}
      />

      <SearchModal
        isOpen={isSearchOpen}
        language={language}
        editions={editions}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleJumpFromArticle}
      />

      {statusNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-neutral-950 text-white text-xs font-medium px-4 py-3 shadow-lg border border-neutral-800"
        >
          {statusNotice}
        </div>
      )}
    </div>
  );
}
