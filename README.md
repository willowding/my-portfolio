# willowding-portfolio

Personal portfolio site for Willow Ding — bilingual (Chinese / English), built with Next.js 15.

**Live**: https://portfolio-willowding.vercel.app (after first Vercel deploy)

## Stack

- **Next.js 15** (App Router, RSC)
- **React 19**
- **TypeScript**
- **CSS Modules** + design-token system in `src/app/globals.css`
- **Bilingual routing** via `src/middleware.ts` + `src/app/page.tsx` root redirect

## Routes

| Path | Description |
| --- | --- |
| `/` | Root — redirects to `/zh` or `/en` based on `NEXT_PUBLIC_DEFAULT_LANG` |
| `/zh` `/en` | Home |
| `/zh/about` `/en/about` | About |
| `/zh/experience` `/en/experience` | Experience timeline |
| `/zh/work` `/en/work` | Selected work list |
| `/zh/work/picreview` `/en/work/picreview` | PicReview (team image-review tool) |
| `/zh/work/documentary-dedication` `/en/work/documentary-dedication` | Documentary on a community-practice trip |
| `/zh/work/operation-youtube` `/en/work/operation-youtube` | YouTube channel ops |

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

This project is configured to deploy on Vercel out of the box.

1. Import this repo at [vercel.com/new](https://vercel.com/new)
2. **Set Environment Variable** `NEXT_PUBLIC_DEFAULT_LANG=en` (default language: English)
3. Deploy

The root `/` will then redirect to `/en`. To switch the default to Chinese, set the variable to `zh` (or leave it unset).