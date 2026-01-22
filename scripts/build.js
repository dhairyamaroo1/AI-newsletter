require('dotenv').config();
const { fetchNews } = require('./fetch-news');
const { simplifyArticles } = require('./simplify-content');
const { generateSite } = require('./generate-site');

/**
 * Main build script that orchestrates the entire pipeline
 */
async function build() {
    console.log('🚀 Starting AI Newsletter Build Pipeline...\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Fetch news from RSS feeds
        console.log('\n📡 Step 1: Fetching AI news from multiple sources...');
        const articles = await fetchNews();

        if (!articles || articles.length === 0) {
            console.error('❌ No articles found. Exiting.');
            process.exit(1);
        }

        console.log(`✅ Fetched ${articles.length} articles`);

        // Step 2: Simplify content with Azure OpenAI
        console.log('\n🤖 Step 2: Simplifying content with Azure OpenAI...');
        const simplifiedArticles = await simplifyArticles(articles);
        console.log(`✅ Simplified ${simplifiedArticles.length} articles`);

        // Step 3: Generate site data
        console.log('\n📝 Step 3: Generating newsletter data...');
        const newsData = await generateSite(simplifiedArticles);
        console.log(`✅ Newsletter data generated`);

        // Success summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ BUILD COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`\n📊 Summary:`);
        console.log(`   - Articles fetched: ${articles.length}`);
        console.log(`   - Articles simplified: ${simplifiedArticles.length}`);
        console.log(`   - Total editions: ${newsData.editions.length}`);
        console.log(`   - Latest edition: ${newsData.editions[0].date}`);
        console.log(`\n🌐 Ready for deployment!`);

    } catch (error) {
        console.error('\n❌ BUILD FAILED!');
        console.error('Error:', error.message);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
}

// Run the build
build();
