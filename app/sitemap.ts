import type { MetadataRoute } from 'next';
import { getAllFieldNotes } from '@/lib/field-notes';

const BASE_URL = 'https://ridetrax.eu';

export default function sitemap(): MetadataRoute.Sitemap {
  const fieldNotes = getAllFieldNotes();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/experiences`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/dobrogea-calling`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/carpathian-ridge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/the-ground`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/long-way-in`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/out-there`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/manifesto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/field-notes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const fieldNotePages: MetadataRoute.Sitemap = fieldNotes.map((note) => ({
    url: `${BASE_URL}/field-notes/${note.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...fieldNotePages];
}
