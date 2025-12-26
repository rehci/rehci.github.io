# Deployment Guide: Static Site on GitHub Pages

This guide will help you deploy your Next.js encyclopedia as a static site on GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm/pnpm installed

## Overview

GitHub Pages only serves static files, so we need to:
1. Configure Next.js to export a static site
2. Set up GitHub Actions to automatically build and deploy
3. Handle search functionality client-side (since API routes won't work)

## Step 1: Configure Your Repository

### Option A: Deploy to `username.github.io` (Root Domain)

If you want to deploy to `https://yourusername.github.io`:
- Create a repository named `yourusername.github.io` (replace `yourusername` with your GitHub username)
- The site will be available at the root URL

### Option B: Deploy to Project Subdirectory

If you want to deploy to `https://yourusername.github.io/repository-name`:
- Use any repository name
- The site will be available at `/repository-name/`

**Note:** The GitHub Actions workflow is configured to automatically detect your repository name and set the correct base path.

## Step 2: Update Next.js Configuration

The `next.config.ts` file has been updated to support static export. It includes:
- `output: 'export'` for static site generation
- Automatic `basePath` and `assetPrefix` configuration based on repository name
- Image optimization settings for static export

**Note:** The build process automatically generates a `public/articles.json` file that contains all articles for client-side search. This file is required for search functionality on the static site.

## Step 3: Set Up GitHub Repository

1. **Create a new repository on GitHub** (or use an existing one)

2. **Initialize git in your project** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Add your GitHub repository as remote**:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. The GitHub Actions workflow will automatically deploy your site

## Step 5: Build and Deploy

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Run on every push to the `main` branch
- Install dependencies
- Build the static site
- Deploy to the `gh-pages` branch
- Make your site available at `https://yourusername.github.io/repository-name`

## Step 6: Verify Deployment

After pushing your code:
1. Go to **Actions** tab in your GitHub repository
2. Wait for the workflow to complete (usually 2-3 minutes)
3. Visit your site at the GitHub Pages URL

## Important Notes

### Search Functionality

Since GitHub Pages is static, the search API route (`/api/search`) won't work. The site has been configured to use **client-side search** instead:
- Search works entirely in the browser
- No server or Meilisearch instance required
- All articles are loaded and searched client-side
- This works well for small to medium-sized content collections

### Environment Variables

If you need environment variables for build time, you can:
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets
3. Access them in the GitHub Actions workflow

### Custom Domain

To use a custom domain:
1. Add a `CNAME` file to the `public` folder with your domain name
2. Configure DNS settings as per GitHub Pages documentation
3. The workflow will automatically copy the CNAME file during deployment

## Troubleshooting

### Build Fails

- Check the **Actions** tab for error messages
- Ensure all dependencies are listed in `package.json`
- Verify that `next.config.ts` is correctly configured

### 404 Errors on Navigation

- This usually happens if `basePath` is not set correctly
- Check that the repository name matches in the workflow file
- For root domain (`username.github.io`), the basePath should be empty

### Search Not Working

- Ensure you're using the client-side search (the updated SearchBar component)
- Check browser console for errors
- Verify that article data is being loaded correctly

### Images Not Loading

- Ensure image paths are relative, not absolute
- Check that images are in the `public` folder
- Verify `next.config.ts` image configuration

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. **Build the static site**:
   ```bash
   npm run build
   # or
   pnpm build
   ```

2. **The output will be in the `out` directory**

3. **Push the `out` directory to the `gh-pages` branch**:
   ```bash
   git subtree push --prefix out origin gh-pages
   ```

However, using GitHub Actions (automatic deployment) is recommended.

## Updating Your Site

Simply push changes to the `main` branch:
```bash
git add .
git commit -m "Update content"
git push
```

GitHub Actions will automatically rebuild and redeploy your site.

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

