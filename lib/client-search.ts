import { Article } from './markdown';

/**
 * Client-side search utility for static sites.
 * Performs search entirely in the browser without requiring a server or API.
 * 
 * This is used when the Meilisearch API is not available (e.g., on GitHub Pages).
 */

/**
 * Simplified article type for client-side search.
 * Compatible with both Article and ClientArticle types.
 */
type SearchableArticle = {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  content?: string;
  contentPreview?: string;
};

/**
 * Performs a client-side search across articles.
 * Searches through title, description, content, category, and tags.
 * 
 * @param {SearchableArticle[]} articles - Array of all articles to search through
 * @param {string} query - Search query string
 * @param {Object} [filters] - Optional filters to narrow search results
 * @param {string} [filters.category] - Filter by category name
 * @param {string[]} [filters.tags] - Filter by tags (articles matching any tag will be returned)
 * @returns {SearchableArticle[]} Array of matching articles, sorted by relevance
 * 
 * @example
 * ```typescript
 * const articles = getAllArticles();
 * const results = clientSearch(articles, 'artificial intelligence', { category: 'Technology' });
 * ```
 */
export function clientSearch<T extends SearchableArticle>(
  articles: T[],
  query: string,
  filters?: {
    category?: string;
    tags?: string[];
  }
): T[] {
  if (!query.trim()) {
    return [];
  }

  const queryLower = query.toLowerCase();

  let filtered = articles.filter((article) => {
    const content = article.content || article.contentPreview || '';
    const matchesQuery =
      article.title.toLowerCase().includes(queryLower) ||
      article.description?.toLowerCase().includes(queryLower) ||
      content.toLowerCase().includes(queryLower) ||
      article.category?.toLowerCase().includes(queryLower) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(queryLower));

    if (!matchesQuery) return false;

    if (filters?.category && article.category !== filters.category) {
      return false;
    }

    if (filters?.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) =>
        article.tags?.includes(tag)
      );
      if (!hasTag) return false;
    }

    return true;
  });

  // Sort by relevance score
  filtered.sort((a, b) => {
    const aScore = getRelevanceScore(a, queryLower);
    const bScore = getRelevanceScore(b, queryLower);
    return bScore - aScore;
  });

  return filtered;
}

/**
 * Calculates a relevance score for an article based on query matches.
 * Higher scores indicate better matches. Scoring weights:
 * - Title match: 10 points
 * - Description match: 5 points
 * - Tag match: 3 points
 * - Category match: 2 points
 * - Content match: 1 point
 * 
 * @param {SearchableArticle} article - The article to score
 * @param {string} query - The search query (should be lowercase)
 * @returns {number} Relevance score (higher is better)
 * 
 * @private
 */
function getRelevanceScore(article: SearchableArticle, query: string): number {
  let score = 0;
  if (article.title.toLowerCase().includes(query)) score += 10;
  if (article.description?.toLowerCase().includes(query)) score += 5;
  if (article.tags?.some((tag) => tag.toLowerCase().includes(query)))
    score += 3;
  if (article.category?.toLowerCase().includes(query)) score += 2;
  const content = article.content || article.contentPreview || '';
  if (content.toLowerCase().includes(query)) score += 1;
  return score;
}

