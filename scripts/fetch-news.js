require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'AI-Newsletter-Bot/1.0'
    }
});

// RSS feed sources for AI news
const RSS_FEEDS = process.env.RSS_FEEDS
    ? process.env.RSS_FEEDS.split(',')
    : [
        'https://techcrunch.com/tag/artificial-intelligence/feed/',
        'https://www.technologyreview.com/topic/artificial-intelligence/feed',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        'https://feeds.arstechnica.com/arstechnica/technology-lab',
        'https://www.artificialintelligence-news.com/feed/'
    ];

/**
 * Fetches articles from a single RSS feed
 */
async function fetchFromFeed(feedUrl) {
    try {
        console.log(`Fetching from: ${feedUrl}`);
        const feed = await parser.parseURL(feedUrl);

        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || item.isoDate),
            content: item.contentSnippet || item.content || item.description || '',
            source: feed.title || new URL(feedUrl).hostname,
            guid: item.guid || item.link
        }));
    } catch (error) {
        console.error(`Error fetching ${feedUrl}:`, error.message);
        return [];
    }
}

/**
 * Filters articles from the last 24 hours
 */
function filterRecentArticles(articles) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return articles.filter(article => {
        return article.pubDate >= yesterday;
    });
}

/**
 * Ranks articles by relevance (AI-related keywords)
 */
function rankArticles(articles) {
    const aiKeywords = [
        'artificial intelligence', 'ai', 'machine learning', 'ml', 'deep learning',
        'neural network', 'gpt', 'llm', 'large language model', 'generative ai',
        'chatbot', 'openai', 'anthropic', 'google ai', 'microsoft ai',
        'computer vision', 'nlp', 'natural language', 'transformer',
        'ai model', 'ai research', 'ai ethics', 'ai regulation'
    ];

    return articles.map(article => {
        const text = `${article.title} ${article.content}`.toLowerCase();
        const score = aiKeywords.reduce((count, keyword) => {
            return count + (text.includes(keyword) ? 1 : 0);
        }, 0);

        return { ...article, relevanceScore: score };
    }).sort((a, b) => {
        // Sort by relevance score first, then by date
        if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
        }
        return b.pubDate - a.pubDate;
    });
}

/**
 * Main function to fetch top 5 AI news
 */
async function fetchNews() {
    try {
        console.log('Starting news fetch from multiple RSS feeds...');

        // Fetch from all feeds in parallel
        const feedPromises = RSS_FEEDS.map(url => fetchFromFeed(url));
        const feedResults = await Promise.all(feedPromises);

        // Flatten all articles into one array
        const allArticles = feedResults.flat();
        console.log(`Total articles fetched: ${allArticles.length}`);

        // Filter for recent articles (last 24 hours)
        const recentArticles = filterRecentArticles(allArticles);
        console.log(`Recent articles (last 24h): ${recentArticles.length}`);

        // Rank by AI relevance
        const rankedArticles = rankArticles(recentArticles);

        // Select top 5
        const top5 = rankedArticles.slice(0, 5);

        console.log('\nTop 5 AI News Stories:');
        top5.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title} (${article.source}) - Score: ${article.relevanceScore}`);
        });

        return top5.map(article => ({
            title: article.title,
            url: article.link,
            publishedAt: article.pubDate.toISOString(),
            source: article.source,
            summary: article.content.substring(0, 300) + '...',
            guid: article.guid
        }));

    } catch (error) {
        console.error('Error in fetchNews:', error);
        throw error;
    }
}

// Export for use in other scripts
module.exports = { fetchNews };

// Allow running directly
if (require.main === module) {
    fetchNews()
        .then(articles => {
            console.log('\n✅ News fetch completed successfully');
            console.log(JSON.stringify(articles, null, 2));
        })
        .catch(error => {
            console.error('❌ News fetch failed:', error);
            process.exit(1);
        });
}
