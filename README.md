# YouStylize Community

Welcome to the community version of YouStylize, a web platform that leverages AI for photo style transfer and image editing. This repository contains the open-source codebase for running your own instance of YouStylize.

## About YouStylize

YouStylize is an innovative tool that allows users to transform photos with AI-driven style transfer and perform advanced image editing. This community version brings the core functionality to developers and enthusiasts who want to explore, contribute, or deploy their own version of the platform.

## Environment Configuration

To run this project, you need to configure the following environment variables. Create a .env file in the root directory and add:

```
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_CUSTOM_HOST=
FAL_API_KEY=
```

Ensure you have valid credentials for Cloudflare R2 and a FAL API key to enable full functionality.
Getting Started

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
