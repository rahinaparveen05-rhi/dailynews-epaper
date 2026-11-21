import { useState } from 'react';
import { BookOpen, BookmarkX, X } from 'lucide-react';
import {
  LanguageCode,
  SECTION_LABELS,
  UI_STRINGS,
  localizeArticle,
} from '../i18n/translations';
import { NewspaperArticle } from '../types/newspaper';

interface BookmarksViewProps {
  bookmarks: NewspaperArticle[];
  language: LanguageCode;
  onRemoveBookmark: (articleId: string) => void;
  onJumpToPage: (article: NewspaperArticle) => void;
}

export default function BookmarksView({
  bookmarks,
  language,
  onRemoveBookmark,
  onJumpToPage,
}: BookmarksViewProps) {
  const [readingArticle, setReadingArticle] = useState<NewspaperArticle | null>(null);
  const t = UI_STRINGS[language];
  const sectionLabels = SECTION_LABELS[language];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-16">
      <div className="border-b-2 border-neutral-950 pb-5 mb-8">
        <p className="text-xs font-semibold text-red-700">{t.localDeviceStorage}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950 mt-1">
          {t.savedBookmarks}
        </h1>
        <p className="mt-1.5 text-sm text-neutral-600">{t.bookmarksSubtitle}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="border border-neutral-200 p-12 text-center max-w-xl mx-auto">
          <h2 className="font-display text-xl font-bold text-neutral-950">
            {t.noSavedArticles}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            {t.noSavedArticlesHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((rawArticle) => {
            const article = localizeArticle(rawArticle, language);
            return (
              <article
                key={article.id}
                className="border border-neutral-200 p-6 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mb-2">
                    <span className="font-semibold text-red-700">
                      {sectionLabels[article.section]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{article.editionDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      P{String(article.pageNumber).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-neutral-950 leading-snug">
                    {article.headline}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {article.deck}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">{article.byline}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setReadingArticle(rawArticle)}
                      className="text-xs font-semibold text-neutral-950 hover:text-red-700 cursor-pointer py-1"
                    >
                      {t.readFullText}
                    </button>
                    <span className="text-neutral-300" aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      onClick={() => onJumpToPage(rawArticle)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-neutral-950 cursor-pointer py-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.jumpToPage}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${article.headline} from bookmarks`}
                    onClick={() => onRemoveBookmark(article.id)}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-red-700 cursor-pointer py-1"
                  >
                    <BookmarkX className="w-4 h-4" aria-hidden="true" />
                    <span>{t.remove}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {readingArticle && (() => {
        const localized = localizeArticle(readingArticle, language);
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={localized.headline}
            className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex justify-end"
            onClick={() => setReadingArticle(null)}
          >
            <div
              className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
                <div className="text-xs text-neutral-600 flex items-center gap-2">
                  <span className="font-semibold text-red-700">
                    {sectionLabels[localized.section]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{localized.editionDate}</span>
                </div>
                <button
                  type="button"
                  aria-label="Close article reader"
                  onClick={() => setReadingArticle(null)}
                  className="p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
                {localized.headline}
              </h2>
              <p className="mt-3 text-base text-neutral-700">{localized.deck}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {localized.byline} · {localized.location}
              </p>

              <div className="mt-6 space-y-4 text-base text-neutral-900 leading-relaxed max-w-prose">
                {localized.paragraphs.map((para, i) => (
                  <p key={i} className={i === 0 ? 'broadsheet-dropcap' : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
