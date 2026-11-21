import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_article.dart';
import '../services/edition_repository.dart';
import '../widgets/section_nav_bar.dart';
import 'epaper_reader_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final EditionRepository _repository = EditionRepository();
  final TextEditingController _controller = TextEditingController();
  String _selectedCategory = 'All';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openArticlePage(NewspaperArticle article) {
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
    final results = _repository.searchArticles(
      _controller.text,
      category: _selectedCategory,
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Search Headlines')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: TextField(
              controller: _controller,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Search headlines, sections, or topics...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _controller.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _controller.clear();
                          setState(() {});
                        },
                      )
                    : null,
                border: const OutlineInputBorder(borderRadius: BorderRadius.zero),
              ),
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: DailyNewsApp.hairlineBorder)),
            ),
            child: SectionNavBar(
              sections: EditionRepository.categories,
              selectedSection: _selectedCategory,
              onSectionSelected: (section) => setState(() => _selectedCategory = section),
            ),
          ),
          Expanded(
            child: results.isEmpty
                ? const Center(
                    child: Text(
                      'No matching articles found.',
                      style: TextStyle(color: DailyNewsApp.mutedGray),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: results.length,
                    separatorBuilder: (_, __) => const Divider(height: 24),
                    itemBuilder: (context, index) {
                      final article = results[index];
                      return InkWell(
                        onTap: () => _openArticlePage(article),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${article.section} · ${article.editionDate} · Page ${article.pageNumber}',
                              style: const TextStyle(
                                fontSize: 12,
                                color: DailyNewsApp.primaryRed,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              article.headline,
                              style: const TextStyle(
                                fontFamily: 'Georgia',
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                                color: DailyNewsApp.inkBlack,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              article.summary,
                              style: const TextStyle(
                                fontSize: 14,
                                color: DailyNewsApp.mutedGray,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
