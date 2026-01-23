// Main app JavaScript for index.html

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
        return 'Recently';
    }
}

/**
 * Creates an article card element
 */
function createArticleCard(article, index) {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.setAttribute('role', 'article');

    const relativeTime = formatRelativeTime(article.publishedAt);

    card.innerHTML = `
    <div class="article-header">
      <div class="article-number">${index + 1}</div>
      <div class="article-meta">
        <h2 class="article-title">${escapeHtml(article.title)}</h2>
        <div class="article-source">${escapeHtml(article.source)} • ${relativeTime}</div>
      </div>
    </div>
    <div class="article-content">
      ${escapeHtml(article.simplifiedContent || article.summary)}
    </div>
    <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="article-link">
      Read full article
    </a>
  `;

    return card;
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Displays error message
 */
function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `
    <div class="error">
      <h2>⚠️ Oops!</h2>
      <p>${escapeHtml(message)}</p>
      <p>Please try refreshing the page or check back later.</p>
    </div>
  `;
}

/**
 * Loads and displays today's news
 */
async function loadTodayNews() {
    try {
        const response = await fetch('data/news.json');

        if (!response.ok) {
            throw new Error(`Failed to load news data (${response.status})`);
        }

        const data = await response.json();

        if (!data.editions || data.editions.length === 0) {
            showError('No news available yet. Check back soon!');
            return;
        }

        // Get the latest edition (first in array)
        const latestEdition = data.editions[0];

        // Update date badge
        const dateElement = document.getElementById('current-date');
        dateElement.textContent = formatDate(latestEdition.date);

        // Display articles
        const container = document.getElementById('news-container');
        container.innerHTML = '';

        if (!latestEdition.articles || latestEdition.articles.length === 0) {
            showError('No articles found for today.');
            return;
        }

        latestEdition.articles.forEach((article, index) => {
            const card = createArticleCard(article, index);
            container.appendChild(card);

            // Add stagger animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

    } catch (error) {
        console.error('Error loading news:', error);
        showError('Unable to load news. Please check your connection and try again.');
    }
}

// Load news when page loads
document.addEventListener('DOMContentLoaded', loadTodayNews);
