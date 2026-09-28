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
  relatedTests?: string[];
}

export interface ArticleDto {
  title: string;
  content: string;
  excerpt?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
  authorName?: string;
  relatedTests?: string[];
}
