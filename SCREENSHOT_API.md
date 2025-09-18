# Screenshot API Instructions

Since client-side screenshot libraries are unreliable, here's how to set up a proper screenshot API:

## Option 1: Deploy Screenshot API to Vercel/Netlify

Create a new repository with this API:

```typescript
// pages/api/screenshot.ts (for Vercel)
import puppeteer from 'puppeteer'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { html, css, width = 800, height = 600 } = req.body

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: 2 })

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; background: #000; width: ${width}px; height: ${height}px; overflow: hidden; }
            ${css}
          </style>
        </head>
        <body>${html}</body>
      </html>
    `

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' })
    
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width, height }
    })

    await browser.close()

    const base64 = Buffer.from(screenshot).toString('base64')
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64}`
    })

  } catch (error) {
    res.status(500).json({ error: 'Screenshot failed' })
  }
}
```

## Option 2: Use Online Screenshot Services

Replace the API call in your Vue app with:

```typescript
// Use htmlcsstoimage.com API
const response = await fetch('https://hcti.io/v1/image', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa('user_id:api_key'),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    html: html,
    css: css,
    google_fonts: 'Inter',
    viewport_width: 800,
    viewport_height: 600
  })
})
```

## Option 3: Simple Workaround (Current Implementation)

Your current code has a fallback that creates a simple canvas. For now, the download button will show this fallback since there's no API endpoint.

To test with real screenshots:
1. Deploy the Puppeteer API above to Vercel
2. Update the fetch URL in your Vue app to point to your deployed API
3. Perfect screenshots every time!

## Deployment Commands:

```bash
# Create new Next.js project for API
npx create-next-app@latest screenshot-api
cd screenshot-api
npm install puppeteer

# Add the API code above to pages/api/screenshot.ts
# Deploy to Vercel
npm install -g vercel
vercel
```

Then update your Vue app's fetch URL to: `https://your-api.vercel.app/api/screenshot`
