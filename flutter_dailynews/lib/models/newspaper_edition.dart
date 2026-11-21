import 'newspaper_article.dart';

class NewspaperSectionPage {
  final int pageNumber;
  final String sectionName;
  final String leadHeadline;

  const NewspaperSectionPage({
    required this.pageNumber,
    required this.sectionName,
    required this.leadHeadline,
  });
}

class NewspaperEdition {
  final String id;
  final String title;
  final DateTime publishDate;
  final String formattedDate;
  final String cityEdition;
  final int totalPages;
  final String pdfUrl;
  final String? firebaseStoragePath;
  final List<NewspaperSectionPage> pages;
  final List<NewspaperArticle> articles;

  const NewspaperEdition({
    required this.id,
    required this.title,
    required this.publishDate,
    required this.formattedDate,
    required this.cityEdition,
    required this.totalPages,
    required this.pdfUrl,
    this.firebaseStoragePath,
    required this.pages,
    required this.articles,
  });

  bool get isToday {
    final now = DateTime.now();
    return publishDate.year == now.year &&
        publishDate.month == now.month &&
        publishDate.day == now.day;
  }
}
