import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/markdown';

/**
 * Props for the ArticleCard component.
 *
 * @interface ArticleCardProps
 * @property {Article} article - The article data to display in the card
 */
interface ArticleCardProps {
  article: Article;
}

/**
 * Displays an article as a card with image, title, description, category, and tags.
 * The card is clickable and links to the full article page. Includes hover effects
 * and responsive design with dark mode support.
 *
 * @param {ArticleCardProps} props - Component props
 * @param {Article} props.article - The article to display
 * @returns {JSX.Element} A clickable card component displaying article information
 *
 * @example
 * ```tsx
 * <ArticleCard article={{
 *   slug: 'getting-started',
 *   title: 'Getting Started',
 *   description: 'Learn the basics',
 *   category: 'Guide',
 *   tags: ['tutorial', 'beginner']
 * }} />
 * ```
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {article.image && (
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        {article.category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-2">
            {article.category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {article.description}
          </p>
        )}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

