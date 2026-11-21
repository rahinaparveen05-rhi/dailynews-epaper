import '../models/newspaper_article.dart';
import '../models/newspaper_edition.dart';

class EditionRepository {
  static const List<String> categories = [
    'All',
    'Front Page',
    'Nation',
    'World',
    'Business',
    'Editorial',
    'Science & Tech',
    'Sports',
  ];

  // Replace pdfUrl with your Firebase Storage or HTTPS server endpoint.
  static final List<NewspaperEdition> _editions = [
    NewspaperEdition(
      id: '2026-11-20',
      title: 'Morning National Edition',
      publishDate: DateTime(2026, 11, 20),
      formattedDate: 'Friday, Nov 20, 2026',
      cityEdition: 'Chennai · New Delhi · Bengaluru',
      totalPages: 8,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: 'editions/2026-11-20/dailynews_2026_11_20.pdf',
      pages: const [
        NewspaperSectionPage(
          pageNumber: 1,
          sectionName: 'Front Page',
          leadHeadline: 'National Clean Grid Accord Signed Across Twelve States',
        ),
        NewspaperSectionPage(
          pageNumber: 2,
          sectionName: 'Nation',
          leadHeadline: 'Urban Rail Corridors Expand Commuter Capacity by 40%',
        ),
        NewspaperSectionPage(
          pageNumber: 3,
          sectionName: 'World',
          leadHeadline: 'Maritime Trade Pact Sets Unified Port Customs Standards',
        ),
        NewspaperSectionPage(
          pageNumber: 4,
          sectionName: 'Business',
          leadHeadline: 'Semiconductor Packaging Clusters Attract Fresh Capital',
        ),
        NewspaperSectionPage(
          pageNumber: 5,
          sectionName: 'Editorial',
          leadHeadline: 'Investing in Resilient Public Transit for Growing Cities',
        ),
        NewspaperSectionPage(
          pageNumber: 6,
          sectionName: 'Science & Tech',
          leadHeadline: 'Indigenous Photonics Lab Demonstrates Room-Temp Sensor',
        ),
        NewspaperSectionPage(
          pageNumber: 7,
          sectionName: 'Sports',
          leadHeadline: 'Patience and Seam Discipline Seal Test Series Lead',
        ),
        NewspaperSectionPage(
          pageNumber: 8,
          sectionName: 'Front Page',
          leadHeadline: 'Back Page Digest: Weekend Cultural & Civic Calendar',
        ),
      ],
      articles: const [
        NewspaperArticle(
          id: 'art-2026-11-20-1',
          editionId: '2026-11-20',
          editionDate: 'Nov 20, 2026',
          pageNumber: 1,
          section: 'Front Page',
          headline: 'National Clean Grid Accord Signed Across Twelve States',
          summary:
              'State utilities agree to unified high-voltage balancing corridors and shared solar storage reserves.',
          byline: 'By Special Correspondent · New Delhi',
          body:
              'Twelve state electricity boards formalized a landmark interstate clean grid accord on Thursday, establishing real-time reserve sharing across regional solar and wind corridors.',
          readMinutes: 4,
        ),
        NewspaperArticle(
          id: 'art-2026-11-20-2',
          editionId: '2026-11-20',
          editionDate: 'Nov 20, 2026',
          pageNumber: 2,
          section: 'Nation',
          headline: 'Urban Rail Corridors Expand Commuter Capacity by 40%',
          summary:
              'Automated signalling upgrades allow three-minute peak headways across coastal metro lines.',
          byline: 'By Metro Desk · Chennai',
          body:
              'Commuter rail authorities rolled out communication-based train control across two major elevated viaducts, trimming peak-hour wait times to under three minutes.',
          readMinutes: 3,
        ),
        NewspaperArticle(
          id: 'art-2026-11-20-3',
          editionId: '2026-11-20',
          editionDate: 'Nov 20, 2026',
          pageNumber: 5,
          section: 'Editorial',
          headline: 'Investing in Resilient Public Transit for Growing Cities',
          summary:
              'Long-term civic mobility depends on last-mile bus integration as much as high-capacity rail.',
          byline: 'Editorial Board',
          body:
              'Elevated metro lines transform trunk corridors, yet cities unlock their full dividend only when feeder buses, shaded sidewalks, and unified smart-card fares operate seamlessly.',
          readMinutes: 5,
        ),
        NewspaperArticle(
          id: 'art-2026-11-20-4',
          editionId: '2026-11-20',
          editionDate: 'Nov 20, 2026',
          pageNumber: 6,
          section: 'Science & Tech',
          headline: 'Indigenous Photonics Lab Demonstrates Room-Temp Sensor',
          summary:
              'University researchers fabricate compact optical diagnostics for rural healthcare clinics.',
          byline: 'By Science Correspondent · Bengaluru',
          body:
              'A multidisciplinary photonics team has validated a low-power optical sensor capable of rapid water-quality and clinical diagnostics without cryogenic cooling.',
          readMinutes: 4,
        ),
      ],
    ),
    NewspaperEdition(
      id: '2026-11-19',
      title: 'Thursday National Edition',
      publishDate: DateTime(2026, 11, 19),
      formattedDate: 'Thursday, Nov 19, 2026',
      cityEdition: 'Chennai · New Delhi · Bengaluru',
      totalPages: 8,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: 'editions/2026-11-19/dailynews_2026_11_19.pdf',
      pages: const [
        NewspaperSectionPage(
          pageNumber: 1,
          sectionName: 'Front Page',
          leadHeadline: 'Monsoon Reservoir Levels Reach Five-Year High in South',
        ),
        NewspaperSectionPage(
          pageNumber: 2,
          sectionName: 'Nation',
          leadHeadline: 'Public Libraries Digitize 40,000 Rare Regional Manuscripts',
        ),
        NewspaperSectionPage(
          pageNumber: 4,
          sectionName: 'Business',
          leadHeadline: 'Small Exporters Adopt Instant Cross-Border Settlement',
        ),
        NewspaperSectionPage(
          pageNumber: 7,
          sectionName: 'Sports',
          leadHeadline: 'Junior Athletics Meet Sees Three National Records Fall',
        ),
      ],
      articles: const [
        NewspaperArticle(
          id: 'art-2026-11-19-1',
          editionId: '2026-11-19',
          editionDate: 'Nov 19, 2026',
          pageNumber: 1,
          section: 'Front Page',
          headline: 'Monsoon Reservoir Levels Reach Five-Year High in South',
          summary:
              'Sustained catchment inflows bolster municipal drinking water and rabi irrigation reserves.',
          byline: 'By State Bureau',
          body:
              'Water resources engineers confirmed major basins stand at 89% combined capacity ahead of the winter agricultural cycle.',
          readMinutes: 3,
        ),
      ],
    ),
    NewspaperEdition(
      id: '2026-11-18',
      title: 'Wednesday National Edition',
      publishDate: DateTime(2026, 11, 18),
      formattedDate: 'Wednesday, Nov 18, 2026',
      cityEdition: 'Chennai · New Delhi · Bengaluru',
      totalPages: 8,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: 'editions/2026-11-18/dailynews_2026_11_18.pdf',
      pages: const [
        NewspaperSectionPage(
          pageNumber: 1,
          sectionName: 'Front Page',
          leadHeadline: 'University Innovation Hubs Double Patent Filings in 2026',
        ),
      ],
      articles: const [
        NewspaperArticle(
          id: 'art-2026-11-18-1',
          editionId: '2026-11-18',
          editionDate: 'Nov 18, 2026',
          pageNumber: 1,
          section: 'Front Page',
          headline: 'University Innovation Hubs Double Patent Filings in 2026',
          summary:
              'Engineering campuses lead applied research in clean water filtration and embedded hardware.',
          byline: 'By Education Desk',
          body:
              'Public technical institutes recorded a sharp rise in translational research collaborations with regional manufacturing startups.',
          readMinutes: 4,
        ),
      ],
    ),
  ];

  List<NewspaperEdition> getAllEditions() => _editions;

  NewspaperEdition getTodayEdition() => _editions.first;

  List<NewspaperEdition> getPreviousEditions() => _editions.sublist(1);

  List<NewspaperArticle> searchArticles(String query, {String category = 'All'}) {
    final normalized = query.trim().toLowerCase();
    final allArticles = _editions.expand((e) => e.articles).toList();

    return allArticles.where((article) {
      final matchesCategory = category == 'All' || article.section == category;
      if (!matchesCategory) return false;
      if (normalized.isEmpty) return true;
      return article.headline.toLowerCase().contains(normalized) ||
          article.summary.toLowerCase().contains(normalized) ||
          article.section.toLowerCase().contains(normalized) ||
          article.byline.toLowerCase().contains(normalized);
    }).toList();
  }
}
