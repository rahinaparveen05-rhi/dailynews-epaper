import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
// Uncomment after running `flutterfire configure`:
// import 'package:firebase_core/firebase_core.dart';
import 'screens/home_screen.dart';
import 'screens/archive_screen.dart';
import 'screens/bookmarks_screen.dart';
import 'screens/search_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Optional: Initialize Firebase when using Firebase Storage for PDFs.
  // await Firebase.initializeApp();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.white,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const DailyNewsApp());
}

class DailyNewsApp extends StatelessWidget {
  const DailyNewsApp({super.key});

  static const Color primaryRed = Color(0xFFB91C1C);
  static const Color inkBlack = Color(0xFF0A0A0A);
  static const Color mutedGray = Color(0xFF525252);
  static const Color hairlineBorder = Color(0xFFE5E5E5);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DailyNews ePaper',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.white,
        colorScheme: const ColorScheme.light(
          primary: primaryRed,
          onPrimary: Colors.white,
          secondary: inkBlack,
          surface: Colors.white,
          onSurface: inkBlack,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: inkBlack,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: false,
          titleTextStyle: TextStyle(
            fontFamily: 'Georgia',
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: inkBlack,
            letterSpacing: -0.5,
          ),
        ),
        dividerTheme: const DividerThemeData(
          color: hairlineBorder,
          thickness: 1,
        ),
      ),
      // Immediate reading experience — no login wall
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    ArchiveScreen(),
    SearchScreen(),
    BookmarksScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      body: isTablet
          ? Row(
              children: [
                NavigationRail(
                  selectedIndex: _selectedIndex,
                  onDestinationSelected: (index) {
                    setState(() => _selectedIndex = index);
                  },
                  backgroundColor: Colors.white,
                  indicatorColor: const Color(0xFFFEE2E2),
                  selectedIconTheme: const IconThemeData(color: DailyNewsApp.primaryRed),
                  selectedLabelTextStyle: const TextStyle(
                    color: DailyNewsApp.primaryRed,
                    fontWeight: FontWeight.w600,
                  ),
                  labelType: NavigationRailLabelType.all,
                  destinations: const [
                    NavigationRailDestination(
                      icon: Icon(Icons.newspaper_outlined),
                      selectedIcon: Icon(Icons.newspaper),
                      label: Text('Today'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.calendar_month_outlined),
                      selectedIcon: Icon(Icons.calendar_month),
                      label: Text('Archives'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.search_outlined),
                      selectedIcon: Icon(Icons.search),
                      label: Text('Search'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.bookmark_border),
                      selectedIcon: Icon(Icons.bookmark),
                      label: Text('Saved'),
                    ),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: _screens[_selectedIndex]),
              ],
            )
          : _screens[_selectedIndex],
      bottomNavigationBar: isTablet
          ? null
          : Container(
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: DailyNewsApp.hairlineBorder)),
              ),
              child: NavigationBar(
                height: 64,
                backgroundColor: Colors.white,
                indicatorColor: const Color(0xFFFEE2E2),
                selectedIndex: _selectedIndex,
                onDestinationSelected: (index) {
                  setState(() => _selectedIndex = index);
                },
                destinations: const [
                  NavigationDestination(
                    icon: Icon(Icons.newspaper_outlined),
                    selectedIcon: Icon(Icons.newspaper, color: DailyNewsApp.primaryRed),
                    label: 'Today',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.calendar_month_outlined),
                    selectedIcon: Icon(Icons.calendar_month, color: DailyNewsApp.primaryRed),
                    label: 'Archives',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.search_outlined),
                    selectedIcon: Icon(Icons.search, color: DailyNewsApp.primaryRed),
                    label: 'Search',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.bookmark_border),
                    selectedIcon: Icon(Icons.bookmark, color: DailyNewsApp.primaryRed),
                    label: 'Saved',
                  ),
                ],
              ),
            ),
    );
  }
}
