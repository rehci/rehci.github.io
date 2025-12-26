import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

/**
 * Generates the robots.txt file for search engine crawlers.
 * Allows all user agents to crawl the site except API routes.
 * References the sitemap location.
 *
 * @returns {MetadataRoute.Robots} Robots configuration object
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

