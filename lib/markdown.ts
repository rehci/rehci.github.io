import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { rehype } from 'rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

/**
 * Represents an article in the encyclopedia.
 * Articles are parsed from Markdown files with frontmatter metadata.
 *
 * @interface Article
 * @property {string} slug - URL-friendly identifier derived from filename
 * @property {string} title - Article title (from frontmatter or filename)
 * @property {string} [description] - Brief description for SEO and previews
 * @property {string} [category] - Category for organizing articles
 * @property {string[]} [tags] - Array of tags for categorization
 * @property {string} [date] - Publication date in YYYY-MM-DD format
 * @property {string} [author] - Author name
 * @property {string} content - Raw markdown content
 * @property {string} htmlContent - Processed HTML content (currently unused, processed on-demand)
 * @property {string} [image] - Path to featured image
 */
export interface Article {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  author?: string;
  content: string;
  htmlContent: string;
  image?: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Retrieves all articles from the content directory.
 * Reads all Markdown (.md and .mdx) files, parses their frontmatter,
 * and returns an array of Article objects.
 *
 * @returns {Article[]} Array of all articles found in the content directory.
 *                      Returns empty array if content directory doesn't exist.
 *
 * @example
 * ```typescript
 * const articles = getAllArticles();
 * console.log(`Found ${articles.length} articles`);
 * ```
 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        date: data.date,
        author: data.author,
        image: data.image,
        content,
        htmlContent: '', // Will be processed when needed
      };
    });

  return articles;
}

/**
 * Retrieves a single article by its slug.
 * The slug corresponds to the filename without the .md or .mdx extension.
 *
 * @param {string} slug - The article slug (filename without extension)
 * @returns {Article | null} The article if found, null otherwise
 *
 * @example
 * ```typescript
 * const article = getArticleBySlug('getting-started');
 * if (article) {
 *   console.log(article.title);
 * }
 * ```
 */
export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}

/**
 * Processes Markdown content into sanitized HTML.
 * Converts Markdown to HTML using remark with GitHub Flavored Markdown support,
 * then sanitizes the HTML using rehype to prevent XSS attacks.
 *
 * @param {string} content - Raw Markdown content to process
 * @returns {Promise<string>} Sanitized HTML string
 *
 * @example
 * ```typescript
 * const html = await processMarkdown('# Hello World\n\nThis is **bold** text.');
 * // Returns: '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>'
 * ```
 */
export async function processMarkdown(content: string): Promise<string> {
  // Process markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  // Process HTML with rehype for sanitization
  const html = await rehype()
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(processedContent.toString());

  return html.toString();
}

/**
 * Retrieves all article slugs (URL-friendly identifiers).
 * Useful for generating static paths in Next.js.
 *
 * @returns {string[]} Array of all article slugs
 *
 * @example
 * ```typescript
 * const slugs = getAllSlugs();
 * // Returns: ['getting-started', 'artificial-intelligence', 'quantum-computing']
 * ```
 */
export function getAllSlugs(): string[] {
  const articles = getAllArticles();
  return articles.map((article) => article.slug);
}

/**
 * Filters articles by category.
 * Returns all articles that match the specified category name.
 *
 * @param {string} category - The category name to filter by (case-sensitive)
 * @returns {Article[]} Array of articles in the specified category
 *
 * @example
 * ```typescript
 * const techArticles = getArticlesByCategory('Technology');
 * console.log(`Found ${techArticles.length} technology articles`);
 * ```
 */
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((article) => article.category === category);
}

/**
 * Retrieves all unique categories from all articles.
 * Extracts categories from article frontmatter and returns a deduplicated list.
 *
 * @returns {string[]} Array of unique category names, sorted alphabetically
 *
 * @example
 * ```typescript
 * const categories = getAllCategories();
 * // Returns: ['Guide', 'Technology']
 * ```
 */
export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = articles
    .map((article) => article.category)
    .filter((cat): cat is string => Boolean(cat));
  return [...new Set(categories)];
}

