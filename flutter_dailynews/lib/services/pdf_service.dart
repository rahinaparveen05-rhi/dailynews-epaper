import 'dart:io';
import 'package:dio/dio.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:path_provider/path_provider.dart';
import '../models/newspaper_edition.dart';
import 'storage_service.dart';

class PdfService {
  final Dio _dio = Dio();
  final StorageService _storage = StorageService();

  /// Resolves either a Firebase Storage download URL or direct HTTPS PDF URL.
  Future<String> resolvePdfUrl(NewspaperEdition edition) async {
    if (edition.firebaseStoragePath != null &&
        edition.firebaseStoragePath!.isNotEmpty) {
      try {
        final ref = FirebaseStorage.instance.ref(edition.firebaseStoragePath);
        return await ref.getDownloadURL();
      } catch (_) {
        // Fallback to direct HTTPS URL if Firebase is not configured yet
        return edition.pdfUrl;
      }
    }
    return edition.pdfUrl;
  }

  /// Checks if an edition PDF is already cached locally on the device.
  Future<File?> getLocalPdfFile(String editionId) async {
    final map = await _storage.getDownloadedPdfMap();
    final path = map[editionId];
    if (path == null) return null;

    final file = File(path);
    if (await file.exists()) {
      return file;
    }
    await _storage.removeDownloadedPdf(editionId);
    return null;
  }

  /// Downloads the newspaper PDF to device storage for offline reading.
  Future<File> downloadEditionPdf({
    required NewspaperEdition edition,
    required void Function(double progress) onProgress,
  }) async {
    final url = await resolvePdfUrl(edition);
    final dir = await getApplicationDocumentsDirectory();
    final targetDir = Directory('${dir.path}/dailynews_editions');
    if (!await targetDir.exists()) {
      await targetDir.create(recursive: true);
    }

    final filePath = '${targetDir.path}/${edition.id}.pdf';
    await _dio.download(
      url,
      filePath,
      onReceiveProgress: (received, total) {
        if (total > 0) {
          onProgress(received / total);
        }
      },
    );

    await _storage.markPdfDownloaded(edition.id, filePath);
    return File(filePath);
  }

  /// Deletes a locally cached edition PDF to free device storage.
  Future<void> deleteOfflinePdf(String editionId) async {
    final file = await getLocalPdfFile(editionId);
    if (file != null && await file.exists()) {
      await file.delete();
    }
    await _storage.removeDownloadedPdf(editionId);
  }
}
