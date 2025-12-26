'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';
import { clientSearch } from '@/lib/client-search';

/**
 * Represents a simplified article for client-side use.
 */
interface ClientArticle {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  author?: string;
  image?: string;
  contentPreview: string;
}

/**
 * Search results page component (client-side).
 * Displays search bar and results grid based on query parameters.
 * Supports optional category and tag filters. Shows empty state when no query is provided.
 * 
 * This version works entirely client-side for static site deployment.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const tags = searchParams.get('tags')?.split(',').filter(Boolean);
  
  const [articles, setArticles] = useState<ClientArticle[]>([]);
  const [results, setResults] = useState<ClientArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load articles JSON on mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch('/articles.json');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  // Perform search when query or articles change
  useEffect(() => {
    if (articles.length === 0) return;
    
    if (query) {
      const searchResults = clientSearch(articles, query, {
        category,
        tags,
      });
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, category, tags, articles]);

  // Convert client articles to full article format for ArticleCard
  const fullArticles = results.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    tags: article.tags,
    date: article.date,
    author: article.author,
    image: article.image,
    content: article.contentPreview,
    htmlContent: '',
  }));

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

      {isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
        </div>
      )}

      {!isLoading && query && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {results.length > 0
              ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : `No results found for "${query}"`}
          </p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {!isLoading && !query && (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search query to find articles
          </p>
        </div>
      )}
    </div>
  );
}
