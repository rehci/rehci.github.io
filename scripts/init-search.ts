import { initializeSearchIndex } from '../lib/search';

/**
 * Main function to initialize the Meilisearch index.
 * Script entry point for setting up the search index with all articles.
 * Exits with code 0 on success, 1 on failure.
 *
 * @returns {Promise<void>} Exits the process when complete
 */
async function main() {
  console.log('Initializing search index...');
  const success = await initializeSearchIndex();
  if (success) {
    console.log('Search index initialized successfully!');
  } else {
    console.log('Search index initialization failed. Make sure Meilisearch is running.');
    console.log('To start Meilisearch locally, run: docker run -d -p 7700:7700 getmeili/meilisearch:latest');
  }
  process.exit(success ? 0 : 1);
}

main();

