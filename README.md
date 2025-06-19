# TransitionMarketingAI Publisher

This repository contains the publisher application for TransitionMarketingAI. The publisher allows administrators to manage website versions, publish new versions, and revert to previous versions if needed.

## Features

- View version history with timestamps and change summaries
- Publish new versions with detailed change notes
- Revert to previous versions when needed
- Secure authentication for administrative access

## Development

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/abhishekjohn84/transitionmarketingai-publisher.git
   cd transitionmarketingai-publisher
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5175
   ```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

## Custom Domain

The application is accessible at:
```
https://publisher.transitionmarketingai.com
```

## License

Proprietary - All rights reserved.

