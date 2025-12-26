import fs from 'fs';
import path from 'path';
import { getAllArticles } from '../lib/markdown';

/**
 * Generates a JSON file with all articles for client-side use.
 * This is needed for static sites where we can't use server-side file system access.
 */

const outputPath = path.join(process.cwd(), 'public', 'articles.json');

async function generateArticlesJson() {
  try {
    const articles = getAllArticles();
    
    // Create a simplified version for client-side (exclude full content to reduce size)
    const clientArticles = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      tags: article.tags,
      date: article.date,
      author: article.author,
      image: article.image,
      // Include first 500 chars of content for search, but not full content
      contentPreview: article.content.substring(0, 500),
    }));

    // Ensure public directory exists
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(clientArticles, null, 2));
    console.log(`✅ Generated ${clientArticles.length} articles to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating articles JSON:', error);
    process.exit(1);
  }
}

generateArticlesJson();

