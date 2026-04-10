// Public routes only — used by vite-plugin-sitemap to generate sitemap.xml
// Do NOT include authenticated routes (/dashboard, /partner, /admin, /booking/confirm)
export default [
  '/',
  '/fleet',
  '/booking',
  '/about',
  '/faqs',
  '/contact',
  '/login',
  '/signup',
];
