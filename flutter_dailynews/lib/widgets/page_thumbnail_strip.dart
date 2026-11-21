import 'package:flutter/material.dart';
import '../main.dart';
import '../models/newspaper_edition.dart';

class PageThumbnailStrip extends StatelessWidget {
  final NewspaperEdition edition;
  final int currentPage;
  final ValueChanged<int> onPageSelected;

  const PageThumbnailStrip({
    super.key,
    required this.edition,
    required this.currentPage,
    required this.onPageSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 112,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: DailyNewsApp.hairlineBorder)),
      ),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        itemCount: edition.totalPages,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final pageNum = index + 1;
          final isActive = pageNum == currentPage;
          final sectionInfo = edition.pages.where((p) => p.pageNumber == pageNum).firstOrNull;

          return InkWell(
            onTap: () => onPageSelected(pageNum),
            child: Container(
              width: 72,
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFFFEF2F2) : const Color(0xFFFAFAFA),
                border: Border.all(
                  color: isActive ? DailyNewsApp.primaryRed : DailyNewsApp.hairlineBorder,
                  width: isActive ? 1.5 : 1,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'P${pageNum.toString().padLeft(2, '0')}',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: isActive ? DailyNewsApp.primaryRed : DailyNewsApp.inkBlack,
                    ),
                  ),
                  Text(
                    sectionInfo?.sectionName ?? 'Page $pageNum',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      height: 1.2,
                      color: DailyNewsApp.mutedGray,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
