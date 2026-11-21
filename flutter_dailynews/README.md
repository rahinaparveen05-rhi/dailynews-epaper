# DailyNews — Digital ePaper Reader (Flutter & Dart)

A clean, minimalist digital newspaper reader inspired by *The Hindu* ePaper experience, designed for mobile and tablet devices. Built as a beginner-friendly, modular B.Tech CSE project with zero login barriers so readers can open today's edition immediately.

## Key Features

1. **Immediate Reading Experience** — Opens directly to Today's Newspaper and recent editions without login or registration screens.
2. **Full-Page PDF ePaper Reader** — High-clarity broadsheet PDF rendering powered by `syncfusion_flutter_pdfviewer`.
3. **Previous & Next Page Navigation** — Quick toolbar controls and swipe navigation with live `Page X of Y` indicators.
4. **Pinch-to-Zoom & Pan** — Smooth multi-touch pinch zoom, double-tap zoom, and pan across broadsheet columns.
5. **Page Thumbnails & Overview** — Expandable page strip and full grid overview for jumping to any page in the edition.
6. **Section Navigation** — Direct jump tabs for Front Page, Nation, World, Business, Editorial, Science & Tech, and Sports.
7. **Headline & Article Search** — Instant keyword search across all editions, headlines, bylines, and summaries.
8. **Offline Bookmarks** — Save favourite articles locally using `shared_preferences`.
9. **Date-Organized Archives** — Browse previous editions grouped chronologically by date.
10. **Offline PDF Downloads** — Download full edition PDFs via `dio` + `path_provider` and read offline seamlessly.

## Project Structure

```text
lib/
├── main.dart
├── models/
│   ├── newspaper_article.dart
│   └── newspaper_edition.dart
├── services/
│   ├── edition_repository.dart
│   ├── pdf_service.dart
│   └── storage_service.dart
├── screens/
│   ├── home_screen.dart
│   ├── epaper_reader_screen.dart
│   ├── archive_screen.dart
│   ├── bookmarks_screen.dart
│   └── search_screen.dart
└── widgets/
    ├── edition_card.dart
    ├── page_thumbnail_strip.dart
    └── section_nav_bar.dart
```

## Getting Started

1. **Install Flutter SDK** (3.22+ recommended) and run:
   ```bash
   flutter pub get
   ```
2. **Configure PDF Hosting (Firebase Storage or HTTPS Server)**:
   - Update `pdfUrl` or `firebaseStoragePath` in `lib/services/edition_repository.dart`.
   - If using Firebase Storage, run `flutterfire configure` and uncomment `Firebase.initializeApp()` in `lib/main.dart`.
3. **Run on Emulator or Device**:
   ```bash
   flutter run
   ```
