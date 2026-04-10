import { Helmet } from "react-helmet-async";

const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://carhub-rentals.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/images/carhub_logo.png`;

export default function SEO({ title, description, path = "", image }) {
  const fullTitle = title
    ? `${title} | CarHub Lagos`
    : "CarHub | Car Rental Lagos Nigeria | Book a Ride Today";

  const fullDescription = description ||
    "Premium car rental in Lagos, Nigeria. Book a saloon, SUV, luxury sedan or bus. Airport transfers, weddings, corporate events. Easy online booking.";

  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
