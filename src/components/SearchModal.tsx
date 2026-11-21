import { useMemo, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { NEWSPAPER_CATEGORIES, getAllArticles } from '../data/editions';
import {
  LanguageCode,
  SECTION_LABELS,
  UI_STRINGS,
  localizeArticle,
} from '../i18n/translations';
import { NewspaperArticle, NewspaperCategory, NewspaperEdition } from '../types/newspaper';

interface SearchModalProps {
  isOpen: boolean;
  language: LanguageCode;
  editions?: NewspaperEdition[];
  onClose: () => void;
  onSelectArticle: (article: NewspaperArticle) => void;
}

export default function SearchModal({
  isOpen,
  language,
  editions,
  onClose,
  onSelectArticle,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewspaperCategory>('All');
  const t = UI_STRINGS[language];
  const sectionLabels = SECTION_LABELS[language];

  const allArticles = useMemo(() => getAllArticles(editions), [editions]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allArticles
      .map((raw) => ({
        raw,
        localized: localizeArticle(raw, language),
      }))
      .filter(({ raw, localized }) => {
        const catMatch =
          selectedCategory === 'All' || raw.section === selectedCategory;
        if (!catMatch) return false;
        if (!q) return true;
        return (
          localized.headline.toLowerCase().includes(q) ||
          localized.deck.toLowerCase().includes(q) ||
          localized.byline.toLowerCase().includes(q) ||
          localized.location.toLowerCase().includes(q) ||
          sectionLabels[raw.section].toLowerCase().includes(q) ||
          raw.headline.toLowerCase().includes(q) ||
          raw.section.toLowerCase().includes(q) ||
          localized.paragraphs.some((p) => p.toLowerCase().includes(q))
        );
      });
  }, [allArticles, query, selectedCategory, language, sectionLabels]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.searchButton}
      className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white border border-neutral-300 shadow-2xl max-h-[82vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none py-1.5"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-neutral-200 overflow-x-auto bg-neutral-50">
          {(['All', ...NEWSPAPER_CATEGORIES] as NewspaperCategory[]).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer py-1 transition-colors ${
                  active
                    ? 'text-red-700 font-semibold underline underline-offset-4'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {sectionLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-neutral-200 p-4">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500">
              {t.noMatchingArticles}
            </div>
          ) : (
            results.map(({ raw, localized }) => (
              <button
                key={raw.id}
                type="button"
                onClick={() => {
                  onSelectArticle(raw);
                  onClose();
                }}
                className="w-full text-left py-4 first:pt-1 last:pb-1 group cursor-pointer flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mb-1">
                    <span className="font-semibold text-red-700">
                      {sectionLabels[raw.section]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{localized.editionDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      P{String(raw.pageNumber).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-neutral-950 group-hover:text-red-700 transition-colors">
                    {localized.headline}
                  </h4>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                    {localized.deck}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-neutral-400 group-hover:text-red-700 shrink-0 mt-2"
                  aria-hidden="true"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
