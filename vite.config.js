// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import routes from './src/routes-list.js'

// Environment Variables
const SITE_URL =
  process.env.VITE_SITE_URL || 'https://carhub-rentals.vercel.app'

const API_URL =
  process.env.VITE_API_URL || 'http://localhost:5000'

const OG_IMAGE = `${SITE_URL}/images/carhub_logo.png`
const TODAY = new Date().toISOString().split('T')[0]

// Route SEO Metadata
const routeMeta = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/fleet': { changefreq: 'weekly', priority: '0.9' },
  '/booking': { changefreq: 'monthly', priority: '0.9' },
  '/about': { changefreq: 'monthly', priority: '0.7' },
  '/faqs': { changefreq: 'monthly', priority: '0.6' },
  '/contact': { changefreq: 'monthly', priority: '0.6' },
  '/login': { changefreq: 'yearly', priority: '0.4' },
  '/signup': { changefreq: 'yearly', priority: '0.4' },
}

// Sitemap + Robots Generator Plugin
function sitemapPlugin() {
  return {
    name: 'generate-sitemap',

    closeBundle() {
      try {
        const distDir = resolve(process.cwd(), 'dist')

        // Ensure dist directory exists
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true })
          console.log('📁 Created dist directory')
        }

        // Generate sitemap URLs
        const urls = routes
          .map((route) => {
            const meta = routeMeta[route] || {
              changefreq: 'monthly',
              priority: '0.5',
            }

            return `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
          })
          .join('')

        // sitemap.xml content
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

        // robots.txt content
        const robotsContent = `User-agent: *
Allow: /
Allow: /assets/
Allow: /images/

Disallow: /dashboard
Disallow: /partner
Disallow: /admin
Disallow: /booking/confirm

Sitemap: ${SITE_URL}/sitemap.xml
`

        // Write files
        writeFileSync(resolve(distDir, 'sitemap.xml'), sitemapContent)
        writeFileSync(resolve(distDir, 'robots.txt'), robotsContent)

        console.log('✅ sitemap.xml and robots.txt generated successfully')
      } catch (error) {
        console.error('❌ Sitemap generation failed:', error)
      }
    },
  }
}

// API Proxy Helper
const proxyConfig = {
  target: API_URL,
  changeOrigin: true,
}

// Export Config
export default defineConfig({
  plugins: [
    react(),

    createHtmlPlugin({
      minify: true,

      inject: {
        data: {
          title: 'CarHub | Car Rental Lagos Nigeria | Book a Ride Today',

          description:
            'Premium car rental in Lagos, Nigeria. Book saloon cars, SUVs, luxury sedans, and buses with or without a driver. Airport transfers, weddings, and corporate events.',

          keywords:
            'car rental Lagos, car hire Nigeria, SUV rental Lagos, airport transfer Lagos, luxury car rental Nigeria, CarHub',

          siteUrl: SITE_URL,
          ogImage: OG_IMAGE,
        },
      },
    }),

    sitemapPlugin(),
  ],

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
  },

  server: {
    port: 5173,

    proxy: {
      '/auth': proxyConfig,
      '/users': proxyConfig,
      '/vehicles': proxyConfig,
      '/orders': proxyConfig,
      '/subscriptions': proxyConfig,
      '/admin': proxyConfig,
      '/uploads': proxyConfig,
    },
  },

  base: '/',

  build: {
    outDir: 'dist',

    rollupOptions: {
      output: {
        // Clean hashed filenames
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },

    // Better production optimization
    sourcemap: false,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
})