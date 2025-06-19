# GitHub Pages Configuration Guide

This guide provides step-by-step instructions for configuring GitHub Pages for the publisher subdomain.

## Prerequisites

- GitHub account with access to create and manage repositories
- Repository created at `https://github.com/abhishekjohn84/transitionmarketingai-publisher`
- DNS configured according to the DNS-SETUP.md guide

## GitHub Pages Configuration Steps

### 1. Create GitHub Repository

If you haven't already created the repository:

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter the following information:
   - Repository name: `transitionmarketingai-publisher`
   - Description: "Publisher application for TransitionMarketingAI"
   - Visibility: Choose either Public or Private as appropriate
   - Initialize with a README: Check this option
4. Click "Create repository"

### 2. Push Code to GitHub Repository

If you haven't already pushed the code:

```bash
# Add GitHub remote
git remote add origin https://github.com/abhishekjohn84/transitionmarketingai-publisher.git

# Push to GitHub
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to the GitHub repository settings for `transitionmarketingai-publisher`
2. Navigate to the "Pages" section in the left sidebar
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. Under "Custom domain":
   - Enter `publisher.transitionmarketingai.com`
   - Check the "Enforce HTTPS" option
5. Click "Save"

### 4. Verify GitHub Actions Workflow

1. Go to the "Actions" tab in your GitHub repository
2. Check if the workflow has run successfully
3. If not, click on the workflow to see the error details

### 5. Verify CNAME File

The CNAME file should be automatically created when you set the custom domain in GitHub Pages settings, but you can verify it:

1. Check that the file exists at `public/CNAME` in your repository
2. Ensure it contains only: `publisher.transitionmarketingai.com`

### 6. Wait for GitHub Pages Deployment

1. After pushing code or making changes, wait for the GitHub Actions workflow to complete
2. This typically takes a few minutes

### 7. Wait for SSL Certificate Provisioning

1. GitHub automatically provisions an SSL certificate for your custom domain
2. This can take up to 24 hours to complete
3. The "Enforce HTTPS" option will be automatically checked once the certificate is ready

## Troubleshooting

### Common Issues

1. **Workflow Failures:**
   - Check the GitHub Actions logs for specific error messages
   - Ensure all dependencies are correctly specified in package.json
   - Verify that the workflow file is correctly configured

2. **Custom Domain Not Working:**
   - Verify that the DNS configuration is correct (see DNS-SETUP.md)
   - Check that the CNAME file contains the correct domain name
   - Ensure that GitHub Pages is configured to use the custom domain

3. **HTTPS Not Working:**
   - It can take up to 24 hours for GitHub to provision an SSL certificate
   - Ensure "Enforce HTTPS" is checked in GitHub Pages settings
   - Try accessing the site with `https://` instead of `http://`

## Conclusion

After completing these steps, your publisher application should be accessible at `https://publisher.transitionmarketingai.com`.

If you encounter any issues, please check the [GitHub Pages documentation](https://docs.github.com/en/pages) for more information.

