require('dotenv').config();
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

if (!endpoint || !apiKey || !deploymentName) {
    console.error('❌ Missing Azure OpenAI configuration. Please check your .env file.');
    console.error('Required: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME');
    process.exit(1);
}

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

/**
 * Simplifies technical AI news content for non-technical readers
 */
async function simplifyArticle(article) {
    const prompt = `You are an expert at explaining complex AI and technology concepts to non-technical readers.

Your task: Rewrite the following AI news article in simple, everyday language that anyone can understand.

Guidelines:
- Use simple words and short sentences
- Avoid technical jargon (or explain it in parentheses if necessary)
- Focus on what this means for everyday people
- Keep it engaging and interesting
- Length: 150-200 words
- Maintain the key facts and importance of the story

Original Article:
Title: ${article.title}
Source: ${article.source}
Content: ${article.summary}

Write a simplified version that a non-technical person would easily understand:`;

    try {
        console.log(`Simplifying: "${article.title.substring(0, 50)}..."`);

        const response = await client.getChatCompletions(deploymentName, [
            {
                role: 'system',
                content: 'You are a helpful assistant that explains complex AI topics in simple, accessible language for non-technical readers.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], {
            temperature: 0.7,
            maxTokens: 300,
            topP: 0.9
        });

        const simplifiedContent = response.choices[0].message.content.trim();

        return {
            ...article,
            simplifiedContent
        };

    } catch (error) {
        console.error(`Error simplifying article "${article.title}":`, error.message);
        // Fallback to original summary if AI fails
        return {
            ...article,
            simplifiedContent: article.summary
        };
    }
}

/**
 * Simplifies multiple articles
 */
async function simplifyArticles(articles) {
    console.log(`\nSimplifying ${articles.length} articles with Azure OpenAI...`);

    const simplifiedArticles = [];

    // Process articles sequentially to avoid rate limits
    for (const article of articles) {
        const simplified = await simplifyArticle(article);
        simplifiedArticles.push(simplified);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ All articles simplified successfully');
    return simplifiedArticles;
}

// Export for use in other scripts
module.exports = { simplifyArticles, simplifyArticle };

// Allow running directly for testing
if (require.main === module) {
    // Test with sample article
    const testArticle = {
        title: 'OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities',
        source: 'TechCrunch',
        summary: 'OpenAI has announced the release of GPT-5, featuring advanced reasoning capabilities through a new chain-of-thought architecture. The model demonstrates significant improvements in mathematical problem-solving and logical inference tasks.',
        url: 'https://example.com/test',
        publishedAt: new Date().toISOString(),
        guid: 'test-123'
    };

    simplifyArticle(testArticle)
        .then(result => {
            console.log('\n📝 Original:', result.summary);
            console.log('\n✨ Simplified:', result.simplifiedContent);
        })
        .catch(error => {
            console.error('❌ Test failed:', error);
            process.exit(1);
        });
}
