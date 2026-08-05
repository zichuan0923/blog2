export interface PostAuthor {
  name: string | null;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string;
  published: boolean;
  createdAt: string;
  author: PostAuthor | null;
}

/** 估算阅读时间（分钟）：按中文每 300 字 / 分钟 */
export function readingTime(content: string, excerpt?: string | null): number {
  const text = excerpt && excerpt.length > 0 ? excerpt : content;
  const len = text.replace(/\s/g, "").length;
  return Math.max(1, Math.round(len / 300));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export interface PostAuthor {
  name: string | null;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string;
  published: boolean;
  createdAt: string;
  author: PostAuthor | null;
}

/** 估算阅读时间（分钟）：按中文每 300 字 / 分钟 */
export function readingTime(content: string, excerpt?: string | null): number {
  const text = excerpt && excerpt.length > 0 ? excerpt : content;
  const len = text.replace(/\s/g, "").length;
  return Math.max(1, Math.round(len / 300));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
