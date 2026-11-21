import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_edition.dart';
import '../services/edition_repository.dart';
import '../services/pdf_service.dart';
import '../services/storage_service.dart';
import '../widgets/edition_card.dart';
import 'epaper_reader_screen.dart';

class ArchiveScreen extends StatefulWidget {
  const ArchiveScreen({super.key});

  @override
  State<ArchiveScreen> createState() => _ArchiveScreenState();
}

class _ArchiveScreenState extends State<ArchiveScreen> {
  final EditionRepository _repository = EditionRepository();
  final PdfService _pdfService = PdfService();
  final StorageService _storageService = StorageService();

  Map<String, String> _downloadedMap = {};
  DateTime? _selectedDateFilter;

  @override
  void initState() {
    super.initState();
    _loadOfflineMap();
  }

  Future<void> _loadOfflineMap() async {
    final map = await _storageService.getDownloadedPdfMap();
    if (mounted) setState(() => _downloadedMap = map);
  }

  Future<void> _pickDate(List<NewspaperEdition> editions) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDateFilter ?? editions.first.publishDate,
      firstDate: DateTime(2025, 1, 1),
      lastDate: DateTime(2027, 12, 31),
    );
    if (picked != null) {
      setState(() => _selectedDateFilter = picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    final allEditions = _repository.getAllEditions();
    final filtered = _selectedDateFilter == null
        ? allEditions
        : allEditions.where((e) =>
            e.publishDate.year == _selectedDateFilter!.year &&
            e.publishDate.month == _selectedDateFilter!.month &&
            e.publishDate.day == _selectedDateFilter!.day).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Archives'),
        actions: [
          if (_selectedDateFilter != null)
            TextButton(
              onPressed: () => setState(() => _selectedDateFilter = null),
              child: const Text('Clear'),
            ),
          IconButton(
            tooltip: 'Filter by Date',
            icon: const Icon(Icons.calendar_today_outlined),
            onPressed: () => _pickDate(allEditions),
          ),
        ],
      ),
      body: filtered.isEmpty
          ? const Center(
              child: Text(
                'No edition found for the selected date.',
                style: TextStyle(color: DailyNewsApp.mutedGray),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final edition = filtered[index];
                return EditionCard(
                  edition: edition,
                  isDownloaded: _downloadedMap.containsKey(edition.id),
                  onOpenReader: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => EpaperReaderScreen(edition: edition),
                      ),
                    ).then((_) => _loadOfflineMap());
                  },
                  onDownloadTap: () async {
                    await _pdfService.downloadEditionPdf(
                      edition: edition,
                      onProgress: (_) {},
                    );
                    await _loadOfflineMap();
                  },
                );
              },
            ),
    );
  }
}
