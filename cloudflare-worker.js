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
    
    <!-- Verification Tags -->
    <meta name="msvalidate.01" content="C1F510BC681B6D2B8165EE8F9C66440F" />
    <meta name="google-site-verification" content="sEj_pW-wClPiqNvs39-2pSvvw_llINa9GhKcqiEBGLk" />
    
    <!-- SEO Meta Tags -->
    <title>Indiversa Storefront Builder | WhatsApp Magic Link Generator</title>
    <meta name="description" content="Create your professional digital storefront in seconds. Indiversa helps Maheshtala and Kolkata businesses generate WhatsApp magic links for seamless ordering." />
    <meta name="keywords" content="WhatsApp store, storefront builder Maheshtala, Kolkata digital marketing, WhatsApp magic link, Indiversa" />
    <link rel="canonical" href="https://indiversa-storefront-builder.hasislam2010.workers.dev/" />

    <!-- JSON-LD Schema (Bing loves this) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Indiversa Storefront Builder",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Maheshtala",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        },
        "description": "Empowering local businesses with zero-cost WhatsApp storefronts.",
        "url": "https://indiversa-storefront-builder.hasislam2010.workers.dev/"
      }
    </script>
    <!-- Keep the rest of your head tags, CSS, and JS here -->
  </head>
  <body>
    <!-- 1. The SEO Content Block (Visible to Crawlers) -->
    <div id="seo-content" style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>Indiversa Storefront Builder: Create WhatsApp Ordering Links</h1>
      <p>Build your professional storefront and generate magic links for direct WhatsApp orders in Maheshtala and Kolkata.</p>
    </div>

    <!-- 2. The React Root -->
    <div id="root">
        <!-- Rendered App Content Goes Here -->
    </div>

    <!-- 3. The Script to swap SEO content for your App -->
    <script>
      // When the React app (root) has content, hide the SEO loading text
      const observer = new MutationObserver(() => {
        if (document.getElementById('root').children.length > 0) {
          document.getElementById('seo-content').style.display = 'none';
          observer.disconnect();
        }
      });
      observer.observe(document.getElementById('root'), { childList: true });
    </script>
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
