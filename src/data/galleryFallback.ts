import type { GalleryItem } from '../hooks/useGallery';

/**
 * Curated fallback gallery.
 *
 * `/gallery` is the one public surface whose content lives entirely in Supabase
 * (`gallery_items`). Any hiccup — table empty, RLS misconfiguration, Supabase
 * not configured, network failure — previously rendered the raw string
 * "Failed to fetch gallery" in the middle of a luxury brand, with nothing else
 * on the page.
 *
 * These are the house's own photographs, already shipped in `public/assets`,
 * so the grid is never empty and never shows an error. Titles are intentionally
 * blank: `GalleryGrid` already renders `t('gallery.untitled')` for untitled
 * items and localises it, so these need no per-item translation. When the live
 * feed returns rows, `GalleryPage` renders those instead and this file is unused.
 */
export const FALLBACK_GALLERY: GalleryItem[] = [
  { id: 'fb-01', title: '', description: '', category: 'bridal', media_url: '/assets/rimanfashion_3475218855592081083_227867687_1_2024-10-09.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 1, is_featured: true, created_at: '2024-10-09' },
  { id: 'fb-02', title: '', description: '', category: 'evening', media_url: '/assets/rimanfashion_3484604921436590913_227867687_1_2024-10-22.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 2, is_featured: true, created_at: '2024-10-22' },
  { id: 'fb-03', title: '', description: '', category: 'bridal', media_url: '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 3, is_featured: true, created_at: '2025-01-10' },
  { id: 'fb-04', title: '', description: '', category: 'behind_scenes', media_url: '/assets/rimanfashion_3542687554351211237_227867687_2_2025-01-10.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 4, is_featured: false, created_at: '2025-01-10' },
  { id: 'fb-05', title: '', description: '', category: 'bridal', media_url: '/assets/rimanfashion_3638272630430035602_227867687_1_2025-05-22.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 5, is_featured: true, created_at: '2025-05-22' },
  { id: 'fb-06', title: '', description: '', category: 'client_stories', media_url: '/assets/rimanfashion_3638158883472325906_1739454936_1_2025-05-22.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 6, is_featured: false, created_at: '2025-05-22' },
  { id: 'fb-07', title: '', description: '', category: 'evening', media_url: '/assets/rimanfashion_3640433975103420052_227867687_1_2025-05-25.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 7, is_featured: true, created_at: '2025-05-25' },
  { id: 'fb-08', title: '', description: '', category: 'behind_scenes', media_url: '/assets/rimanfashion_3661463055366070525_227867687_1_2025-06-23.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 8, is_featured: false, created_at: '2025-06-23' },
  { id: 'fb-09', title: '', description: '', category: 'bridal', media_url: '/assets/rimanfashion_3678245315913995332_6730733643_1_2025-07-16.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 9, is_featured: true, created_at: '2025-07-16' },
  { id: 'fb-10', title: '', description: '', category: 'behind_scenes', media_url: '/assets/rimanfashion_3697095665609781601_6730733643_1_2025-08-11.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 10, is_featured: false, created_at: '2025-08-11' },
  { id: 'fb-11', title: '', description: '', category: 'client_stories', media_url: '/assets/rimanfashion_3705450535693995034_353452888_1_2025-08-23.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 11, is_featured: false, created_at: '2025-08-23' },
  { id: 'fb-12', title: '', description: '', category: 'bridal', media_url: '/assets/rimanfashion_3794117828967352274_6730733643_1_2025-12-23.jpg', media_type: 'photo', thumbnail_url: '', sort_order: 12, is_featured: true, created_at: '2025-12-23' },
];
