export type ToolCategory =
  | 'text'
  | 'code'
  | 'calc'
  | 'seo'
  | 'image'
  | 'file'
  | 'color'
  | 'date';

export type ToolQAProfile = 'text' | 'structured-data' | 'calculator' | 'seo-generator' | 'image' | 'file' | 'color' | 'date';

export interface ToolMeta {
  slug: string;
  category: ToolCategory;
  name: { fa: string; en: string };
  description: { fa: string; en: string };
  seoTitle?: { fa: string; en: string };
  keywords: string[];
  popular?: boolean;
  addedAt: string;
  related?: string[];
}

export interface RegisteredToolMeta extends ToolMeta {
  /** Assigned centrally by the registry; callers always receive a QA profile. */
  qaProfile: ToolQAProfile;
}

export interface CategoryMeta {
  slug: ToolCategory;
  fa: string;
  en: string;
  icon: string;
}
