import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/search';

/**
 * API route handler for article search.
 * Handles GET requests with search query parameters and optional filters.
 * Returns simplified article results (slug, title, description, category) for autocomplete.
 *
 * @param {NextRequest} request - Next.js request object with search parameters
 * @returns {Promise<NextResponse>} JSON response with search results or error
 *
 * @example
 * GET /api/search?q=artificial%20intelligence
 * GET /api/search?q=machine%20learning&category=Technology
 * GET /api/search?q=AI&tags=AI,machine-learning
 *
 * Response format:
 * {
 *   results: [
 *     {
 *       slug: 'artificial-intelligence',
 *       title: 'Artificial Intelligence',
 *       description: 'An overview of AI...',
 *       category: 'Technology'
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const tags = searchParams.get('tags')?.split(',').filter(Boolean);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchArticles(query, {
      category,
      tags,
    });

    // Return simplified results for the search API
    const simplifiedResults = results.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
    }));

    return NextResponse.json({ results: simplifiedResults });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

