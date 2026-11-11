export type ToolCategory =
  | 'text'
  | 'code'
  | 'calc'
  | 'seo'
  | 'image'
  | 'file';

export interface ToolMeta {
  slug: string;
  category: ToolCategory;
  name: { fa: string; en: string };
  description: { fa: string; en: string };
  keywords: string[];
  popular?: boolean;
  addedAt: string;
  related?: string[];
}

export interface CategoryMeta {
  slug: ToolCategory;
  fa: string;
  en: string;
  icon: string;
}
