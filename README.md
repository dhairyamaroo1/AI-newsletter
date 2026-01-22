# AI Newsletter 🤖

> **Daily AI news, simplified for everyone**

A production-grade newsletter website that automatically fetches the top 5 AI news stories every day, simplifies them using Azure OpenAI, and deploys to GitHub Pages.

## ✨ Features

- 📰 **Daily Updates** - Automatically fetches news at 9 AM IST
- 🤖 **AI-Powered Simplification** - Azure OpenAI translates technical jargon into simple language
- 🌐 **Multiple Sources** - Aggregates from 6 diverse news sources for unbiased coverage
- 📚 **Complete History** - Browse all past newsletter editions
- 🎨 **Premium Design** - Modern dark mode with glassmorphism effects
- 🚀 **Zero Maintenance** - Fully automated with GitHub Actions

## 🏗️ Architecture

```
GitHub Actions (Cron: 9 AM IST)
    ↓
RSS Feed Aggregator (6 sources)
    ↓
Azure OpenAI Content Simplifier
    ↓
JSON Data Generator
    ↓
GitHub Pages (Auto-deploy)
```

## 📦 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js scripts
- **AI**: Azure OpenAI
- **News Sources**: RSS feeds (TechCrunch, MIT Tech Review, VentureBeat, The Verge, Ars Technica, AI News)
- **Hosting**: GitHub Pages
- **Automation**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- Azure OpenAI API key
- GitHub account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ai-newsletter.git
   cd ai-newsletter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
   ```

4. **Run the build script**
   ```bash
   npm run build
   ```

5. **Start local server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000 in your browser

### Testing Individual Scripts

```bash
# Test news fetching
npm run fetch

# Test content simplification (requires .env)
node scripts/simplify-content.js

# Test data generation
node scripts/generate-site.js
```

## 🌐 Deployment to GitHub Pages

See [SETUP.md](SETUP.md) for detailed deployment instructions.

### Quick Deployment Steps

1. Create a new GitHub repository
2. Push this code to the repository
3. Configure GitHub secrets:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
4. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
5. Manually trigger the workflow or wait for the daily schedule

## 📁 Project Structure

```
ai-newsletter/
├── .github/
│   └── workflows/
│       ├── daily-update.yml    # Daily news update automation
│       └── deploy.yml          # GitHub Pages deployment
├── data/
│   └── news.json              # Newsletter data storage
├── public/                    # Static website files
│   ├── css/
│   │   └── styles.css        # Premium design system
│   ├── js/
│   │   ├── app.js           # Main page logic
│   │   └── history.js       # History page logic
│   ├── index.html           # Today's news page
│   └── history.html         # Archive page
├── scripts/
│   ├── fetch-news.js        # RSS feed aggregator
│   ├── simplify-content.js  # Azure OpenAI simplifier
│   ├── generate-site.js     # Data generator
│   └── build.js             # Main orchestrator
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuration

### RSS Feed Sources

Edit the `RSS_FEEDS` environment variable in `.env` to customize news sources:

```env
RSS_FEEDS=https://source1.com/feed,https://source2.com/feed
```

Default sources:
- TechCrunch AI
- MIT Technology Review AI
- VentureBeat AI
- The Verge AI
- Ars Technica
- AI News

### Schedule

The newsletter updates daily at 9:00 AM IST (3:30 AM UTC). To change this, edit the cron schedule in `.github/workflows/daily-update.yml`:

```yaml
schedule:
  - cron: '30 3 * * *'  # Modify this line
```

## 🎨 Customization

### Design

All design tokens are in `public/css/styles.css` under `:root`. Customize colors, fonts, spacing, etc.:

```css
:root {
  --primary: hsl(220, 90%, 56%);
  --accent: hsl(280, 85%, 60%);
  /* ... more variables */
}
```

### Content

Modify the AI simplification prompt in `scripts/simplify-content.js` to adjust the tone and style.

## 📊 Monitoring

- **GitHub Actions**: Check the Actions tab for workflow runs
- **Logs**: View detailed logs in each workflow run
- **Data**: Inspect `data/news.json` for stored newsletter editions

## 🐛 Troubleshooting

### Build fails with "Missing Azure OpenAI configuration"
- Ensure all environment variables are set in GitHub Secrets
- Check that secret names match exactly

### No news fetched
- Verify RSS feeds are accessible
- Check GitHub Actions logs for specific errors
- Some feeds may be temporarily down

### Website not updating
- Verify GitHub Pages is enabled
- Check that the deploy workflow completed successfully
- Clear browser cache

## 📝 License

MIT License - feel free to use this project for your own newsletter!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- News sources: TechCrunch, MIT Technology Review, VentureBeat, The Verge, Ars Technica, AI News
- Powered by Azure OpenAI
- Hosted on GitHub Pages

---

**Made with ❤️ and AI**
