# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Meilisearch

### Option A: Using Docker (Recommended for Development)

```bash
docker run -d -p 7700:7700 getmeili/meilisearch:latest
```

### Option B: Using Meilisearch Cloud

1. Sign up at [meilisearch.com](https://www.meilisearch.com)
2. Create a new project
3. Get your host URL and API key
4. Update `.env` file with your credentials

### Option C: Install Locally

Follow the [Meilisearch installation guide](https://www.meilisearch.com/docs/learn/getting_started/installation)

## 3. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Meilisearch configuration:

```env
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=your-master-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Initialize Search Index

```bash
npm run init-search
```

This will:
- Create the search index
- Index all articles from the `content/` directory
- Configure searchable and filterable attributes

## 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Adding New Articles

1. Create a new `.md` file in the `content/` directory
2. Add frontmatter with article metadata
3. Write your content in Markdown
4. Run `npm run init-search` to update the search index

## Updating Search Index

After adding or modifying articles, update the search index:

```bash
npm run init-search
```

## Building for Production

```bash
npm run build
npm start
```

Or deploy to Vercel, Netlify, or any static hosting service.

