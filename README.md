# Hotelverse CMS

Hotel management and sales operations demo for front desk upsell, request management, commissions, and analytics.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hotelverse/cms-demo)

## Overview

Next.js app for the Hotelverse CMS sales module (`/ventas`), including front desk upsell, request management, users & commissions, call center, and sales analytics.

## Deployment

- **Vercel project:** [hotelverse/cms-demo](https://vercel.com/hotelverse/cms-demo)
- **Production URL:** [https://v0-cms-beryl-pi.vercel.app](https://v0-cms-beryl-pi.vercel.app)
- **Repository:** [vladHotelverse/cms-demo](https://github.com/vladHotelverse/cms-demo)

Connect the GitHub repository to the Hotelverse Vercel project under **Project Settings → Git**. Preview deployments are created automatically for pull requests.

## Local development

```bash
vp install
./node_modules/.bin/next dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `vp check` — format, lint, and type checks
- `vp test` — run tests
- `vp run test:e2e` — Playwright end-to-end tests
