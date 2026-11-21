import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/newspaper_article.dart';

class StorageService {
  static const String _bookmarksKey = 'dailynews_bookmarked_articles';
  static const String _downloadedPdfsKey = 'dailynews_downloaded_pdfs';
  static const String _lastPagePrefix = 'dailynews_last_page_';
  static const String _languageKey = 'dailynews_language_code';

  /// Returns all bookmarked articles saved in local device storage.
  Future<List<NewspaperArticle>> getBookmarks() async {
    final prefs = await SharedPreferences.getInstance();
    final rawList = prefs.getStringList(_bookmarksKey) ?? [];
    return rawList
        .map((item) => NewspaperArticle.fromJson(jsonDecode(item) as Map<String, dynamic>))
        .toList();
  }

  /// Checks whether a specific article is bookmarked.
  Future<bool> isBookmarked(String articleId) async {
    final bookmarks = await getBookmarks();
    return bookmarks.any((article) => article.id == articleId);
  }

  /// Toggles an article's bookmark state and persists to SharedPreferences.
  Future<bool> toggleBookmark(NewspaperArticle article) async {
    final prefs = await SharedPreferences.getInstance();
    final bookmarks = await getBookmarks();
    final existingIndex = bookmarks.indexWhere((a) => a.id == article.id);

    bool isNowBookmarked;
    if (existingIndex >= 0) {
      bookmarks.removeAt(existingIndex);
      isNowBookmarked = false;
    } else {
      bookmarks.insert(0, article);
      isNowBookmarked = true;
    }

    final encoded = bookmarks.map((a) => jsonEncode(a.toJson())).toList();
    await prefs.setStringList(_bookmarksKey, encoded);
    return isNowBookmarked;
  }

  /// Saves the local file path of a downloaded offline PDF.
  Future<void> markPdfDownloaded(String editionId, String localPath) async {
    final prefs = await SharedPreferences.getInstance();
    final map = await getDownloadedPdfMap();
    map[editionId] = localPath;
    await prefs.setString(_downloadedPdfsKey, jsonEncode(map));
  }

  /// Removes a downloaded PDF record.
  Future<void> removeDownloadedPdf(String editionId) async {
    final prefs = await SharedPreferences.getInstance();
    final map = await getDownloadedPdfMap();
    map.remove(editionId);
    await prefs.setString(_downloadedPdfsKey, jsonEncode(map));
  }

  /// Maps editionId -> local file path for offline reading.
  Future<Map<String, String>> getDownloadedPdfMap() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_downloadedPdfsKey);
    if (raw == null || raw.isEmpty) return {};
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return decoded.map((key, value) => MapEntry(key, value.toString()));
  }

  /// Gets and saves preferred reading language code.
  Future<String> getPreferredLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_languageKey) ?? 'en';
  }

  Future<void> savePreferredLanguage(String languageCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, languageCode);
  }

  /// Persists the reader's last viewed page for an edition.
  Future<void> saveLastReadPage(String editionId, int pageNumber) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('$_lastPagePrefix$editionId', pageNumber);
  }

  Future<int> getLastReadPage(String editionId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('$_lastPagePrefix$editionId') ?? 1;
  }
}
