import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllSlugs } from '@/lib/markdown';
import ArticleContent from '@/components/ArticleContent';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Props for the article page component.
 *
 * @interface PageProps
 * @property {Promise<{ slug: string }>} params - Route parameters containing the article slug
 */
interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generates static paths for all articles at build time.
 * Used by Next.js for static site generation (SSG).
 *
 * @returns {Promise<Array<{ slug: string }>>} Array of slug objects for static generation
 */
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generates metadata for the article page for SEO.
 * Creates dynamic meta tags including Open Graph and Twitter Card data.
 *
 * @param {PageProps} props - Component props
 * @param {Promise<{ slug: string }>} props.params - Route parameters with article slug
 * @returns {Promise<Metadata>} Next.js metadata object with title, description, and social tags
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Encyclopedia`,
    description: article.description || article.title,
    keywords: article.tags?.join(', '),
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      type: 'article',
      images: article.image ? [article.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || article.title,
      images: article.image ? [article.image] : [],
    },
  };
}

/**
 * Article detail page component.
 * Displays a single article with full content, metadata, breadcrumbs,
 * featured image, tags, and formatted date. Returns 404 if article not found.
 *
 * @param {PageProps} props - Component props
 * @param {Promise<{ slug: string }>} props.params - Route parameters with article slug
 * @returns {Promise<JSX.Element>} Full article page with content and metadata
 */
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
          Home
        </Link>
        {article.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${encodeURIComponent(article.category)}`}
              className="hover:text-gray-900 dark:hover:text-white"
            >
              {article.category}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        {article.category && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            {article.category}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>
        {article.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {article.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {article.date && (
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {article.author && <span>By {article.author}</span>}
        </div>
      </header>

      {/* Article Image */}
      {article.image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ArticleContent content={article.content} />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

