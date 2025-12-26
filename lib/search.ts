import { MeiliSearch } from 'meilisearch';
import { Article, getAllArticles } from './markdown';

// Initialize Meilisearch client
// For production, you'd want to use environment variables
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

const INDEX_NAME = 'encyclopedia';

/**
 * Initializes the Meilisearch index for article search.
 * Creates the index if it doesn't exist, configures searchable/filterable/sortable
 * attributes, and indexes all articles from the content directory.
 *
 * @returns {Promise<boolean>} True if initialization succeeded, false otherwise.
 *                             Returns false if Meilisearch is unavailable (e.g., not running).
 *
 * @example
 * ```typescript
 * const success = await initializeSearchIndex();
 * if (success) {
 *   console.log('Search index ready!');
 * } else {
 *   console.log('Meilisearch not available');
 * }
 * ```
 */
export async function initializeSearchIndex() {
  try {
    // Check if index exists, create if not
    const indexes = await client.getIndexes();
    const indexExists = indexes.results.some((idx) => idx.uid === INDEX_NAME);

    if (!indexExists) {
      await client.createIndex(INDEX_NAME, { primaryKey: 'slug' });
    }

    const index = client.index(INDEX_NAME);

    // Configure searchable attributes
    await index.updateSearchableAttributes([
      'title',
      'description',
      'content',
      'category',
      'tags',
    ]);

    // Configure filterable attributes
    await index.updateFilterableAttributes(['category', 'tags']);

    // Configure sortable attributes
    await index.updateSortableAttributes(['date', 'title']);

    // Index all articles
    const articles = getAllArticles();
    const documents = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description || '',
      content: article.content.substring(0, 5000), // Limit content length for search
      category: article.category || '',
      tags: article.tags || [],
      date: article.date || '',
      author: article.author || '',
      image: article.image || '',
    }));

    if (documents.length > 0) {
      await index.addDocuments(documents);
    }

    return true;
  } catch (error) {
    console.error('Error initializing search index:', error);
    // In development, if Meilisearch is not running, we'll continue without it
    return false;
  }
}

/**
 * Searches articles using Meilisearch with optional filters.
 * Performs a full-text search across article titles, descriptions, content, categories, and tags.
 * Falls back to a simple text search if Meilisearch is unavailable.
 *
 * @param {string} query - Search query string
 * @param {Object} [filters] - Optional filters to narrow search results
 * @param {string} [filters.category] - Filter by category name
 * @param {string[]} [filters.tags] - Filter by tags (articles matching any tag will be returned)
 * @returns {Promise<Article[]>} Array of matching articles, sorted by relevance
 *
 * @example
 * ```typescript
 * // Simple search
 * const results = await searchArticles('artificial intelligence');
 *
 * // Search with category filter
 * const techResults = await searchArticles('machine learning', { category: 'Technology' });
 *
 * // Search with tag filter
 * const aiResults = await searchArticles('AI', { tags: ['AI', 'machine-learning'] });
 * ```
 */
export async function searchArticles(query: string, filters?: {
  category?: string;
  tags?: string[];
}): Promise<Article[]> {
  try {
    const index = client.index(INDEX_NAME);

    let searchParams: any = {
      limit: 50,
    };

    if (filters) {
      const filterArray: string[] = [];
      if (filters.category) {
        filterArray.push(`category = "${filters.category}"`);
      }
      if (filters.tags && filters.tags.length > 0) {
        filterArray.push(
          filters.tags.map((tag) => `tags = "${tag}"`).join(' OR ')
        );
      }
      if (filterArray.length > 0) {
        searchParams.filter = filterArray.join(' AND ');
      }
    }

    const results = await index.search(query, searchParams);
    const articles = getAllArticles();
    
    // Map search results back to full articles
    return results.hits
      .map((hit) => articles.find((a) => a.slug === hit.slug))
      .filter((article): article is Article => article !== undefined);
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to simple text search if Meilisearch is unavailable
    return fallbackSearch(query, filters);
  }
}

/**
 * Fallback search function when Meilisearch is unavailable.
 * Performs a simple case-insensitive text search across article fields
 * and applies category/tag filters. Results are sorted by relevance score.
 *
 * @param {string} query - Search query string
 * @param {Object} [filters] - Optional filters to narrow search results
 * @param {string} [filters.category] - Filter by category name
 * @param {string[]} [filters.tags] - Filter by tags
 * @returns {Article[]} Array of matching articles, sorted by relevance
 *
 * @private
 */
function fallbackSearch(query: string, filters?: {
  category?: string;
  tags?: string[];
}): Article[] {
  const articles = getAllArticles();
  const queryLower = query.toLowerCase();

  let filtered = articles.filter((article) => {
    const matchesQuery =
      article.title.toLowerCase().includes(queryLower) ||
      article.description?.toLowerCase().includes(queryLower) ||
      article.content.toLowerCase().includes(queryLower) ||
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

  // Simple relevance scoring
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
 * - Content match: 1 point
 *
 * @param {Article} article - The article to score
 * @param {string} query - The search query (should be lowercase)
 * @returns {number} Relevance score (higher is better)
 *
 * @private
 */
function getRelevanceScore(article: Article, query: string): number {
  let score = 0;
  if (article.title.toLowerCase().includes(query)) score += 10;
  if (article.description?.toLowerCase().includes(query)) score += 5;
  if (article.tags?.some((tag) => tag.toLowerCase().includes(query)))
    score += 3;
  if (article.content.toLowerCase().includes(query)) score += 1;
  return score;
}

