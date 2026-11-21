import { BookOpen, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { NEWSPAPER_CATEGORIES } from '../data/editions';
import {
  LanguageCode,
  SECTION_LABELS,
  UI_STRINGS,
  localizeArticle,
  localizeEditionMeta,
} from '../i18n/translations';
import { OfflineEditionRecord } from '../services/localStore';
import { NewspaperCategory, NewspaperEdition } from '../types/newspaper';
import LanguageSwitcher from './LanguageSwitcher';

interface HomeEditionViewProps {
  todayEdition: NewspaperEdition;
  previousEditions: NewspaperEdition[];
  offlineMap: Record<string, OfflineEditionRecord>;
  downloadingId: string | null;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenReader: (edition: NewspaperEdition, pageNumber?: number) => void;
  onDownloadPdf: (edition: NewspaperEdition) => void;
  onOpenArchives: () => void;
}

export default function HomeEditionView({
  todayEdition,
  previousEditions,
  offlineMap,
  downloadingId,
  language,
  onLanguageChange,
  onOpenReader,
  onDownloadPdf,
  onOpenArchives,
}: HomeEditionViewProps) {
  const t = UI_STRINGS[language];
  const sectionLabels = SECTION_LABELS[language];

  const leadPage = todayEdition.pages[0];
  const localizedTodayMeta = localizeEditionMeta(todayEdition, language);
  const leadArticle = localizeArticle(leadPage.articles[0], language);
  const secondaryFrontArticles = leadPage.articles
    .slice(1)
    .map((article) => localizeArticle(article, language));
  const isTodayOffline = Boolean(offlineMap[todayEdition.id]);

  const handleCategoryJump = (category: NewspaperCategory) => {
    const matchedPage = todayEdition.pages.find((p) => p.section === category);
    onOpenReader(todayEdition, matchedPage ? matchedPage.pageNumber : 1);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-14">
      {/* Classic Broadsheet Masthead Strip with Language Selector */}
      <section className="border-b-2 border-neutral-950 pb-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-red-700 tracking-wide">
              {t.todaysMorningEdition}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 mt-1">
              DailyNews
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:items-end lg:flex-col">
            <LanguageSwitcher
              language={language}
              onLanguageChange={onLanguageChange}
            />
            <div className="text-xs sm:text-sm text-neutral-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-neutral-950">
                {localizedTodayMeta.dayOfWeek}, {localizedTodayMeta.formattedDate}
              </span>
              <span aria-hidden="true">·</span>
              <span>{localizedTodayMeta.cityEdition}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {todayEdition.totalPages} {t.pagesLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Quick-Jump Navigation */}
      <section aria-label="Newspaper sections" className="border-b border-neutral-200 mb-8">
        <div className="flex items-center gap-6 overflow-x-auto pb-3">
          {NEWSPAPER_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryJump(category)}
              className="text-sm font-medium text-neutral-600 hover:text-red-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              {sectionLabels[category]}
            </button>
          ))}
        </div>
      </section>

      {/* Today's Lead Broadsheet Spread */}
      <section className="border-b border-neutral-200 pb-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-neutral-600 flex items-center gap-2 mb-3">
                <span className="text-red-700 font-semibold">
                  {sectionLabels[leadArticle.section]}
                </span>
                <span aria-hidden="true">·</span>
                <span>01</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.location}</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-neutral-950 text-balance">
                {leadArticle.headline}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
                {leadArticle.deck}
              </p>

              <p className="mt-4 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                {leadArticle.paragraphs[0]}
              </p>

              <p className="mt-3 text-xs text-neutral-500">
                {leadArticle.byline} · {leadArticle.readMinutes} {t.minRead}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenReader(todayEdition, 1)}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-950 hover:bg-red-700 transition-colors cursor-pointer min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>{t.readFullEpaper}</span>
              </button>

              <button
                type="button"
                disabled={downloadingId === todayEdition.id}
                onClick={() => onDownloadPdf(todayEdition)}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border border-neutral-300 text-neutral-950 hover:border-neutral-950 transition-colors cursor-pointer min-h-[44px] disabled:opacity-60"
              >
                {isTodayOffline ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-red-700" aria-hidden="true" />
                    <span>
                      {t.savedOffline} ({offlineMap[todayEdition.id].sizeLabel})
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {downloadingId === todayEdition.id
                        ? t.generatingPdf
                        : t.downloadPdf}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[260px] lg:min-h-[360px] bg-neutral-100 border border-neutral-200 overflow-hidden">
              {leadArticle.imageUrl ? (
                <img
                  src={leadArticle.imageUrl}
                  alt={leadArticle.headline}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-sm text-neutral-500">
                  {leadArticle.headline}
                </div>
              )}
            </div>
            {leadArticle.imageCaption && (
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                {leadArticle.imageCaption}
              </p>
            )}
          </div>
        </div>

        {/* Secondary Front Page Highlights */}
        {secondaryFrontArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-neutral-200">
            {secondaryFrontArticles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => onOpenReader(todayEdition, article.pageNumber)}
                className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-red-700"
              >
                <div className="text-xs text-neutral-500 flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-red-700">
                    {sectionLabels[article.section]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>P{String(article.pageNumber).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-950 group-hover:text-red-700 transition-colors">
                  {article.headline}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
                  {article.deck}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Section Index Preview of Today's 8 Pages */}
      <section className="border-b border-neutral-200 pb-10 mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-neutral-950">
            {t.insideTodaysPaper}
          </h2>
          <button
            type="button"
            onClick={() => onOpenReader(todayEdition, 1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <span>{t.browseAllPages}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayEdition.pages.map((page) => {
            const localizedLead = page.articles[0]
              ? localizeArticle(page.articles[0], language).headline
              : page.leadHeadline;
            return (
              <button
                key={page.pageNumber}
                type="button"
                onClick={() => onOpenReader(todayEdition, page.pageNumber)}
                className="text-left p-4 border border-neutral-200 hover:border-neutral-950 transition-colors bg-white flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="font-semibold text-red-700">
                      {sectionLabels[page.section]}
                    </span>
                    <span className="font-mono-code tabular-nums">
                      P{String(page.pageNumber).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-neutral-950 leading-snug">
                    {localizedLead}
                  </h3>
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  {page.articles.length}{' '}
                  {page.articles.length === 1 ? t.reportSingular : t.reportPlural}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Previous Editions */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-neutral-950">
            {t.previousEditions}
          </h2>
          <button
            type="button"
            onClick={onOpenArchives}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-red-700 transition-colors cursor-pointer"
          >
            <span>{t.viewFullArchive}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previousEditions.map((edition) => {
            const isOffline = Boolean(offlineMap[edition.id]);
            const localizedLead = localizeArticle(edition.pages[0].articles[0], language);
            const localizedMeta = localizeEditionMeta(edition, language);
            return (
              <article
                key={edition.id}
                className="border border-neutral-200 p-5 flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mb-2">
                    <span className="font-semibold text-neutral-950">
                      {localizedMeta.dayOfWeek}, {localizedMeta.formattedDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {edition.totalPages} {t.pagesLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-950 leading-snug">
                    {localizedLead.headline}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {localizedLead.deck}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenReader(edition, 1)}
                    className="text-sm font-semibold text-neutral-950 hover:text-red-700 transition-colors cursor-pointer py-1"
                  >
                    {t.openEdition}
                  </button>
                  <button
                    type="button"
                    disabled={downloadingId === edition.id}
                    onClick={() => onDownloadPdf(edition)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer py-1"
                  >
                    {isOffline ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                        <span>{t.offlineReady}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{downloadingId === edition.id ? '...' : 'PDF'}</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
