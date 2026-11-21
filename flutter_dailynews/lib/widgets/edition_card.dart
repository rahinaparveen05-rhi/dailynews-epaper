import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_edition.dart';

class EditionCard extends StatelessWidget {
  final NewspaperEdition edition;
  final bool isDownloaded;
  final VoidCallback onOpenReader;
  final VoidCallback onDownloadTap;

  const EditionCard({
    super.key,
    required this.edition,
    required this.isDownloaded,
    required this.onOpenReader,
    required this.onDownloadTap,
  });

  @override
  Widget build(BuildContext context) {
    final leadHeadline =
        edition.pages.isNotEmpty ? edition.pages.first.leadHeadline : edition.title;

    return InkWell(
      onTap: onOpenReader,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: DailyNewsApp.hairlineBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${edition.formattedDate} · ${edition.totalPages} Pages',
                  style: const TextStyle(
                    fontSize: 12,
                    color: DailyNewsApp.mutedGray,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                IconButton(
                  onPressed: onDownloadTap,
                  tooltip: isDownloaded ? 'Available Offline' : 'Download PDF',
                  icon: Icon(
                    isDownloaded ? Icons.offline_pin : Icons.download_outlined,
                    size: 20,
                    color: isDownloaded ? DailyNewsApp.primaryRed : DailyNewsApp.inkBlack,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              leadHeadline,
              style: const TextStyle(
                fontFamily: 'Georgia',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                height: 1.3,
                color: DailyNewsApp.inkBlack,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              edition.cityEdition,
              style: const TextStyle(
                fontSize: 12,
                color: DailyNewsApp.mutedGray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
