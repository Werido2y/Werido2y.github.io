export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  category: string;
  publishDate: string;
  conference?: string;
  url?: string;
}

export interface Category {
  id: string;
  name: string;
  papers: Paper[];
}