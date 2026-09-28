export interface RelatedTest {
  _id: string;
  name: string;
  description?: string;
  duration?: string;
  type?: string;
  factor?: any;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
  author: { _id: string; name: string };
  authorName?: string;
  publishedAt?: string;
  createdAt: string;
  views?: number;
  isFeatured?: boolean;
  readTime?: number;
  slug?: string;
  relatedTests?: RelatedTest[];
}

export interface PaginatedArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  pages: number;
}
