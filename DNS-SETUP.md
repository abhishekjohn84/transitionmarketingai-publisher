# DNS Configuration Guide for Publisher Subdomain

This guide provides step-by-step instructions for configuring the DNS records for the publisher subdomain.

## Prerequisites

- Access to your domain's DNS management panel
- GitHub repository created at `https://github.com/abhishekjohn84/transitionmarketingai-publisher`
- Repository configured with GitHub Pages

## DNS Configuration Steps

### 1. Add CNAME Record

Add a CNAME record for the publisher subdomain pointing to your GitHub Pages domain:

| Type  | Host/Name           | Value/Target               | TTL     |
|-------|---------------------|----------------------------|---------|
| CNAME | publisher           | abhishekjohn84.github.io   | 3600    |

Notes:
- The "Host/Name" field might only require `publisher` (without the domain) depending on your DNS provider
- Some DNS providers might require a trailing dot at the end of the target value
- TTL (Time To Live) can be set to 3600 seconds (1 hour) or lower for faster propagation

### 2. Verify DNS Configuration

After adding the CNAME record, you can verify it using the `dig` command:

```bash
dig publisher.transitionmarketingai.com CNAME
```

The output should show a CNAME record pointing to `abhishekjohn84.github.io`.

### 3. Wait for DNS Propagation

DNS changes can take time to propagate across the internet. This can range from a few minutes to 48 hours, depending on your DNS provider and previous TTL settings.

## GitHub Pages Configuration

### 1. Configure Custom Domain in GitHub Pages

1. Go to the GitHub repository settings for `transitionmarketingai-publisher`
2. Navigate to the "Pages" section
3. Under "Custom domain", enter `publisher.transitionmarketingai.com`
4. Check the "Enforce HTTPS" option
5. Click "Save"

### 2. Verify CNAME File

Ensure that the CNAME file in the repository contains:

```
publisher.transitionmarketingai.com
```

This file should be automatically created when you set the custom domain in GitHub Pages settings, but it's good to verify.

## Troubleshooting

### Common Issues

1. **DNS Not Propagated:**
   - Use [dnschecker.org](https://dnschecker.org) to check if the CNAME record is visible from different locations
   - Wait longer for propagation to complete

2. **GitHub Pages Not Serving Custom Domain:**
   - Verify that the CNAME file exists in the repository
   - Check that the custom domain is correctly set in GitHub Pages settings
   - Ensure the GitHub Pages site is being built correctly (check Actions tab)

3. **SSL Certificate Issues:**
   - It can take up to 24 hours for GitHub to provision an SSL certificate for your custom domain
   - Ensure "Enforce HTTPS" is checked in GitHub Pages settings

## Conclusion

After completing these steps and waiting for DNS propagation, your publisher application should be accessible at `https://publisher.transitionmarketingai.com`.

If you encounter any issues, please check the GitHub Pages documentation or contact your DNS provider for assistance.

