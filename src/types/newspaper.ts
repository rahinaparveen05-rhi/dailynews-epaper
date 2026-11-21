export type AppTab = 'today' | 'reader' | 'archives' | 'bookmarks' | 'login';

export type NewspaperCategory =
  | 'All'
  | 'Front Page'
  | 'Nation'
  | 'World'
  | 'Business'
  | 'Editorial'
  | 'Science & Tech'
  | 'Sports'
  | 'Arts & Culture';

export interface NewspaperArticle {
  id: string;
  editionId: string;
  editionDate: string;
  pageNumber: number;
  section: Exclude<NewspaperCategory, 'All'>;
  headline: string;
  deck: string;
  byline: string;
  location: string;
  readMinutes: number;
  imageUrl?: string;
  imageCaption?: string;
  paragraphs: string[];
  isLead?: boolean;
}

export interface NewspaperPage {
  pageNumber: number;
  section: Exclude<NewspaperCategory, 'All'>;
  pageTitle: string;
  leadHeadline: string;
  articles: NewspaperArticle[];
}

export interface NewspaperEdition {
  id: string;
  isoDate: string;
  formattedDate: string;
  dayOfWeek: string;
  volumeLabel: string;
  cityEdition: string;
  totalPages: number;
  pages: NewspaperPage[];
}

export interface ReaderUser {
  id: string;
  name: string;
  number: string;
  language: 'en' | 'hi' | 'ta' | 'te';
  bookmarks: NewspaperArticle[];
  createdAt: string;
}
