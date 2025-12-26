'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientSearch } from '@/lib/client-search';

/**
 * Represents a search result item.
 *
 * @interface SearchResult
 * @property {string} slug - Article slug/identifier
 * @property {string} title - Article title
 * @property {string} [description] - Article description
 * @property {string} [category] - Article category
 */
interface SearchResult {
  slug: string;
  title: string;
  description?: string;
  category?: string;
}

/**
 * Represents a simplified article for client-side search.
 */
interface ClientArticle {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  contentPreview: string;
}

/**
 * Props for the SearchBar component.
 *
 * @interface SearchBarProps
 * @property {(query: string) => void} [onSearch] - Optional callback when search is performed
 * @property {string} [placeholder] - Placeholder text for the search input
 */
interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * Interactive search bar component with autocomplete dropdown.
 * Performs debounced searches (300ms delay) as the user types and displays
 * results in a dropdown. Supports keyboard navigation and click-to-navigate.
 * On form submit, navigates to the full search results page.
 *
 * @param {SearchBarProps} props - Component props
 * @param {(query: string) => void} [props.onSearch] - Optional callback when search is performed
 * @param {string} [props.placeholder='Search articles...'] - Placeholder text for input
 * @returns {JSX.Element} Search input with autocomplete dropdown
 *
 * @example
 * ```tsx
 * <SearchBar placeholder="Search for articles..." />
 * ```
 */
export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search articles...' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [articles, setArticles] = useState<ClientArticle[]>([]);
  const router = useRouter();

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
      }
    };
    loadArticles();
  }, []);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Use client-side search
    try {
      const searchResults = clientSearch(articles, searchQuery);
      const simplifiedResults: SearchResult[] = searchResults.slice(0, 10).map((article) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
      }));
      setResults(simplifiedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [articles]);

  useEffect(() => {
    if (articles.length === 0) return; // Wait for articles to load
    
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, performSearch, articles.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/article/${result.slug}`}
              onClick={() => setShowResults(false)}
              className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {result.title}
              </div>
              {result.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {result.description}
                </div>
              )}
              {result.category && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {result.category}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {showResults && query && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
}

