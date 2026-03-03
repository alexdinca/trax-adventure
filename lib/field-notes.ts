import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/field-notes');

export interface FieldNote {
  slug: string;
  title: string;
  location: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
  content: string;
}

export interface FieldNoteMeta {
  slug: string;
  title: string;
  location: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
}

export function getAllFieldNotes(): FieldNoteMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));

  const notes = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? '',
        location: data.location ?? '',
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        coverImage: data.coverImage,
        published: data.published ?? false,
      } satisfies FieldNoteMeta;
    })
    .filter((n) => n.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return notes;
}

export function getFieldNote(slug: string): FieldNote | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (!data.published) return null;

  return {
    slug,
    title: data.title ?? '',
    location: data.location ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    coverImage: data.coverImage,
    published: data.published ?? false,
    content,
  };
}

export function getAllFieldNoteSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
