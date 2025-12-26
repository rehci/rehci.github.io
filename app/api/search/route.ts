import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/search';

// For static export, return empty results (static site uses client-side search)
export const dynamic = 'force-static';

/**
 * API route handler for article search.
 * Handles GET requests with search query parameters and optional filters.
 * Returns simplified article results (slug, title, description, category) for autocomplete.
 *
 * Note: This route returns empty results in static export. The static site uses client-side search instead.
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
  // For static export, return empty results without accessing searchParams
  // This allows the route to be statically generated
  // The static site uses client-side search instead of this API route
  try {
    // Try to access searchParams, but if we're in static build, this will fail
    // and we'll return empty results
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

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
    // During static build, searchParams access fails, return empty results
    // This is expected - the static site uses client-side search
    return NextResponse.json({ results: [] });
  }
}

