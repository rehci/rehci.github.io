import { MetadataRoute } from 'next';
import { getAllArticles, getAllCategories } from '@/lib/markdown';

/**
 * Generates the sitemap.xml for SEO purposes.
 * Creates sitemap entries for the home page, search page, all categories,
 * and all articles with their last modified dates and priorities.
 *
 * @returns {MetadataRoute.Sitemap} Sitemap array with all site URLs and metadata
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const articles = getAllArticles();
  const categories = getAllCategories();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}

