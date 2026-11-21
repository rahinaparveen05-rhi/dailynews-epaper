import 'package:flutter/material.dart';
import '../main.dart';

class SectionNavBar extends StatelessWidget {
  final List<String> sections;
  final String selectedSection;
  final ValueChanged<String> onSectionSelected;

  const SectionNavBar({
    super.key,
    required this.sections,
    required this.selectedSection,
    required this.onSectionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: sections.length,
        separatorBuilder: (_, __) => const SizedBox(width: 20),
        itemBuilder: (context, index) {
          final section = sections[index];
          final isSelected = section == selectedSection;

          return InkWell(
            onTap: () => onSectionSelected(section),
            child: Container(
              alignment: Alignment.center,
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isSelected ? DailyNewsApp.primaryRed : Colors.transparent,
                    width: 2,
                  ),
                ),
              ),
              child: Text(
                section,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? DailyNewsApp.inkBlack : DailyNewsApp.mutedGray,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
