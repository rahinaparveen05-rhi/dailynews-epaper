import 'dart:io';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import '../main.dart';
import '../models/newspaper_article.dart';
import '../models/newspaper_edition.dart';
import '../services/pdf_service.dart';
import '../services/storage_service.dart';
import '../widgets/page_thumbnail_strip.dart';

class EpaperReaderScreen extends StatefulWidget {
  final NewspaperEdition edition;
  final int initialPage;

  const EpaperReaderScreen({
    super.key,
    required this.edition,
    this.initialPage = 1,
  });

  @override
  State<EpaperReaderScreen> createState() => _EpaperReaderScreenState();
}

class _EpaperReaderScreenState extends State<EpaperReaderScreen> {
  final PdfViewerController _pdfController = PdfViewerController();
  final PdfService _pdfService = PdfService();
  final StorageService _storageService = StorageService();

  int _currentPage = 1;
  int _totalPages = 1;
  double _zoomLevel = 1.0;
  bool _showThumbnails = true;
  bool _isDownloading = false;
  File? _localPdfFile;
  Set<String> _bookmarkedIds = {};

  @override
  void initState() {
    super.initState();
    _currentPage = widget.initialPage;
    _totalPages = widget.edition.totalPages;
    _initReaderState();
  }

  Future<void> _initReaderState() async {
    final file = await _pdfService.getLocalPdfFile(widget.edition.id);
    final bookmarks = await _storageService.getBookmarks();
    if (mounted) {
      setState(() {
        _localPdfFile = file;
        _bookmarkedIds = bookmarks.map((b) => b.id).toSet();
      });
    }
  }

  void _goToPage(int page) {
    final clamped = page.clamp(1, _totalPages);
    _pdfController.jumpToPage(clamped);
    _storageService.saveLastReadPage(widget.edition.id, clamped);
    setState(() => _currentPage = clamped);
  }

  void _adjustZoom(double delta) {
    final nextZoom = (_zoomLevel + delta).clamp(1.0, 3.0);
    _pdfController.zoomLevel = nextZoom;
    setState(() => _zoomLevel = nextZoom);
  }

