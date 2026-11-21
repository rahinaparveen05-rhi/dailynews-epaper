import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_edition.dart';
import '../services/edition_repository.dart';
import '../services/pdf_service.dart';
import '../services/storage_service.dart';
import '../widgets/edition_card.dart';
import '../widgets/section_nav_bar.dart';
import 'epaper_reader_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final EditionRepository _repository = EditionRepository();
  final PdfService _pdfService = PdfService();
  final StorageService _storageService = StorageService();

  String _selectedSection = 'All';
  String _selectedLanguage = 'en';
  Map<String, String> _downloadedMap = {};
  String? _downloadingId;
  double _downloadProgress = 0;

  static const Map<String, String> _languages = {
    'en': 'English',
    'hi': 'हिन्दी',
    'ta': 'தமிழ்',
    'te': 'తెలుగు',
  };

  @override
  void initState() {
    super.initState();
    _loadOfflineStatus();
    _loadLanguage();
  }

  Future<void> _loadLanguage() async {
    final lang = await _storageService.getPreferredLanguage();
    if (mounted) setState(() => _selectedLanguage = lang);
  }

  Future<void> _changeLanguage(String code) async {
    await _storageService.savePreferredLanguage(code);
    if (mounted) setState(() => _selectedLanguage = code);
  }

  Future<void> _loadOfflineStatus() async {
    final map = await _storageService.getDownloadedPdfMap();
    if (mounted) {
      setState(() => _downloadedMap = map);
    }
  }

  void _openEdition(NewspaperEdition edition, {int initialPage = 1}) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => EpaperReaderScreen(
          edition: edition,
          initialPage: initialPage,
        ),
      ),
    ).then((_) => _loadOfflineStatus());
  }

  Future<void> _downloadEdition(NewspaperEdition edition) async {
    if (_downloadingId != null) return;
    setState(() {
      _downloadingId = edition.id;
      _downloadProgress = 0;
    });
    try {
      await _pdfService.downloadEditionPdf(
        edition: edition,
        onProgress: (progress) {
          if (mounted) setState(() => _downloadProgress = progress);
        },
      );
      await _loadOfflineStatus();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Saved ${edition.formattedDate} for offline reading')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Download failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _downloadingId = null);
      }
    }
  }

  void _jumpToSection(NewspaperEdition today, String section) {
    setState(() => _selectedSection = section);
    if (section == 'All') return;
    final match = today.pages.where((p) => p.sectionName == section).firstOrNull;
    if (match != null) {
      _openEdition(today, initialPage: match.pageNumber);
    }
  }

  @override
  Widget build(BuildContext context) {
    final today = _repository.getTodayEdition();
    final previousEditions = _repository.getPreviousEditions();
    final isTodayDownloaded = _downloadedMap.containsKey(today.id);

    return Scaffold(
      appBar: AppBar(
        title: const Text('DailyNews'),
        actions: [
          PopupMenuButton<String>(
            tooltip: 'Edition Language',
            onSelected: _changeLanguage,
            itemBuilder: (_) => _languages.entries
                .map(
                  (entry) => PopupMenuItem<String>(
                    value: entry.key,
                    child: Text(entry.value),
                  ),
                )
                .toList(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.translate, size: 18),
                  const SizedBox(width: 6),
                  Text(
                    _languages[_selectedLanguage] ?? 'English',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(45),
          child: Container(
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: DailyNewsApp.hairlineBorder),
                bottom: BorderSide(color: DailyNewsApp.hairlineBorder),
              ),
            ),
            child: SectionNavBar(
              sections: EditionRepository.categories,
              selectedSection: _selectedSection,
              onSectionSelected: (section) => _jumpToSection(today, section),
            ),
          ),
        ),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 768;

          return ListView(
            padding: EdgeInsets.symmetric(
              horizontal: isWide ? 32 : 16,
              vertical: 20,
            ),
            children: [
              // Today's Lead Broadsheet Edition
              Text(
                "Today's Edition · ${today.formattedDate}",
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: DailyNewsApp.primaryRed,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: DailyNewsApp.inkBlack, width: 1.2),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      today.pages.first.leadHeadline,
                      style: const TextStyle(
                        fontFamily: 'Georgia',
                        fontSize: 26,
                        fontWeight: FontWeight.w700,
                        height: 1.2,
                        color: DailyNewsApp.inkBlack,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      '${today.cityEdition} · ${today.totalPages} Broadsheet Pages',
                      style: const TextStyle(
                        fontSize: 13,
                        color: DailyNewsApp.mutedGray,
                      ),
                    ),
                    const SizedBox(height: 18),
                    if (_downloadingId == today.id)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: LinearProgressIndicator(
                          value: _downloadProgress,
                          color: DailyNewsApp.primaryRed,
                          backgroundColor: const Color(0xFFF3F4F6),
                        ),
                      ),
                    Wrap(
                      spacing: 12,
                      runSpacing: 10,
                      children: [
                        FilledButton.icon(
                          onPressed: () => _openEdition(today),
                          style: FilledButton.styleFrom(
                            backgroundColor: DailyNewsApp.inkBlack,
                            foregroundColor: Colors.white,
                            shape: const RoundedRectangleBorder(),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 14,
                            ),
                          ),
                          icon: const Icon(Icons.chrome_reader_mode_outlined, size: 18),
                          label: const Text('Read Full ePaper'),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => _downloadEdition(today),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: isTodayDownloaded
                                ? DailyNewsApp.primaryRed
                                : DailyNewsApp.inkBlack,
                            side: const BorderSide(color: DailyNewsApp.hairlineBorder),
                            shape: const RoundedRectangleBorder(),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 14,
                            ),
                          ),
                          icon: Icon(
                            isTodayDownloaded ? Icons.offline_pin : Icons.download_outlined,
                            size: 18,
                          ),
                          label: Text(isTodayDownloaded ? 'Saved Offline' : 'Download PDF'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              const Text(
                'Previous Editions',
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: DailyNewsApp.inkBlack,
                ),
              ),
              const SizedBox(height: 12),
              if (isWide)
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 2.1,
                  ),
                  itemCount: previousEditions.length,
                  itemBuilder: (context, index) {
                    final edition = previousEditions[index];
                    return EditionCard(
                      edition: edition,
                      isDownloaded: _downloadedMap.containsKey(edition.id),
                      onOpenReader: () => _openEdition(edition),
                      onDownloadTap: () => _downloadEdition(edition),
                    );
                  },
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: previousEditions.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final edition = previousEditions[index];
                    return EditionCard(
                      edition: edition,
                      isDownloaded: _downloadedMap.containsKey(edition.id),
                      onOpenReader: () => _openEdition(edition),
                      onDownloadTap: () => _downloadEdition(edition),
                    );
                  },
                ),
            ],
          );
        },
      ),
    );
  }
}
