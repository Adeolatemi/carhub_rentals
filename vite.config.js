// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { writeFileSync } from 'fs'
import routes from './src/routes-list.js'

// Update SITE_URL once you have your Vercel domain
const SITE_URL = process.env.VITE_SITE_URL || 'https://carhub-rentals.vercel.app'
const OG_IMAGE = `${SITE_URL}/images/carhub_logo.png`
const TODAY = new Date().toISOString().split('T')[0]

const routeMeta = {
  '/':        { changefreq: 'weekly',  priority: '1.0' },
  '/fleet':   { changefreq: 'weekly',  priority: '0.9' },
  '/booking': { changefreq: 'monthly', priority: '0.9' },
  '/about':   { changefreq: 'monthly', priority: '0.7' },
  '/faqs':    { changefreq: 'monthly', priority: '0.6' },
  '/contact': { changefreq: 'monthly', priority: '0.6' },
  '/login':   { changefreq: 'yearly',  priority: '0.4' },
  '/signup':  { changefreq: 'yearly',  priority: '0.4' },
}

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      const urls = routes.map((route) => {
        const meta = routeMeta[route] || { changefreq: 'monthly', priority: '0.5' }
        return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
      }).join('\n')

      writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`)

      writeFileSync('dist/robots.txt', `User-agent: *
Allow: /
Allow: /assets/
Allow: /*.js$
Allow: /*.css$
Allow: /images/

Disallow: /dashboard
Disallow: /partner
Disallow: /admin
Disallow: /booking/confirm

Sitemap: ${SITE_URL}/sitemap.xml`)

      console.log('✅ sitemap.xml and robots.txt generated in dist/')
    }
  }
}

export default defineConfig({
  plugins: [
    react(),

    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'CarHub | Car Rental Lagos Nigeria | Book a Ride Today',
          description: 'Premium car rental in Lagos, Nigeria. Book a saloon, SUV, luxury sedan or bus with or without a driver. Airport transfers, weddings, corporate events. Easy online booking.',
          keywords: 'car rental Lagos, car hire Nigeria, book a car Lagos, airport transfer Lagos, wedding car hire Nigeria, SUV rental Lagos, luxury car rental Nigeria, CarHub',
          siteUrl: SITE_URL,
          ogImage: OG_IMAGE,
        },
      },
    }),

    sitemapPlugin(),
  ],

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000')
  },

  server: {
    port: 5173,
    proxy: {
      '/auth':          { target: 'http://localhost:5000', changeOrigin: true },
      '/users':         { target: 'http://localhost:5000', changeOrigin: true },
      '/vehicles':      { target: 'http://localhost:5000', changeOrigin: true },
      '/orders':        { target: 'http://localhost:5000', changeOrigin: true },
      '/subscriptions': { target: 'http://localhost:5000', changeOrigin: true },
      '/admin':         { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads':       { target: 'http://localhost:5000', changeOrigin: true },
    }
  },

  base: '/',

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
