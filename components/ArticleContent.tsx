import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

/**
 * Props for the ArticleContent component.
 *
 * @interface ArticleContentProps
 * @property {string} content - Raw Markdown content to render
 */
interface ArticleContentProps {
  content: string;
}

/**
 * Renders Markdown content as formatted HTML with custom styling.
 * Supports GitHub Flavored Markdown (GFM) features like tables, strikethrough, etc.
 * Customizes rendering for images (using Next.js Image component), links, and code blocks.
 *
 * @param {ArticleContentProps} props - Component props
 * @param {string} props.content - Raw Markdown content to render
 * @returns {JSX.Element} Rendered article content with prose styling
 *
 * @example
 * ```tsx
 * <ArticleContent content="# Hello World\n\nThis is **bold** text." />
 * ```
 */
export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => {
            // Handle images with Next.js Image component
            // Ensure src is a string (not a Blob) for Next.js Image component
            const src = typeof props.src === 'string' ? props.src : undefined;
            if (src) {
              return (
                <div className="my-8">
                  <Image
                    src={src}
                    alt={props.alt || ''}
                    width={800}
                    height={600}
                    className="rounded-lg w-full h-auto"
                    unoptimized={src.startsWith('http')}
                  />
                </div>
              );
            }
            return <img {...props} />;
          },
          a: ({ node, ...props }) => {
            return (
              <a
                {...props}
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          },
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

