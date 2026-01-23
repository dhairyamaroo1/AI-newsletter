// History page JavaScript for history.html

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
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Creates an edition card element
 */
function createEditionCard(edition, index) {
  const card = document.createElement('div');
  card.className = 'edition-card';
  card.setAttribute('data-edition-index', index);

  const formattedDate = formatDate(edition.date);
  const articleCount = edition.articles.length;

  card.innerHTML = `
    <div class="edition-header">
      <div class="edition-date">${formattedDate}</div>
      <div class="edition-meta">
        <span>${articleCount} article${articleCount !== 1 ? 's' : ''}</span>
        <span class="edition-toggle">▼</span>
      </div>
    </div>
    <div class="edition-content">
      <div class="edition-articles">
        ${edition.articles.map((article, idx) => `
          <div class="history-article">
            <h3>${idx + 1}. ${escapeHtml(article.title)}</h3>
            <p class="article-source">📰 ${escapeHtml(article.source)}</p>
            <p>${escapeHtml(article.simplifiedContent || article.summary)}</p>
            <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="article-link">
              Read full article
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Add click handler to toggle expansion
  const header = card.querySelector('.edition-header');
  header.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });

  return card;
}

/**
 * Displays error message
 */
function showError(message) {
  const container = document.getElementById('history-container');
  container.innerHTML = `
    <div class="error">
      <h2>⚠️ Oops!</h2>
      <p>${escapeHtml(message)}</p>
      <p>Please try refreshing the page or check back later.</p>
    </div>
  `;
}

/**
 * Loads and displays newsletter history
 */
async function loadHistory() {
  try {
    const response = await fetch('data/news.json');

    if (!response.ok) {
      throw new Error(`Failed to load news data (${response.status})`);
    }

    const data = await response.json();

    if (!data.editions || data.editions.length === 0) {
      showError('No newsletter history available yet. Check back after the first edition!');
      return;
    }

    const container = document.getElementById('history-container');
    container.innerHTML = '';

    // Create cards for all editions
    data.editions.forEach((edition, index) => {
      const card = createEditionCard(edition, index);
      container.appendChild(card);

      // Add stagger animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });

    // Auto-expand the first (most recent) edition
    if (data.editions.length > 0) {
      setTimeout(() => {
        const firstCard = container.querySelector('.edition-card');
        if (firstCard) {
          firstCard.classList.add('expanded');
        }
      }, 500);
    }

  } catch (error) {
    console.error('Error loading history:', error);
    showError('Unable to load newsletter history. Please check your connection and try again.');
  }
}

// Load history when page loads
document.addEventListener('DOMContentLoaded', loadHistory);
