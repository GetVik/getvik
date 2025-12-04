export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string;
  author?: {
    name: string;
    picture?: string;
  };
  ogImage?: {
    url: string;
  };
  content: string;
  tags?: string[];
  category?: string;
  readingTime?: string;
}
