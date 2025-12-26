import Link from 'next/link';
import { getAllArticles, getAllCategories } from '@/lib/markdown';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

/**
 * Home page component displaying the encyclopedia landing page.
 * Shows a hero section with search bar, category grid, featured articles,
 * and recent articles sorted by date. Handles empty state when no articles exist.
 *
 * @returns {JSX.Element} Home page with hero, categories, and article listings
 */
export default function Home() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const featuredArticles = articles.slice(0, 6);
  const recentArticles = articles
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to the Encyclopedia
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Discover knowledge across thousands of topics. Search, explore, and learn.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No articles yet. Add markdown files to the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">content</code> directory.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Check the README for instructions on adding content.
          </p>
        </div>
      )}
    </div>
  );
}
