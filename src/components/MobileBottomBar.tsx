import { Bookmark, Calendar, Newspaper, BookOpen, User } from 'lucide-react';
import { LanguageCode, UI_STRINGS } from '../i18n/translations';
import { AppTab, ReaderUser } from '../types/newspaper';

interface MobileBottomBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  language: LanguageCode;
  currentUser: ReaderUser | null;
}

export default function MobileBottomBar({
  activeTab,
  onTabChange,
  language,
  currentUser,
}: MobileBottomBarProps) {
  const t = UI_STRINGS[language];
  const items: { id: AppTab; label: string; icon: typeof Newspaper }[] = [
    { id: 'today', label: t.navToday, icon: Newspaper },
    { id: 'reader', label: t.navReader, icon: BookOpen },
    { id: 'archives', label: t.navArchives, icon: Calendar },
    { id: 'bookmarks', label: t.navSavedMobile, icon: Bookmark },
    {
      id: 'login',
      label: currentUser ? currentUser.name.split(/\s+/)[0] : t.signIn,
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200"
    >
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] px-1 transition-colors cursor-pointer ${
                isActive ? 'text-red-700 font-semibold' : 'text-neutral-600'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="text-[11px] mt-0.5 leading-none whitespace-nowrap truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
