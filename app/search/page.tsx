import { searchArticles } from '@/lib/search';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

/**
 * Props for the search page component.
 *
 * @interface PageProps
 * @property {Promise<{ q?: string; category?: string; tags?: string }>} searchParams - URL search parameters
 * @property {string} [searchParams.q] - Search query string
 * @property {string} [searchParams.category] - Optional category filter
 * @property {string} [searchParams.tags] - Optional comma-separated tags filter
 */
interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; tags?: string }>;
}

/**
 * Search results page component.
 * Displays search bar and results grid based on query parameters.
 * Supports optional category and tag filters. Shows empty state when no query is provided.
 *
 * @param {PageProps} props - Component props
 * @param {Promise<{ q?: string; category?: string; tags?: string }>} props.searchParams - URL search parameters
 * @returns {Promise<JSX.Element>} Search page with results or empty state
 */
export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category;
  const tags = params.tags?.split(',').filter(Boolean);

  let results: any[] = [];
  if (query) {
    results = await searchArticles(query, {
      category,
      tags,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Search Articles
        </h1>
        <div className="max-w-2xl">
          <SearchBar placeholder="Search for articles..." />
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {results.length > 0
              ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : `No results found for "${query}"`}
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search query to find articles
          </p>
        </div>
      )}
    </div>
  );
}

