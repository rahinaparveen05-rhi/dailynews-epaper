import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_article.dart';
import '../services/edition_repository.dart';
import '../services/storage_service.dart';
import 'epaper_reader_screen.dart';

class BookmarksScreen extends StatefulWidget {
  const BookmarksScreen({super.key});

  @override
  State<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends State<BookmarksScreen> {
  final StorageService _storageService = StorageService();
  final EditionRepository _repository = EditionRepository();
  List<NewspaperArticle> _bookmarks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBookmarks();
  }

  Future<void> _loadBookmarks() async {
    final items = await _storageService.getBookmarks();
    if (mounted) {
      setState(() {
        _bookmarks = items;
        _isLoading = false;
      });
    }
  }

  Future<void> _removeBookmark(NewspaperArticle article) async {
    await _storageService.toggleBookmark(article);
    await _loadBookmarks();
  }

  void _openInReader(NewspaperArticle article) {
    final edition = _repository
        .getAllEditions()
        .where((e) => e.id == article.editionId)
        .firstOrNull;
    if (edition == null) return;
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => EpaperReaderScreen(
          edition: edition,
          initialPage: article.pageNumber,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Articles')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _bookmarks.isEmpty
              ? const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Text(
                      'No saved articles yet. Bookmark stories while reading an edition to access them offline.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: DailyNewsApp.mutedGray, height: 1.5),
                    ),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _bookmarks.length,
                  separatorBuilder: (_, __) => const Divider(height: 24),
                  itemBuilder: (context, index) {
                    final article = _bookmarks[index];
                    return InkWell(
                      onTap: () => _openInReader(article),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${article.section} · ${article.editionDate} · Page ${article.pageNumber}',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: DailyNewsApp.primaryRed,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.bookmark_remove_outlined, size: 20),
                                onPressed: () => _removeBookmark(article),
                              ),
                            ],
                          ),
                          Text(
                            article.headline,
                            style: const TextStyle(
                              fontFamily: 'Georgia',
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: DailyNewsApp.inkBlack,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            article.summary,
                            style: const TextStyle(
                              fontSize: 14,
                              color: DailyNewsApp.mutedGray,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
