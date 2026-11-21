import { User } from 'lucide-react';
import { LanguageCode, UI_STRINGS } from '../i18n/translations';
import { AppTab, ReaderUser } from '../types/newspaper';

interface TopNavBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenSearch: () => void;
  bookmarkCount: number;
  language: LanguageCode;
  currentUser: ReaderUser | null;
}

export default function TopNavBar({
  activeTab,
  onTabChange,
  onOpenSearch,
  bookmarkCount,
  language,
  currentUser,
}: TopNavBarProps) {
  const t = UI_STRINGS[language];
  const navItems: { id: AppTab; label: string }[] = [
    { id: 'today', label: t.navToday },
    { id: 'reader', label: t.navReader },
    { id: 'archives', label: t.navArchives },
    {
      id: 'bookmarks',
      label: bookmarkCount > 0 ? `${t.navBookmarks} (${bookmarkCount})` : t.navBookmarks,
    },
  ];

  const userFirstName = currentUser?.name.split(/\s+/)[0] || t.signIn;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onTabChange('today')}
          className="font-display text-2xl font-bold tracking-tight text-neutral-950 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          DailyNews
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative py-4 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
                  isActive
                    ? 'text-neutral-950 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700"
                  />
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenSearch}
            className="py-4 whitespace-nowrap shrink-0 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            {t.searchButton}
          </button>
        </nav>

        {/* Zone 3: Single primary action (Sign In / Reader Account) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onTabChange('login')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
              activeTab === 'login'
                ? 'bg-red-700 text-white'
                : 'bg-neutral-950 text-white hover:bg-red-700'
            }`}
          >
            <User className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="max-w-[120px] truncate">
              {currentUser ? userFirstName : t.signIn}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
