import { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, Download, Trash2 } from 'lucide-react';
import {
  LanguageCode,
  SECTION_LABELS,
  UI_STRINGS,
  localizeArticle,
  localizeEditionMeta,
} from '../i18n/translations';
import { OfflineEditionRecord } from '../services/localStore';
import { NewspaperEdition } from '../types/newspaper';

interface ArchivesViewProps {
  editions: NewspaperEdition[];
  offlineMap: Record<string, OfflineEditionRecord>;
  downloadingId: string | null;
  language: LanguageCode;
  onOpenReader: (edition: NewspaperEdition, pageNumber?: number) => void;
  onDownloadPdf: (edition: NewspaperEdition) => void;
  onRemoveOffline: (editionId: string) => void;
}

export default function ArchivesView({
  editions,
  offlineMap,
  downloadingId,
  language,
  onOpenReader,
  onDownloadPdf,
  onRemoveOffline,
}: ArchivesViewProps) {
  const [dateFilter, setDateFilter] = useState('');
  const t = UI_STRINGS[language];
  const sectionLabels = SECTION_LABELS[language];

  const filteredEditions = dateFilter
    ? editions.filter((ed) => ed.isoDate === dateFilter)
    : editions;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-16">
      <div className="border-b-2 border-neutral-950 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-red-700">{t.editionRepository}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950 mt-1">
            {t.newspaperArchives}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">{t.archivesSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="archive-date-filter" className="sr-only">
            Filter by publication date
          </label>
          <div className="relative flex items-center">
            <Calendar
              className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="archive-date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-neutral-300 bg-white text-neutral-950 focus:outline-none focus:border-neutral-950 min-h-[42px]"
            />
          </div>
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="px-3 py-2 text-xs font-medium border border-neutral-300 hover:border-neutral-950 text-neutral-700 cursor-pointer min-h-[42px]"
            >
              {t.showAll}
            </button>
          )}
        </div>
      </div>

      {filteredEditions.length === 0 ? (
        <div className="border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-600">
            {t.noArchivedEdition} {dateFilter}.
          </p>
          <button
            type="button"
            onClick={() => setDateFilter('')}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-950 text-white cursor-pointer"
          >
            {t.resetDateFilter}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {filteredEditions.map((edition) => {
            const offlineRecord = offlineMap[edition.id];
            const localizedLead = localizeArticle(edition.pages[0].articles[0], language);
            const localizedMeta = localizeEditionMeta(edition, language);
            return (
              <article
                key={edition.id}
                className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="max-w-3xl">
                  <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-semibold text-red-700">
                      {localizedMeta.dayOfWeek}, {localizedMeta.formattedDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{localizedMeta.cityEdition}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {edition.totalPages} {t.pagesLabel}
                    </span>
                    {offlineRecord && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-neutral-950 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                          {t.savedOffline} ({offlineRecord.sizeLabel})
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-bold text-neutral-950">
                    {localizedLead.headline}
                  </h2>

                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
                    {edition.pages.map((p) => (
                      <button
                        key={p.pageNumber}
                        type="button"
                        onClick={() => onOpenReader(edition, p.pageNumber)}
                        className="hover:text-red-700 underline-offset-4 hover:underline cursor-pointer"
                      >
                        P{p.pageNumber}: {sectionLabels[p.section]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenReader(edition, 1)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-red-700 transition-colors cursor-pointer min-h-[42px]"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.openEpaper}</span>
                  </button>

                  <button
                    type="button"
                    disabled={downloadingId === edition.id}
                    onClick={() => onDownloadPdf(edition)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-neutral-300 hover:border-neutral-950 text-neutral-950 transition-colors cursor-pointer min-h-[42px] disabled:opacity-60"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {downloadingId === edition.id
                        ? t.generatingPdf
                        : offlineRecord
                          ? t.downloadAgain
                          : t.downloadPdf}
                    </span>
                  </button>

                  {offlineRecord && (
                    <button
                      type="button"
                      aria-label={`Remove offline cache for ${edition.formattedDate}`}
                      onClick={() => onRemoveOffline(edition.id)}
                      className="p-2.5 border border-neutral-200 hover:border-red-700 text-neutral-500 hover:text-red-700 cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
