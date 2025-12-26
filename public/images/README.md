# Images Directory

Place your article images in this directory.

## Usage

Reference images in your markdown files:

```markdown
![Alt text](/images/your-image.jpg)
```

Or use the `image` field in frontmatter for featured images:

```yaml
---
image: /images/featured-image.jpg
---
```

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- SVG (.svg)

Images are automatically optimized by Next.js Image component.

