import { notFound } from 'next/navigation';
import { getArticlesByCategory, getAllCategories } from '@/lib/markdown';
import ArticleCard from '@/components/ArticleCard';

/**
 * Props for the category page component.
 *
 * @interface PageProps
 * @property {Promise<{ category: string }>} params - Route parameters containing the category name (URL-encoded)
 */
interface PageProps {
  params: Promise<{ category: string }>;
}

/**
 * Generates static paths for all categories at build time.
 * Used by Next.js for static site generation (SSG).
 *
 * @returns {Promise<Array<{ category: string }>>} Array of category objects (URL-encoded) for static generation
 */
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

/**
 * Category page component displaying all articles in a specific category.
 * Shows category name, article count, and a grid of article cards.
 * Returns 404 if category has no articles.
 *
 * @param {PageProps} props - Component props
 * @param {Promise<{ category: string }>} props.params - Route parameters with URL-encoded category name
 * @returns {Promise<JSX.Element>} Category page with article listings
 */
export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const articles = getArticlesByCategory(decodedCategory);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {decodedCategory}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}

