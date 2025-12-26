# Dependencies Documentation

This document provides a comprehensive overview of all dependencies used in this project, their purpose, and how they are utilized throughout the codebase.

## Table of Contents

- [Production Dependencies](#production-dependencies)
- [Development Dependencies](#development-dependencies)

---

## Production Dependencies

### Core Framework

#### `next` (v16.1.1)
**Purpose**: React framework for production with App Router support.

**Usage**:
- Main framework for the entire application
- Used for server-side rendering (SSR) and static site generation (SSG)
- Provides routing, API routes, and build system
- Used in all page components (`app/**/*.tsx`)
- Configuration in `next.config.ts`

**Key Features Used**:
- App Router (`app/` directory structure)
- Static generation with `generateStaticParams()`
- Dynamic metadata with `generateMetadata()`
- API routes (`app/api/search/route.ts`)
- Image optimization (`next/image`)

**Files**:
- `app/**/*.tsx` - All page components
- `next.config.ts` - Next.js configuration

---

#### `react` (v19.2.3) & `react-dom` (v19.2.3)
**Purpose**: React library for building user interfaces.

**Usage**:
- Core UI library for all React components
- Used in all component files (`components/**/*.tsx`)
- Server and client components throughout the app
- React hooks for state management and side effects

**Files**:
- All `.tsx` files in `app/` and `components/`

---

### Markdown Processing

#### `gray-matter` (v4.0.3)
**Purpose**: Parses frontmatter from Markdown files.

**Usage**:
- Extracts YAML frontmatter from Markdown files
- Used in `lib/markdown.ts` to parse article metadata (title, description, category, tags, date, author, image)
- Separates frontmatter from content before processing

**Example**:
```typescript
import matter from 'gray-matter';
const { data, content } = matter(fileContents);
// data contains frontmatter, content contains markdown
```

**Files**:
- `lib/markdown.ts` - Article parsing and processing

---

#### `react-markdown` (v10.1.0)
**Purpose**: React component for rendering Markdown as React components.

**Usage**:
- Renders Markdown content in the browser
- Used in `components/ArticleContent.tsx` to display article content
- Supports custom component rendering (images, links, code blocks)
- Integrates with `remark-gfm` for GitHub Flavored Markdown support

**Example**:
```typescript
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

**Files**:
- `components/ArticleContent.tsx` - Article content rendering

---

#### `remark` (v15.0.1)
**Purpose**: Markdown processor (part of the unified ecosystem).

**Usage**:
- Core processor for transforming Markdown to HTML
- Used in `lib/markdown.ts` in the `processMarkdown()` function
- Chains with `remark-gfm` and `remark-html` plugins
- Part of the unified processing pipeline

**Example**:
```typescript
const processedContent = await remark()
  .use(remarkGfm)
  .use(remarkHtml)
  .process(content);
```

**Files**:
- `lib/markdown.ts` - Markdown to HTML conversion

---

#### `remark-gfm` (v4.0.1)
**Purpose**: GitHub Flavored Markdown plugin for remark.

**Usage**:
- Adds support for GitHub Flavored Markdown features (tables, strikethrough, task lists, etc.)
- Used in both `lib/markdown.ts` and `components/ArticleContent.tsx`
- Enables extended Markdown syntax in articles

**Files**:
- `lib/markdown.ts` - Server-side processing
- `components/ArticleContent.tsx` - Client-side rendering

---

#### `remark-html` (v16.0.1)
**Purpose**: Converts Markdown AST to HTML string.

**Usage**:
- Transforms processed Markdown into HTML string
- Used in `lib/markdown.ts` for server-side Markdown processing
- Part of the remark processing pipeline

**Files**:
- `lib/markdown.ts` - Markdown to HTML conversion

---

#### `rehype` (v13.0.2)
**Purpose**: HTML processor (part of the unified ecosystem).

**Usage**:
- Processes HTML after Markdown conversion
- Used in `lib/markdown.ts` for sanitization and stringification
- Chains with `rehype-raw`, `rehype-sanitize`, and `rehype-stringify`

**Example**:
```typescript
const html = await rehype()
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .process(processedContent.toString());
```

**Files**:
- `lib/markdown.ts` - HTML sanitization

---

#### `rehype-raw` (v7.0.0)
**Purpose**: Allows raw HTML in Markdown (for rehype processing).

**Usage**:
- Enables processing of raw HTML that may exist in Markdown content
- Used in `lib/markdown.ts` before sanitization
- Allows HTML to pass through the rehype pipeline

**Files**:
- `lib/markdown.ts` - HTML processing pipeline

---

#### `rehype-sanitize` (v6.0.0)
**Purpose**: Sanitizes HTML to prevent XSS attacks.

**Usage**:
- Removes potentially dangerous HTML elements and attributes
- Used in `lib/markdown.ts` to ensure safe HTML output
- Critical for security when rendering user-generated or file-based content

**Files**:
- `lib/markdown.ts` - HTML sanitization

---

#### `rehype-stringify` (v10.0.1)
**Purpose**: Converts HTML AST to HTML string.

**Usage**:
- Final step in the HTML processing pipeline
- Converts the processed HTML AST back to a string
- Used in `lib/markdown.ts` after sanitization

**Files**:
- `lib/markdown.ts` - HTML string output

---

#### `unified` (v11.0.5)
**Purpose**: Core processor for unified ecosystem (used by remark and rehype).

**Usage**:
- Underlying processor that powers `remark` and `rehype`
- Not directly imported but used by all remark/rehype plugins
- Provides the unified interface for text processing pipelines

**Note**: This is a peer dependency of the remark/rehype ecosystem and is used indirectly.

---

#### `next-mdx-remote` (v5.0.0)
**Purpose**: Load MDX content from remote sources or strings.

**Usage**:
- Currently installed but **not actively used** in the codebase
- The project uses `react-markdown` instead for Markdown rendering
- May be reserved for future MDX support or was used in a previous version
- Could be used to render MDX files with React components

**Note**: Consider removing if MDX support is not planned.

---

### Search Engine

#### `meilisearch` (v0.54.0)
**Purpose**: Fast, open-source search engine for full-text search.

**Usage**:
- Powers the article search functionality
- Used in `lib/search.ts` for indexing and searching articles
- Provides typo-tolerant, fast search with filtering capabilities
- Initialized with environment variables (`MEILISEARCH_HOST`, `MEILISEARCH_MASTER_KEY`)

**Key Features Used**:
- Index creation and management
- Document indexing with searchable/filterable/sortable attributes
- Full-text search with filters (category, tags)
- Fallback search when Meilisearch is unavailable

**Example**:
```typescript
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});
```

**Files**:
- `lib/search.ts` - Search index initialization and search functions
- `app/api/search/route.ts` - Search API endpoint
- `scripts/init-search.ts` - Search index initialization script

**Setup**:
- Requires Meilisearch server running (Docker, local install, or cloud)
- Initialize with `npm run init-search`

---

## Development Dependencies

### TypeScript

#### `typescript` (v5)
**Purpose**: TypeScript compiler for type checking and compilation.

**Usage**:
- Provides type checking for all `.ts` and `.tsx` files
- Configuration in `tsconfig.json`
- Used during development and build process
- Ensures type safety across the codebase

**Files**:
- `tsconfig.json` - TypeScript configuration
- All `.ts` and `.tsx` files

---

#### `@types/node` (v20)
**Purpose**: TypeScript type definitions for Node.js.

**Usage**:
- Provides type definitions for Node.js built-in modules (`fs`, `path`, `process`, etc.)
- Used in scripts and server-side code
- Enables type checking for Node.js APIs

**Files**:
- `lib/markdown.ts` - File system operations
- `scripts/**/*.ts` - Build and utility scripts

---

#### `@types/react` (v19) & `@types/react-dom` (v19)
**Purpose**: TypeScript type definitions for React and React DOM.

**Usage**:
- Provides type definitions for React components, hooks, and APIs
- Enables type checking for JSX and React components
- Used in all React component files

**Files**:
- All `.tsx` files in `app/` and `components/`

---

### Styling

#### `tailwindcss` (v4)
**Purpose**: Utility-first CSS framework.

**Usage**:
- Primary styling solution for the entire application
- Used via utility classes throughout all components
- Configured via `@import "tailwindcss"` in `app/globals.css`
- Provides responsive design, dark mode, and utility classes

**Example**:
```tsx
<div className="prose prose-lg dark:prose-invert max-w-none">
```

**Files**:
- `app/globals.css` - Tailwind import and theme configuration
- All component files - Utility classes for styling

---

#### `@tailwindcss/postcss` (v4)
**Purpose**: PostCSS plugin for Tailwind CSS v4.

**Usage**:
- PostCSS plugin that processes Tailwind CSS
- Configured in `postcss.config.mjs`
- Transforms Tailwind directives and utilities during build

**Files**:
- `postcss.config.mjs` - PostCSS configuration

---

### Code Quality

#### `eslint` (v9)
**Purpose**: JavaScript and TypeScript linter.

**Usage**:
- Lints code for errors and style issues
- Configured in `eslint.config.mjs`
- Run with `npm run lint`
- Integrates with Next.js-specific rules

**Files**:
- `eslint.config.mjs` - ESLint configuration
- All source files are linted

---

#### `eslint-config-next` (v16.1.1)
**Purpose**: ESLint configuration for Next.js projects.

**Usage**:
- Provides Next.js-specific ESLint rules
- Includes core web vitals and TypeScript rules
- Used in `eslint.config.mjs` to extend Next.js linting rules

**Files**:
- `eslint.config.mjs` - ESLint configuration

---

### Build Tools

#### `tsx` (v4.21.0)
**Purpose**: TypeScript execution engine for running TypeScript files directly.

**Usage**:
- Executes TypeScript files without compilation
- Used in npm scripts to run build and utility scripts
- Enables running `.ts` files directly (e.g., `tsx scripts/init-search.ts`)

**Scripts**:
- `npm run init-search` - Runs `tsx scripts/init-search.ts`
- `npm run generate-articles-json` - Runs `tsx scripts/generate-articles-json.ts`
- `npm run build-and-test` - Runs `tsx scripts/build-and-test-static.ts`

**Files**:
- `scripts/**/*.ts` - All utility scripts

---

## Dependency Relationships

### Markdown Processing Pipeline

The Markdown processing uses a unified pipeline:

1. **Frontmatter Parsing**: `gray-matter` extracts metadata
2. **Markdown Processing**: `remark` + `remark-gfm` + `remark-html` converts Markdown to HTML
3. **HTML Processing**: `rehype` + `rehype-raw` + `rehype-sanitize` + `rehype-stringify` sanitizes HTML
4. **Client Rendering**: `react-markdown` + `remark-gfm` renders Markdown in React components

### Search Architecture

- **Server-side**: `meilisearch` for full-text search (when available)
- **Client-side**: Fallback search in `lib/client-search.ts` (for static sites)
- **API**: Search API route uses `meilisearch` with fallback

### Build Process

1. **TypeScript**: `typescript` compiles `.ts`/`.tsx` files
2. **PostCSS**: `@tailwindcss/postcss` processes CSS
3. **Next.js**: `next` handles bundling and optimization
4. **Scripts**: `tsx` runs utility scripts during build

---

## Environment Variables

Some dependencies require environment variables:

- **Meilisearch**: 
  - `MEILISEARCH_HOST` - Meilisearch server URL
  - `MEILISEARCH_MASTER_KEY` - API key for Meilisearch
- **Next.js**:
  - `NEXT_PUBLIC_BASE_URL` - Base URL for the application

---

## Version Compatibility

- **Next.js 16.1.1** with **React 19.2.3** - Compatible versions
- **Tailwind CSS v4** - Latest major version with new PostCSS plugin
- **TypeScript 5** - Latest stable version
- **Meilisearch 0.54.0** - Recent stable version

---

## Notes

- `next-mdx-remote` is installed but not currently used. Consider removing if MDX support is not needed.
- The project uses both server-side (`remark`/`rehype`) and client-side (`react-markdown`) Markdown processing.
- Meilisearch is optional - the app includes fallback search functionality for static deployments.
- All TypeScript types are properly defined with `@types/*` packages.

