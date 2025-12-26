# Encyclopedia - Static Site Generator

A modern, fast, and SEO-optimized encyclopedia website built with Next.js, TypeScript, TailwindCSS, and Meilisearch. This platform allows you to create a comprehensive knowledge base from Markdown files with images, featuring powerful search, fast navigation, and excellent SEO.

## Features

- 📝 **Markdown Support**: Write articles in Markdown with frontmatter metadata
- 🖼️ **Image Support**: Include images in your articles with automatic optimization
- 🔍 **Powerful Search**: Fast, typo-tolerant search powered by Meilisearch
- 🚀 **Static Site Generation**: Pre-rendered pages for maximum performance
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎯 **SEO Optimized**: Automatic sitemap, robots.txt, and meta tags
- 🏷️ **Categories & Tags**: Organize content with categories and tags
- ⚡ **Fast Navigation**: Quick access to all content

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Meilisearch** - Fast, open-source search engine
- **React Markdown** - Markdown rendering
- **Gray Matter** - Frontmatter parsing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (for running Meilisearch locally, optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd oehci
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start Meilisearch (using Docker):
```bash
docker run -d -p 7700:7700 getmeili/meilisearch:latest
```

Alternatively, you can install Meilisearch directly or use a cloud service.

5. Initialize the search index:
```bash
npm run init-search
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your encyclopedia.

## Adding Content

### Creating Articles

Create Markdown files in the `content/` directory. Each file should have frontmatter at the top:

```markdown
---
title: Your Article Title
description: A brief description of the article
category: Category Name
tags: [tag1, tag2, tag3]
date: 2024-01-15
author: Author Name
image: /images/article-image.jpg
---

# Your Article Title

Your article content goes here in Markdown format.

## Subheading

You can use all standard Markdown features:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks
```

### Frontmatter Fields

- `title` (required): The article title
- `description` (optional): Brief description for SEO and previews
- `category` (optional): Category for organizing articles
- `tags` (optional): Array of tags
- `date` (optional): Publication date (YYYY-MM-DD format)
- `author` (optional): Author name
- `image` (optional): Path to featured image

### Images

Place images in the `public/images/` directory and reference them in your markdown:

```markdown
![Alt text](/images/your-image.jpg)
```

Or use the `image` field in frontmatter for the featured image.

## Project Structure

```
oehci/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── article/           # Article pages
│   ├── category/          # Category pages
│   ├── search/            # Search page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ArticleCard.tsx
│   ├── ArticleContent.tsx
│   ├── Navigation.tsx
│   └── SearchBar.tsx
├── content/              # Markdown articles
├── lib/                  # Utility functions
│   ├── markdown.ts       # Markdown processing
│   └── search.ts         # Search functionality
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## Building for Production

1. Build the static site:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to platforms like Vercel, Netlify, or any static hosting service.

## Search Configuration

### Meilisearch Setup

The search functionality uses Meilisearch. You can:

1. **Run locally with Docker** (recommended for development):
```bash
docker run -d -p 7700:7700 getmeili/meilisearch:latest
```

2. **Use Meilisearch Cloud**: Sign up at [meilisearch.com](https://www.meilisearch.com) for a hosted solution

3. **Self-host**: Follow the [Meilisearch documentation](https://www.meilisearch.com/docs/learn/getting_started/installation)

### Updating the Search Index

After adding or modifying articles, update the search index:

```bash
npm run init-search
```

## SEO Features

The site includes:

- Automatic sitemap generation (`/sitemap.xml`)
- Robots.txt configuration (`/robots.txt`)
- Open Graph meta tags
- Twitter Card meta tags
- Structured data support
- Semantic HTML

## Customization

### Styling

The site uses TailwindCSS. Customize styles in:
- `app/globals.css`
- Component files in `components/`

### Configuration

- Update `next.config.ts` for Next.js configuration
- Modify `lib/search.ts` for search settings
- Edit `app/layout.tsx` for site metadata

## Performance

- Static site generation for fast page loads
- Image optimization with Next.js Image component
- Efficient search indexing
- Optimized bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own encyclopedia!

## Support

For issues and questions:
- Check the documentation
- Open an issue on GitHub
- Review the code comments

## Roadmap

- [ ] Add RSS feed
- [ ] Implement article versioning
- [ ] Add comment system
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Analytics integration

---

Built with ❤️ using Next.js, TypeScript, and Meilisearch
