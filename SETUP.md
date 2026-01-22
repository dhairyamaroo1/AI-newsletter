# Deployment Setup Guide

This guide will walk you through deploying your AI Newsletter to GitHub Pages with automated daily updates.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 20+ installed on your local machine
- [ ] Git installed
- [ ] A GitHub account
- [ ] Azure OpenAI API credentials:
  - Endpoint URL
  - API Key
  - Deployment Name

## Step 1: Prepare Azure OpenAI

1. **Get your Azure OpenAI credentials** from the Azure Portal
2. **Note down these values**:
   - `AZURE_OPENAI_ENDPOINT` (e.g., `https://your-resource.openai.azure.com/`)
   - `AZURE_OPENAI_API_KEY` (your API key)
   - `AZURE_OPENAI_DEPLOYMENT_NAME` (your deployment name, e.g., `gpt-4`)

## Step 2: Test Locally (Recommended)

1. **Navigate to the project directory**:
   ```bash
   cd ai-newsletter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` and add your credentials**:
   ```env
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
   ```

5. **Test the build**:
   ```bash
   npm run build
   ```
   
   This should:
   - Fetch news from RSS feeds
   - Simplify content with Azure OpenAI
   - Generate `data/news.json`

6. **Start local server**:
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000 to preview the site

## Step 3: Create GitHub Repository

1. **Go to GitHub** and create a new repository:
   - Name: `ai-newsletter` (or your preferred name)
   - Visibility: **Public** (required for free GitHub Pages)
   - Do NOT initialize with README, .gitignore, or license

2. **Copy the repository URL** (e.g., `https://github.com/YOUR-USERNAME/ai-newsletter.git`)

## Step 4: Initialize Git and Push Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Newsletter website"
   ```

2. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ai-newsletter.git
   git branch -M main
   git push -u origin main
   ```

## Step 5: Configure GitHub Secrets

1. **Go to your repository on GitHub**

2. **Navigate to Settings → Secrets and variables → Actions**

3. **Click "New repository secret"** and add these three secrets:

   **Secret 1:**
   - Name: `AZURE_OPENAI_ENDPOINT`
   - Value: `https://your-resource.openai.azure.com/`
   
   **Secret 2:**
   - Name: `AZURE_OPENAI_API_KEY`
   - Value: Your Azure OpenAI API key
   
   **Secret 3:**
   - Name: `AZURE_OPENAI_DEPLOYMENT_NAME`
   - Value: Your deployment name (e.g., `gpt-4`)

4. **Verify all three secrets are added**

## Step 6: Enable GitHub Pages

1. **Go to Settings → Pages**

2. **Under "Build and deployment"**:
   - Source: Select **GitHub Actions**

3. **Save** (if there's a save button)

## Step 7: Trigger First Deployment

### Option A: Manual Trigger (Recommended for first run)

1. **Go to Actions tab** in your repository

2. **Click on "Daily Newsletter Update"** workflow

3. **Click "Run workflow"** → Select `main` branch → **Run workflow**

4. **Wait for the workflow to complete** (usually 2-5 minutes)

5. **Check the "Deploy to GitHub Pages" workflow** also runs automatically

### Option B: Wait for Scheduled Run

The workflow will automatically run at 9:00 AM IST (3:30 AM UTC) every day.

## Step 8: Verify Deployment

1. **Go to Settings → Pages** to find your site URL:
   - Usually: `https://YOUR-USERNAME.github.io/ai-newsletter/`

2. **Open the URL** in your browser

3. **Verify**:
   - Today's news is displayed
   - History page works
   - All links function correctly
   - Design looks premium

## Step 9: Monitor and Maintain

### Daily Monitoring

- **Check GitHub Actions** tab for workflow runs
- **Review logs** if any failures occur
- **Verify** the site updates daily at 9 AM IST

### Troubleshooting

**Workflow fails with authentication error:**
- Verify GitHub secrets are set correctly
- Check Azure OpenAI credentials are valid
- Ensure API key has not expired

**No news fetched:**
- Check RSS feeds are accessible
- Review workflow logs for specific errors
- Some feeds may be temporarily down

**Site not updating:**
- Verify both workflows completed successfully
- Check GitHub Pages is enabled
- Clear browser cache and hard refresh

**Rate limiting errors:**
- Azure OpenAI may have rate limits
- Consider adding delays between API calls
- Check your Azure quota

## Customization After Deployment

### Change Update Schedule

Edit `.github/workflows/daily-update.yml`:

```yaml
schedule:
  - cron: '30 3 * * *'  # Change this line
```

Use [crontab.guru](https://crontab.guru/) to generate cron expressions.

### Add/Remove News Sources

Edit `.env` (locally) or add `RSS_FEEDS` secret in GitHub:

```env
RSS_FEEDS=https://source1.com/feed,https://source2.com/feed
```

### Customize Design

Edit `public/css/styles.css` and push changes to GitHub.

## Cost Considerations

### Free Tier Limits

- **GitHub Actions**: 2,000 minutes/month (free)
- **GitHub Pages**: 100 GB bandwidth/month (free)
- **Azure OpenAI**: Pay-per-use (varies by model)

### Estimated Costs

- **GitHub**: $0 (within free tier)
- **Azure OpenAI**: ~$0.10-0.50 per day (depends on model and usage)

## Security Best Practices

1. **Never commit `.env` file** (it's in `.gitignore`)
2. **Use GitHub Secrets** for all sensitive data
3. **Regularly rotate API keys**
4. **Monitor API usage** in Azure Portal
5. **Enable 2FA** on your GitHub account

## Next Steps

- ✅ Bookmark your newsletter URL
- ✅ Share with friends and colleagues
- ✅ Monitor daily updates
- ✅ Customize design and content to your liking
- ✅ Consider adding email notifications (future enhancement)

## Getting Help

- **Issues**: Open an issue on GitHub
- **Logs**: Check GitHub Actions logs for detailed error messages
- **Azure**: Review Azure OpenAI documentation for API issues

---

**Congratulations! Your AI Newsletter is now live! 🎉**

Visit your site daily at 9 AM IST to see fresh AI news, simplified for everyone.
