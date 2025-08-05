# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Daily Database Roasts is a static website generator that creates satirical roasts of database blog posts. It fetches RSS feeds, uses Google's Gemini AI to generate humorous commentary, and builds a static site with Eleventy that's deployed to GitHub Pages at db-grill.com.

## Essential Commands

```bash
# Development server with hot reloading
npm start

# Build static site for production
npm run build
```

## Architecture & Key Components

### Core Data Flow
1. **RSS Fetching & AI Processing** (`_data/roasts.js`):
   - Fetches articles from feeds configured in `_data/feeds.json`
   - Checks `_cache/roasts.json` to avoid reprocessing
   - Sends new articles to Gemini API with satirical prompt
   - Updates cache and returns sorted roasts array to Eleventy

2. **Static Site Generation**:
   - `index.njk` - Paginated list view (10 roasts per page)
   - `roast.njk` - Individual roast pages
   - `_includes/base.njk` - Base layout with all CSS styling
   - `.eleventy.js` - Configures markdown rendering, slugification, and date formatting

3. **Automated Deployment** (`.github/workflows/deploy.yml`):
   - Builds and deploys on push to main
   - Runs every 6 hours to fetch new content
   - Commits cache updates back to repository

### Key Technical Details

- **Rate Limiting**: 1-second delay between Gemini API calls in `_data/roasts.js`
- **Caching Strategy**: Uses article URL as key, persists between builds
- **Error Handling**: Graceful failures for API calls and RSS feeds
- **Article Limits**: Processes max 2 articles per feed per build
- **Environment**: Requires `GEMINI_API_KEY` in `.env` file

### UI Features
- Collapsible roast text with CSS transitions
- Responsive design embedded in base.njk
- Individual permalink pages for each roast

## Testing

No formal testing infrastructure exists. The project relies on manual testing and the simplicity of static site generation.

## Development Notes

- All styling is inline in `_includes/base.njk`
- The Gemini prompt creates "The DB Detractor" persona
- Cache file is committed to repository for continuity
- GitHub Actions requires `GEMINI_API_KEY` as repository secret