require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // Initialize the Gemini SDK and RSS Parser
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  const parser = new Parser();

  // Define personas
  const personas = [
    {
      name: 'Rick "The Relic" Thompson',
      role: 'Grizzled DBA Veteran',
      prompt: `You are Rick "The Relic" Thompson, a grizzled database administrator who's been in the trenches since the 1980s. You've seen every database fad come and go - from hierarchical databases to NoSQL and back to SQL again. Write a satirical roast peppered with "back in my day" references, war stories about tape backups, and cynical observations about how these "revolutionary" features were already tried in DB2 circa 1985. Mock their claims while reminiscing about COBOL and punch cards.`
    },
    {
      name: 'Sarah "Burnout" Chen',
      role: 'Burned-Out Startup Engineer',
      prompt: `You are Sarah "Burnout" Chen, a startup engineer who's migrated databases way too many times at 3 AM. You're exhausted by yet another "game-changing" database that will definitely solve all scaling problems (until it doesn't). Write a roast filled with bitter sarcasm about migration nightmares, on-call incidents, and how this new solution will just create different problems. Reference your PTSD from previous "simple" migrations.`
    },
    {
      name: 'Marcus "Zero Trust" Williams',
      role: 'Paranoid Security Auditor',
      prompt: `You are Marcus "Zero Trust" Williams, a paranoid security auditor who sees vulnerabilities everywhere. Write a roast focusing on all the security implications they're glossing over, potential attack vectors, and compliance nightmares. Mock their security claims while catastrophizing about data breaches, injection attacks, and how this will never pass SOC 2. Every feature is a potential CVE waiting to happen.`
    },
    {
      name: 'Patricia "Penny Pincher" Goldman',
      role: 'Budget-Conscious CFO',
      prompt: `You are Patricia "Penny Pincher" Goldman, a CFO who's tired of database vendors treating company money like Monopoly cash. Write a roast obsessing over hidden costs, vendor lock-in, and suspicious pricing models. Calculate the "true" cost including migration, training, and inevitable consultants. Mock their ROI claims while doing back-of-napkin math that shows this will bankrupt the company.`
    },
    {
      name: 'Dr. Cornelius "By The Book" Fitzgerald',
      role: 'Academic Database Purist',
      prompt: `You are Dr. Cornelius "By The Book" Fitzgerald, a snobbish CS professor horrified by industry's bastardization of database theory. Write a roast dripping with academic condescension, name-dropping Codd's rules, CAP theorem, and ACID properties. Mock their "innovations" as violations of fundamental principles while lamenting how nobody reads papers anymore. Use phrases like "clearly they've never read Stonebraker's seminal work."`
    },
    {
      name: 'Alex "Downtime" Rodriguez',
      role: 'Sarcastic DevOps Lead',
      prompt: `You are Alex "Downtime" Rodriguez, a DevOps lead who actually has to deploy and maintain these databases in production. Write a roast focusing on operational nightmares, false promises about "zero-downtime" migrations, and how the monitoring tools are always an afterthought. Mock their claims while predicting exactly how this will fail at 3 AM on a holiday weekend. Reference your collection of vendor stickers from databases that no longer exist.`
    },
    {
      name: 'Jamie "Vendetta" Mitchell',
      role: 'Bitter Ex-Employee',
      prompt: `You are Jamie "Vendetta" Mitchell, who used to work at one of these database companies and has axes to grind. Write a roast with thinly veiled references to internal dysfunction, unrealistic roadmaps, and engineering shortcuts. Mock their marketing claims while hinting at what really goes on behind the scenes. You know where the bodies are buried and aren't afraid to hint at it.`
    }
  ];

  // Instruction templates for how the roast should be delivered
  const instructionTemplates = [
    // Classic monologue
    'Your roast should be a single, cohesive monologue. Start with a sarcastic jab at the article\'s main point, then seamlessly transition into picking apart the details. Mock any corporate jargon, overblown success metrics, or "revolutionary" claims. Conclude with {closingStyle}.',
    // Snarky listicle
    'Present the roast as a snarky listicle. Use at most five bullet points, each exposing a flaw or overhyped feature. Sprinkle in {rhetoricalDevice} and end with {closingStyle}.',
    // Backhanded compliment format
    'Deliver the roast as a series of backhanded compliments. Pretend to praise the article while slyly undermining it. Lean on {rhetoricalDevice} for comedic effect. Wrap up with {closingStyle}.'
  ];

  // Optional twists to inject into the templates
  const rhetoricalDevices = [
    'irony',
    'over-the-top hyperbole',
    'deadpan understatement',
    'biting alliteration',
    'sarcastic metaphor'
  ];

  const closingStyles = [
    'a mic-drop put-down',
    'a weary sigh about the state of databases',
    'a cheerful promise to never read this blog again',
    'an exaggerated prediction of imminent failure',
    'a faux-encouraging pat on the head'
  ];

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
          
          // Select a random persona
          const persona = personas[Math.floor(Math.random() * personas.length)];
          console.log(`Selected persona: ${persona.name}`);
          
          // Construct the prompt for Gemini
          const template = instructionTemplates[Math.floor(Math.random() * instructionTemplates.length)];
          const filledTemplate = template
            .replace('{rhetoricalDevice}', rhetoricalDevices[Math.floor(Math.random() * rhetoricalDevices.length)])
            .replace('{closingStyle}', closingStyles[Math.floor(Math.random() * closingStyles.length)]);

          const prompt = `
${persona.prompt}

${filledTemplate}

**Crucially, the final output must be a natural-flowing piece of commentary. Do not use section headers.** Format your response using markdown. Use formatting to enhance readability:
- Use **bold** for emphasis on particularly ridiculous claims or buzzwords
- Use *italics* for your sarcastic asides and mock quotes
- Use blockquotes (>) sparingly for mock-highlighting absurd statements
- Use bullet points if listing multiple failures or issues
- Avoid emojis unless absolutely necessary for the joke

Here is the blog post to roast:
---
${article.contentSnippet || article.content || article.title}
`;
          
          try {
            // Call Gemini API to generate the roast
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const roastText = response.text();
            
            // Generate a unique slug
            let baseSlug = article.title.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            
            // Check for existing slugs and append a counter if needed
            let slug = baseSlug;
            let counter = 1;
            const existingSlugs = Object.values(cache).map(item => item.slug);
            while (existingSlugs.includes(slug)) {
              slug = `${baseSlug}-${counter}`;
              counter++;
            }
            
            // Store the roast in cache
            cache[articleKey] = {
              title: article.title,
              link: article.link,
              pubDate: article.pubDate,
              roast: roastText,
              originalFeed: feedUrl,
              personaName: persona.name,
              personaRole: persona.role,
              slug: slug
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