  Future<void> _downloadForOffline() async {
    if (_isDownloading) return;
    setState(() => _isDownloading = true);
    try {
      final savedFile = await _pdfService.downloadEditionPdf(
        edition: widget.edition,
        onProgress: (_) {},
      );
      if (mounted) {
        setState(() => _localPdfFile = savedFile);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('PDF saved for offline reading')),
        );
      }
    } finally {
      if (mounted) setState(() => _isDownloading = false);
    }
  }

  Future<void> _toggleBookmark(NewspaperArticle article) async {
    final isSaved = await _storageService.toggleBookmark(article);
    setState(() {
      if (isSaved) {
        _bookmarkedIds.add(article.id);
      } else {
        _bookmarkedIds.remove(article.id);
      }
    });
  }

  void _showPageOverviewGrid() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      builder: (context) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.65,
          builder: (_, scrollController) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Pages Overview',
                    style: TextStyle(
                      fontFamily: 'Georgia',
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: GridView.builder(
                      controller: scrollController,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 0.78,
                      ),
                      itemCount: widget.edition.totalPages,
                      itemBuilder: (context, index) {
                        final pageNum = index + 1;
                        final pageMeta = widget.edition.pages
                            .where((p) => p.pageNumber == pageNum)
                            .firstOrNull;
                        final isActive = pageNum == _currentPage;
                        return InkWell(
                          onTap: () {
                            Navigator.pop(context);
                            _goToPage(pageNum);
                          },
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: isActive ? const Color(0xFFFEF2F2) : Colors.white,
                              border: Border.all(
                                color: isActive
                                    ? DailyNewsApp.primaryRed
                                    : DailyNewsApp.hairlineBorder,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Page $pageNum',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    color: isActive
                                        ? DailyNewsApp.primaryRed
                                        : DailyNewsApp.inkBlack,
                                  ),
                                ),
                                Text(
                                  pageMeta?.sectionName ?? 'Edition Page',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: DailyNewsApp.mutedGray,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showPageArticlesSheet() {
    final pageArticles = widget.edition.articles
        .where((a) => a.pageNumber == _currentPage)
        .toList();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Articles on Page $_currentPage',
              style: const TextStyle(
                fontFamily: 'Georgia',
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            if (pageArticles.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Text('No indexed text articles on this page.'),
              )
            else
              ...pageArticles.map(
                (article) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    article.headline,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  subtitle: Text('${article.section} · ${article.byline}'),
                  trailing: IconButton(
                    icon: Icon(
                      _bookmarkedIds.contains(article.id)
                          ? Icons.bookmark
                          : Icons.bookmark_border,
                      color: _bookmarkedIds.contains(article.id)
                          ? DailyNewsApp.primaryRed
                          : DailyNewsApp.inkBlack,
                    ),
                    onPressed: () => _toggleBookmark(article),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.edition.formattedDate,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            Text(
              'Page $_currentPage of $_totalPages',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: DailyNewsApp.mutedGray,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Page Articles & Bookmarks',
            icon: const Icon(Icons.article_outlined),
            onPressed: _showPageArticlesSheet,
          ),
          IconButton(
            tooltip: 'Pages Overview',
            icon: const Icon(Icons.grid_view),
            onPressed: _showPageOverviewGrid,
          ),
          IconButton(
            tooltip: _localPdfFile != null ? 'Saved Offline' : 'Download PDF',
            icon: _isDownloading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Icon(
                    _localPdfFile != null ? Icons.offline_pin : Icons.download_outlined,
                    color: _localPdfFile != null
                        ? DailyNewsApp.primaryRed
                        : DailyNewsApp.inkBlack,
                  ),
            onPressed: _downloadForOffline,
          ),
        ],
      ),
      body: Column(
        children: [
          // Toolbar for Page Navigation & Zoom
          Container(
            height: 46,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: const BoxDecoration(
              color: Color(0xFFFAFAFA),
              border: Border(
                top: BorderSide(color: DailyNewsApp.hairlineBorder),
                bottom: BorderSide(color: DailyNewsApp.hairlineBorder),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_left),
                      onPressed: _currentPage > 1 ? () => _goToPage(_currentPage - 1) : null,
                    ),
                    Text(
                      '$_currentPage / $_totalPages',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right),
                      onPressed: _currentPage < _totalPages
                          ? () => _goToPage(_currentPage + 1)
                          : null,
                    ),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.zoom_out, size: 20),
                      onPressed: () => _adjustZoom(-0.25),
                    ),
                    Text(
                      '${(_zoomLevel * 100).round()}%',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                    IconButton(
                      icon: const Icon(Icons.zoom_in, size: 20),
                      onPressed: () => _adjustZoom(0.25),
                    ),
                    IconButton(
                      icon: Icon(
                        _showThumbnails ? Icons.expand_more : Icons.expand_less,
                        size: 20,
                      ),
                      onPressed: () => setState(() => _showThumbnails = !_showThumbnails),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Full-page PDF Viewer with pinch-to-zoom & pan
          Expanded(
            child: _localPdfFile != null
                ? SfPdfViewer.file(
                    _localPdfFile!,
                    controller: _pdfController,
                    pageLayoutMode: PdfPageLayoutMode.single,
                    scrollDirection: PdfScrollDirection.horizontal,
                    enableDoubleTapZooming: true,
                    onDocumentLoaded: (details) {
                      setState(() {
                        _totalPages = details.document.pages.count;
                      });
                      if (widget.initialPage > 1) {
                        _pdfController.jumpToPage(widget.initialPage);
                      }
                    },
                    onPageChanged: (details) {
                      setState(() => _currentPage = details.newPageNumber);
                      _storageService.saveLastReadPage(
                        widget.edition.id,
                        details.newPageNumber,
                      );
                    },
                  )
                : SfPdfViewer.network(
                    widget.edition.pdfUrl,
                    controller: _pdfController,
                    pageLayoutMode: PdfPageLayoutMode.single,
                    scrollDirection: PdfScrollDirection.horizontal,
                    enableDoubleTapZooming: true,
                    onDocumentLoaded: (details) {
                      setState(() {
                        _totalPages = details.document.pages.count;
                      });
                      if (widget.initialPage > 1) {
                        _pdfController.jumpToPage(widget.initialPage);
                      }
                    },
                    onPageChanged: (details) {
                      setState(() => _currentPage = details.newPageNumber);
                      _storageService.saveLastReadPage(
                        widget.edition.id,
                        details.newPageNumber,
                      );
                    },
                  ),
          ),
          if (_showThumbnails)
            PageThumbnailStrip(
              edition: widget.edition,
              currentPage: _currentPage,
              onPageSelected: _goToPage,
            ),
        ],
      ),
    );
  }
}
