class NewspaperArticle {
  final String id;
  final String editionId;
  final String editionDate;
  final int pageNumber;
  final String section;
  final String headline;
  final String summary;
  final String byline;
  final String body;
  final int readMinutes;

  const NewspaperArticle({
    required this.id,
    required this.editionId,
    required this.editionDate,
    required this.pageNumber,
    required this.section,
    required this.headline,
    required this.summary,
    required this.byline,
    required this.body,
    this.readMinutes = 3,
  });

  factory NewspaperArticle.fromJson(Map<String, dynamic> json) {
    return NewspaperArticle(
      id: json['id'] as String,
      editionId: json['editionId'] as String,
      editionDate: json['editionDate'] as String,
      pageNumber: json['pageNumber'] as int,
      section: json['section'] as String,
      headline: json['headline'] as String,
      summary: json['summary'] as String,
      byline: json['byline'] as String,
      body: json['body'] as String,
      readMinutes: (json['readMinutes'] as int?) ?? 3,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'editionId': editionId,
      'editionDate': editionDate,
      'pageNumber': pageNumber,
      'section': section,
      'headline': headline,
      'summary': summary,
      'byline': byline,
      'body': body,
      'readMinutes': readMinutes,
    };
  }
}
