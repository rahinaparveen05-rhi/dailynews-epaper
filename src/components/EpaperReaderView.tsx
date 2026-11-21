import { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Grid2x2,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
} from 'lucide-react';
import {
  LanguageCode,
  SECTION_LABELS,
  UI_STRINGS,
  localizeArticle,
  localizeEditionMeta,
} from '../i18n/translations';
import { OfflineEditionRecord } from '../services/localStore';
import { generateEditionPdfBytes } from '../services/pdfGenerator';
import { NewspaperArticle, NewspaperEdition } from '../types/newspaper';
import LanguageSwitcher from './LanguageSwitcher';

interface EpaperReaderViewProps {
  editions: NewspaperEdition[];
  edition: NewspaperEdition;
  currentPage: number;
  bookmarkedIds: Set<string>;
  offlineMap: Record<string, OfflineEditionRecord>;
  downloadingId: string | null;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSelectEdition: (edition: NewspaperEdition) => void;
  onPageChange: (pageNumber: number) => void;
  onToggleBookmark: (article: NewspaperArticle) => void;
  onDownloadPdf: (edition: NewspaperEdition) => void;
}

export default function EpaperReaderView({
  editions,
  edition,
  currentPage,
  bookmarkedIds,
  offlineMap,
  downloadingId,
  language,
  onLanguageChange,
  onSelectEdition,
  onPageChange,
  onToggleBookmark,
  onDownloadPdf,
}: EpaperReaderViewProps) {
  const t = UI_STRINGS[language];
  const sectionLabels = SECTION_LABELS[language];

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchDistRef = useRef<number | null>(null);

  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showOverviewGrid, setShowOverviewGrid] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewspaperArticle | null>(null);
  const [viewMode, setViewMode] = useState<'broadsheet' | 'pdf'>('broadsheet');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const pageData =
    edition.pages.find((p) => p.pageNumber === currentPage) || edition.pages[0];
  const localizedArticles = pageData.articles.map((a) => localizeArticle(a, language));
  const localizedMeta = localizeEditionMeta(edition, language);
  const isOffline = Boolean(offlineMap[edition.id]);

  // Reset zoom and pan when changing pages or editions
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [edition.id, currentPage]);

  // Keyboard navigation for Previous / Next page
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeArticle || showOverviewGrid) return;
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        onPageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < edition.totalPages) {
        onPageChange(currentPage + 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentPage, edition.totalPages, activeArticle, showOverviewGrid, onPageChange]);

  // Generate real PDF preview URL when switching to Raw PDF mode
  useEffect(() => {
    let active = true;
    let generatedUrl: string | null = null;

    if (viewMode === 'pdf') {
      setIsGeneratingPdf(true);
      generateEditionPdfBytes(edition)
        .then((bytes) => {
          if (!active) return;
          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          generatedUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(`${generatedUrl}#page=${currentPage}`);
        })
        .finally(() => {
          if (active) setIsGeneratingPdf(false);
        });
    }

    return () => {
      active = false;
      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [viewMode, edition, currentPage]);

  const adjustZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(2.5, Math.max(0.75, Number((prev + delta).toFixed(2))));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.max(-420, Math.min(420, dragStartRef.current.panX + dx)),
      y: Math.max(-420, Math.min(420, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinchDistRef.current !== null) {
        const diff = (dist - pinchDistRef.current) * 0.005;
        adjustZoom(diff);
      }
      pinchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    pinchDistRef.current = null;
  };

  const leadArticle = localizedArticles[0];
  const secondaryArticles = localizedArticles.slice(1);

  return (
    <div className="bg-neutral-100 min-h-[calc(100vh-3.5rem)] flex flex-col pb-16 md:pb-0">
      {/* Reader Operational Toolbar */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Edition Selector, Language & Page Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Select newspaper edition"
              value={edition.id}
              onChange={(e) => {
                const next = editions.find((ed) => ed.id === e.target.value);
                if (next) onSelectEdition(next);
              }}
              className="text-xs sm:text-sm font-medium border border-neutral-300 bg-white px-2.5 py-1.5 text-neutral-950 focus:outline-none focus:border-neutral-950 min-h-[36px]"
            >
              {editions.map((ed) => {
                const edMeta = localizeEditionMeta(ed, language);
                return (
                  <option key={ed.id} value={ed.id}>
                    {edMeta.dayOfWeek}, {edMeta.formattedDate}
                  </option>
                );
              })}
            </select>

            <LanguageSwitcher
              language={language}
              onLanguageChange={onLanguageChange}
              compact
            />

            <div className="flex items-center border border-neutral-300 bg-white">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 text-neutral-800 hover:bg-neutral-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-mono-code tabular-nums text-neutral-950 whitespace-nowrap">
                {t.pageOf(currentPage, edition.totalPages)}
              </span>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= edition.totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 text-neutral-800 hover:bg-neutral-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zoom, Overview Grid, Mode Switch & Offline Download */}
          <div className="flex flex-wrap items-center gap-2">
            {viewMode === 'broadsheet' && (
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => adjustZoom(-0.25)}
                  className="p-2 text-neutral-800 hover:bg-neutral-100 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2.5 text-xs font-mono-code tabular-nums text-neutral-950">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => adjustZoom(0.25)}
                  className="p-2 text-neutral-800 hover:bg-neutral-100 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {zoom !== 1 && (
                  <button
                    type="button"
                    aria-label="Reset zoom"
                    onClick={resetZoom}
                    className="p-2 border-l border-neutral-200 text-neutral-700 hover:bg-neutral-100 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowOverviewGrid(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-300 bg-white hover:border-neutral-950 text-neutral-950 cursor-pointer min-h-[36px] whitespace-nowrap"
            >
              <Grid2x2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.pagesOverview}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode((m) => (m === 'broadsheet' ? 'pdf' : 'broadsheet'))
              }
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border cursor-pointer min-h-[36px] whitespace-nowrap transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-950 border-neutral-300 hover:border-neutral-950'
              }`}
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{viewMode === 'pdf' ? t.broadsheetView : t.pdfDocument}</span>
            </button>

            <button
              type="button"
              disabled={downloadingId === edition.id}
              onClick={() => onDownloadPdf(edition)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-neutral-950 transition-colors cursor-pointer min-h-[36px] whitespace-nowrap disabled:opacity-60"
            >
              {isOffline ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.offlinePdf}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {downloadingId === edition.id ? t.generatingPdf : t.downloadPdf}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Jump Bar inside Reader */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-neutral-100 flex items-center gap-5 overflow-x-auto">
          {edition.pages.map((p) => {
            const isActive = p.pageNumber === currentPage;
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => onPageChange(p.pageNumber)}
                className={`text-xs whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-red-700 text-neutral-950 font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {String(p.pageNumber).padStart(2, '0')} · {sectionLabels[p.section]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full-Page Reading Canvas */}
      <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-start p-3 sm:p-6">
        {viewMode === 'pdf' ? (
          <div className="w-full max-w-5xl h-[75vh] bg-white border border-neutral-300 shadow-sm flex flex-col">
            {isGeneratingPdf || !pdfBlobUrl ? (
              <div className="flex-1 flex items-center justify-center text-sm text-neutral-600">
                {t.generatingPdf}
              </div>
            ) : (
              <iframe
                title={`DailyNews ${edition.formattedDate} PDF`}
                src={pdfBlobUrl}
                className="w-full h-full border-0"
              />
            )}
          </div>
        ) : (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={() => (zoom > 1 ? resetZoom() : adjustZoom(0.6))}
            className={`w-full flex justify-center overflow-auto touch-pan-x touch-pan-y select-none ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            {/* Broadsheet Paper Sheet */}
            <article
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'top center',
              }}
              className="w-full max-w-[920px] bg-white border border-neutral-300 shadow-sm px-5 sm:px-10 py-6 sm:py-8 transition-transform duration-150 ease-out"
            >
              {/* Broadsheet Header */}
              {currentPage === 1 ? (
                <div className="border-b-2 border-neutral-950 pb-3 mb-5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 mb-1">
                    <span>{localizedMeta.volumeLabel}</span>
                    <span>{localizedMeta.cityEdition}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950">
                      DailyNews
                    </h2>
                    <p className="text-xs font-medium text-neutral-800">
                      {localizedMeta.dayOfWeek}, {localizedMeta.formattedDate} · P01
                    </p>
                  </div>
                  <div className="h-0.5 bg-red-700 mt-2" />
                </div>
              ) : (
                <div className="border-b border-neutral-950 pb-2 mb-5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-red-700">
                    DailyNews · {sectionLabels[pageData.section]}
                  </span>
                  <span className="text-neutral-600 font-mono-code tabular-nums">
                    {localizedMeta.formattedDate} · P{String(currentPage).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Lead Story on Current Broadsheet Page */}
              {leadArticle && (
                <div className="border-b border-neutral-200 pb-6 mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1.5">
                        {sectionLabels[leadArticle.section]} · {leadArticle.location}
                      </p>
                      <h3
                        onClick={() => setActiveArticle(leadArticle)}
                        className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight hover:text-red-700 transition-colors cursor-pointer"
                      >
                        {leadArticle.headline}
                      </h3>
                    </div>
                    <button
                      type="button"
                      aria-label={
                        bookmarkedIds.has(leadArticle.id)
                          ? t.saved
                          : t.bookmark
                      }
                      onClick={() => onToggleBookmark(leadArticle)}
                      className="p-2 border border-neutral-200 hover:border-neutral-950 cursor-pointer shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedIds.has(leadArticle.id)
                            ? 'fill-red-700 text-red-700'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="mt-2.5 text-sm sm:text-base font-medium text-neutral-700">
                    {leadArticle.deck}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {leadArticle.byline} · {leadArticle.readMinutes} {t.minRead}
                  </p>

                  {leadArticle.imageUrl && (
                    <figure className="my-4">
                      <div className="aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
                        <img
                          src={leadArticle.imageUrl}
                          alt={leadArticle.headline}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {leadArticle.imageCaption && (
                        <figcaption className="mt-1.5 text-xs text-neutral-500 italic">
                          {leadArticle.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {/* Multi-column broadsheet prose */}
                  <div className="mt-4 columns-1 sm:columns-2 gap-6 text-sm text-neutral-900 leading-relaxed space-y-3">
                    {leadArticle.paragraphs.map((para, idx) => (
                      <p
                        key={idx}
                        className={idx === 0 ? 'broadsheet-dropcap' : undefined}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(leadArticle)}
                    className="mt-4 text-xs font-semibold text-red-700 hover:text-neutral-950 cursor-pointer"
                  >
                    {t.openCleanArticle}
                  </button>
                </div>
              )}

              {/* Secondary Stories Grid on the Broadsheet Page */}
              {secondaryArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
                  {secondaryArticles.map((article, idx) => (
                    <div
                      key={article.id}
                      className={idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-red-700 mb-1">
                            {article.location}
                          </p>
                          <h4
                            onClick={() => setActiveArticle(article)}
                            className="font-display text-lg font-bold text-neutral-950 leading-snug hover:text-red-700 transition-colors cursor-pointer"
                          >
                            {article.headline}
                          </h4>
                        </div>
                        <button
                          type="button"
                          aria-label={
                            bookmarkedIds.has(article.id) ? t.saved : t.bookmark
                          }
                          onClick={() => onToggleBookmark(article)}
                          className="p-2 border border-neutral-200 hover:border-neutral-950 cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              bookmarkedIds.has(article.id)
                                ? 'fill-red-700 text-red-700'
                                : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      </div>

                      {article.imageUrl && (
                        <div className="my-3 aspect-[4/3] bg-neutral-100 border border-neutral-200 overflow-hidden">
                          <img
                            src={article.imageUrl}
                            alt={article.headline}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="mt-2 text-xs text-neutral-500">{article.byline}</p>
                      <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                        {article.paragraphs[0]}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        className="mt-2.5 text-xs font-semibold text-red-700 hover:text-neutral-950 cursor-pointer"
                      >
                        {t.readFullStory}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Broadsheet Footer */}
              <div className="mt-8 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span>{t.digitalBroadsheet}</span>
                <span className="font-mono-code tabular-nums">
                  {currentPage} / {edition.totalPages}
                </span>
              </div>
            </article>
          </div>
        )}
      </div>

      {/* Bottom Page Thumbnails Strip */}
      <div className="bg-white border-t border-neutral-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">
              {t.pageThumbnails} · {localizedMeta.formattedDate}
            </span>
            <button
              type="button"
              onClick={() => setShowThumbnails((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-950 cursor-pointer"
            >
              {showThumbnails ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.hideStrip}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.showStrip}</span>
                </>
              )}
            </button>
          </div>

          {showThumbnails && (
            <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
              {edition.pages.map((p) => {
                const active = p.pageNumber === currentPage;
                const localizedLead = p.articles[0]
                  ? localizeArticle(p.articles[0], language).headline
                  : p.leadHeadline;
                return (
                  <button
                    key={p.pageNumber}
                    type="button"
                    onClick={() => onPageChange(p.pageNumber)}
                    className={`w-28 shrink-0 text-left p-2.5 border transition-colors cursor-pointer flex flex-col justify-between min-h-[76px] ${
                      active
                        ? 'border-red-700 bg-red-50/50'
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-mono-code font-semibold tabular-nums ${
                          active ? 'text-red-700' : 'text-neutral-950'
                        }`}
                      >
                        P{String(p.pageNumber).padStart(2, '0')}
                      </span>
                      <span className="text-neutral-500 truncate max-w-[66px]">
                        {sectionLabels[p.section]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] font-medium text-neutral-800 line-clamp-2 leading-tight">
                      {localizedLead}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pages Overview Modal */}
      {showOverviewGrid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.pagesOverview}
          className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowOverviewGrid(false)}
        >
          <div
            className="w-full max-w-4xl bg-white border border-neutral-300 shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200">
              <h3 className="font-display text-xl font-bold text-neutral-950">
                {t.pagesOverview} · {localizedMeta.formattedDate}
              </h3>
              <button
                type="button"
                aria-label="Close pages overview"
                onClick={() => setShowOverviewGrid(false)}
                className="p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              {edition.pages.map((p) => {
                const active = p.pageNumber === currentPage;
                const localizedLead = p.articles[0]
                  ? localizeArticle(p.articles[0], language).headline
                  : p.leadHeadline;
                return (
                  <button
                    key={p.pageNumber}
                    type="button"
                    onClick={() => {
                      onPageChange(p.pageNumber);
                      setShowOverviewGrid(false);
                    }}
                    className={`text-left p-4 border transition-colors cursor-pointer min-h-[120px] flex flex-col justify-between ${
                      active
                        ? 'border-red-700 bg-red-50/40'
                        : 'border-neutral-200 hover:border-neutral-950 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-mono-code font-bold tabular-nums ${
                          active ? 'text-red-700' : 'text-neutral-950'
                        }`}
                      >
                        P{String(p.pageNumber).padStart(2, '0')}
                      </span>
                      <span className="text-red-700 font-medium">
                        {sectionLabels[p.section]}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-sm font-bold text-neutral-950 leading-snug">
                      {localizedLead}
                    </p>
                    <span className="mt-3 text-[11px] text-neutral-500">
                      {p.articles.length}{' '}
                      {p.articles.length === 1 ? t.reportSingular : t.reportPlural}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Clean Article Reading & Bookmark Drawer */}
      {activeArticle && (() => {
        const localizedDrawer = localizeArticle(activeArticle, language);
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={localizedDrawer.headline}
            className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex justify-end"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
                  <div className="text-xs text-neutral-600 flex items-center gap-2">
                    <span className="font-semibold text-red-700">
                      {sectionLabels[localizedDrawer.section]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{localizedDrawer.editionDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>P{String(localizedDrawer.pageNumber).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(activeArticle)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 hover:border-neutral-950 cursor-pointer min-h-[36px]"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          bookmarkedIds.has(activeArticle.id)
                            ? 'fill-red-700 text-red-700'
                            : 'text-neutral-700'
                        }`}
                      />
                      <span>
                        {bookmarkedIds.has(activeArticle.id) ? t.saved : t.bookmark}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Close article view"
                      onClick={() => setActiveArticle(null)}
                      className="p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
                  {localizedDrawer.headline}
                </h2>
                <p className="mt-3 text-base text-neutral-700 leading-relaxed">
                  {localizedDrawer.deck}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  {localizedDrawer.byline} · {localizedDrawer.location} ·{' '}
                  {localizedDrawer.readMinutes} {t.minRead}
                </p>

                {localizedDrawer.imageUrl && (
                  <figure className="my-5">
                    <div className="aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <img
                        src={localizedDrawer.imageUrl}
                        alt={localizedDrawer.headline}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {localizedDrawer.imageCaption && (
                      <figcaption className="mt-1.5 text-xs text-neutral-500 italic">
                        {localizedDrawer.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}

                <div className="mt-5 space-y-4 text-base text-neutral-900 leading-relaxed max-w-prose">
                  {localizedDrawer.paragraphs.map((para, index) => (
                    <p key={index} className={index === 0 ? 'broadsheet-dropcap' : undefined}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
