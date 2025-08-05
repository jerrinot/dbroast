require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // Initialize the Gemini SDK and RSS Parser
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
  const parser = new Parser();

  // Define cache file path
  const cacheFilePath = path.join(__dirname, '..', '_cache', 'roasts.json');
  
  // Read existing cache or initialize empty object
  let cache = {};
  try {
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = fs.readFileSync(cacheFilePath, 'utf8');
      cache = JSON.parse(cacheData);
    }
  } catch (error) {
    console.log('No existing cache found or error reading cache, starting fresh:', error.message);
    cache = {};
  }

  // Read feed URLs from feeds.json
  const feedsData = require('./feeds.json');
  const feedUrls = feedsData.urls;

  // Process each feed
  for (const feedUrl of feedUrls) {
    try {
      console.log(`Processing feed: ${feedUrl}`);
      
      // Parse the RSS feed
      const feed = await parser.parseURL(feedUrl);
      
      // Process each article in the feed (limit to 2 per feed)
      for (const article of feed.items.slice(0, 2)) {
        const articleKey = article.link || article.guid;
        
        // Check if article is already in cache
        if (!cache[articleKey]) {
          console.log(`Processing new article: ${article.title}`);
          
          // Construct the prompt for Gemini
          const prompt = `You are a cynical and witty tech commentator. Your job is to roast this blog post. Be satirical, funny, and slightly absurd. Format your response using markdown with paragraphs, emphasis, and lists where appropriate. Here is the blog post content: ${article.contentSnippet || article.content || article.title}`;
          
          try {
            // Call Gemini API to generate the roast
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const roastText = response.text();
            
            // Store the roast in cache
            cache[articleKey] = {
              title: article.title,
              link: article.link,
              pubDate: article.pubDate,
              roast: roastText,
              originalFeed: feedUrl,
              slug: article.title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            };
            
            console.log(`Generated roast for: ${article.title}`);
            
            // Add delay to avoid rate limiting (1 second)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (apiError) {
            console.error(`Error generating roast for article "${article.title}":`, apiError.message);
            // Continue with next article instead of failing completely
            continue;
          }
        }
      }
      
    } catch (feedError) {
      console.error(`Error processing feed ${feedUrl}:`, feedError.message);
      // Continue with next feed
      continue;
    }
  }

  // Save updated cache back to file
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
    console.log('Cache updated successfully');
  } catch (saveError) {
    console.error('Error saving cache:', saveError.message);
  }

  // Return the roasts as an array for Eleventy to use
  return Object.values(cache).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
};