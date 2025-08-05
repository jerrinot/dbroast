# Daily Database Roasts

A static website that generates satirical roasts of database blog posts using the Google Gemini API and Eleventy static site generator.

## Features

- Fetches articles from RSS feeds
- Generates witty, satirical roasts using Google Gemini AI
- Caches processed articles to avoid duplicate API calls
- Builds a static HTML site using Eleventy
- Ready for deployment on GitHub Pages

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Google Gemini API Key

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 3. Configure RSS Feeds (Optional)

Edit `_data/feeds.json` to add or modify RSS feed URLs:

```json
{
  "urls": [
    "https://www.mongodb.com/blog/rss",
    "https://www.cockroachlabs.com/blog/rss.xml",
    "https://your-favorite-db-blog.com/rss"
  ]
}
```

### 4. Development

Start the development server:

```bash
npm start
```

This will:
- Fetch new articles from RSS feeds
- Generate roasts for any new articles using Gemini
- Build the static site
- Start a local server with hot reloading

### 5. Build for Production

```bash
npm run build
```

The static site will be generated in the `_site/` directory.

## GitHub Pages Deployment

### Setting up GitHub Actions

1. **Add your API key as a repository secret:**
   - In your GitHub repository, go to Settings → Secrets and Variables → Actions
   - Add a new repository secret:
     - Name: `GEMINI_API_KEY`
     - Value: Your Google Gemini API key

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

3. **The workflow is already configured** in `.github/workflows/deploy.yml` and will:
   - Build and deploy on every push to main
   - Run every 6 hours to fetch new articles automatically
   - Can be triggered manually from the Actions tab

### Features

- **Automatic deployment** on code changes
- **Scheduled builds** every 6 hours to fetch new articles
- **Manual triggers** available in GitHub Actions
- **Proper permissions** for GitHub Pages deployment
- **Artifact caching** for faster builds

## How It Works

1. **RSS Parsing**: The `_data/roasts.js` script fetches articles from configured RSS feeds
2. **Caching**: Articles are cached in `_cache/roasts.json` to avoid reprocessing
3. **AI Roasting**: New articles are sent to Google Gemini with a satirical prompt
4. **Static Generation**: Eleventy builds a static HTML site displaying all roasts
5. **Responsive Design**: The site includes mobile-friendly CSS styling

## Project Structure

```
/
├── .eleventy.js         # Eleventy configuration
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── README.md           # This file
├── _data/
│   ├── feeds.json      # RSS feed URLs
│   └── roasts.js       # Main script for fetching and roasting
├── _includes/
│   └── base.njk        # Base HTML template
├── _cache/
│   └── roasts.json     # Cached roasts (auto-generated)
├── _site/              # Generated static site (auto-generated)
└── index.njk           # Homepage template
```

## Customization

- **Add more feeds**: Edit `_data/feeds.json`
- **Modify the roasting prompt**: Edit the prompt in `_data/roasts.js`
- **Change styling**: Modify the CSS in `_includes/base.njk`
- **Adjust build frequency**: Modify the cron schedule in GitHub Actions

## Rate Limiting

The script includes a 1-second delay between API calls to respect Google Gemini's rate limits. Adjust this in `_data/roasts.js` if needed.

## Troubleshooting

- **No roasts showing**: Check that your `GEMINI_API_KEY` is set correctly
- **API errors**: Ensure your Gemini API key has sufficient quota
- **RSS feed errors**: Check that the feed URLs in `feeds.json` are accessible
- **Build failures**: Check the console output for specific error messages