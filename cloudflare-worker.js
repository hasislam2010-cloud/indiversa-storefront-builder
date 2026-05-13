// cloudflare-worker.js
// Copy and deploy this code to Cloudflare Workers

const INDEXNOW_KEY = 'YOUR_INDEXNOW_KEY_HERE'; // Replace with your actual IndexNow key
const SITE_URL = 'https://indiversa-storefront-builder.hasislam2010.workers.dev/';

// PASTE YOUR COMPLETE STATIC HTML HERE
// (You can copy the raw index.html after running a build in Vite/AI Studio and paste it inside these backticks)
const HTML_CONTENT = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="msvalidate.01" content="C1F510BC681B6D2B8165EE8F9C66440F" />
    <meta name="google-site-verification" content="sEj_pW-wClPiqNvs39-2pSvvw_llINa9GhKcqiEBGLk" />
    <link rel="canonical" href="https://indiversa-storefront-builder.hasislam2010.workers.dev/" />
    <title>Indiversa Storefront Builder</title>
    <!-- Keep the rest of your head tags, CSS, and JS here -->
  </head>
  <body>
    <div id="root">
        <!-- Rendered App Content Goes Here -->
    </div>
  </body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route: robots.txt
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\n\nSitemap: https://indiversa-storefront-builder.hasislam2010.workers.dev/sitemap.xml', {
        headers: {
          'content-type': 'text/plain',
        },
      });
    }

    // Route: Ping Bing IndexNow API
    if (url.pathname === '/ping-bing') {
      const bingIndexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(SITE_URL)}&key=${INDEXNOW_KEY}`;
      
      try {
        const bingResponse = await fetch(bingIndexNowUrl);
        if (bingResponse.ok) {
          return new Response('Successfully pinged Bing IndexNow with URL: ' + SITE_URL, { status: 200 });
        } else {
          return new Response(`Bing ping failed with status ${bingResponse.status}`, { status: bingResponse.status });
        }
      } catch (error) {
        return new Response(`Error pinging Bing: ${error.message}`, { status: 500 });
      }
    }

    // Route: Sitemap XML
    if (url.pathname === '/sitemap.xml') {
      const currentDate = new Date().toISOString().split('T')[0];
      const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      return new Response(sitemapXML, {
        headers: {
          'content-type': 'application/xml;charset=UTF-8',
        },
      });
    }

    // Default Route: Serve the Static HTML Landing Page
    return new Response(HTML_CONTENT, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};
