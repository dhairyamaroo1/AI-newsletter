const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'news.json');

/**
 * Loads existing news data
 */
async function loadNewsData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('No existing data found, starting fresh');
        return { editions: [] };
    }
}

/**
 * Saves news data to JSON file
 */
async function saveNewsData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Data saved to ${DATA_FILE}`);
}

/**
 * Adds a new edition to the news data
 */
async function addEdition(articles) {
    const newsData = await loadNewsData();

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if today's edition already exists
    const existingIndex = newsData.editions.findIndex(ed => ed.date === today);

    const newEdition = {
        date: today,
        articles: articles.map(article => ({
            title: article.title,
            summary: article.summary,
            simplifiedContent: article.simplifiedContent,
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt
        }))
    };

    if (existingIndex >= 0) {
        // Update existing edition
        console.log(`Updating existing edition for ${today}`);
        newsData.editions[existingIndex] = newEdition;
    } else {
        // Add new edition at the beginning (newest first)
        console.log(`Adding new edition for ${today}`);
        newsData.editions.unshift(newEdition);
    }

    // Keep only last 90 days of history (configurable)
    const maxEditions = 90;
    if (newsData.editions.length > maxEditions) {
        newsData.editions = newsData.editions.slice(0, maxEditions);
        console.log(`Trimmed to last ${maxEditions} editions`);
    }

    await saveNewsData(newsData);

    return newsData;
}

/**
 * Generates the site data
 */
async function generateSite(articles) {
    console.log('\n📰 Generating newsletter site data...');

    if (!articles || articles.length === 0) {
        console.error('❌ No articles provided');
        return;
    }

    console.log(`Processing ${articles.length} articles`);

    const newsData = await addEdition(articles);

    console.log(`\n✅ Site generated successfully!`);
    console.log(`Total editions: ${newsData.editions.length}`);
    console.log(`Latest edition: ${newsData.editions[0].date}`);

    return newsData;
}

// Export for use in other scripts
module.exports = { generateSite, loadNewsData };

// Allow running directly for testing
if (require.main === module) {
    // Test with sample data
    const testArticles = [
        {
            title: 'Test Article 1',
            summary: 'This is a test summary',
            simplifiedContent: 'This is simplified content',
            source: 'Test Source',
            url: 'https://example.com/1',
            publishedAt: new Date().toISOString()
        }
    ];

    generateSite(testArticles)
        .then(() => console.log('✅ Test completed'))
        .catch(error => {
            console.error('❌ Test failed:', error);
            process.exit(1);
        });
}
