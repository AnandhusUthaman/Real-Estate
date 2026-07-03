import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl } from '../../utils/seo';

/**
 * Reusable SEO component for managing metadata, social links, and structured data schemas.
 */
export default function SEO({
  title,
  description,
  canonicalPath,
  image = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80',
  type = 'website',
  schema,
  noindex = false,
  keywords
}) {
  const defaultTitle = 'TerraNova Real Estates | Premium Plots & Properties in Kerala';
  const defaultDesc = 'Explore premium residential plots, commercial spaces, and agricultural farm lands in Kowdiar, Kazhakoottam, and Wayanad. Find luxury investments with TerraNova Real Estates.';
  const defaultKeywords = 'real estate Kerala, premium plots Trivandrum, land for sale Kowdiar, commercial land Kazhakoottam, Wayanad coffee plantation, luxury properties Kerala, TerraNova';
  
  const displayTitle = title ? (title.toLowerCase().includes('terranova') ? title : `${title} | TerraNova Real Estates`) : defaultTitle;
  const displayDesc = description || defaultDesc;
  const displayKeywords = keywords || defaultKeywords;
  
  const canonicalUrl = getCanonicalUrl(canonicalPath || '');

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{displayTitle}</title>
      <meta name="description" content={displayDesc} />
      <meta name="keywords" content={displayKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Configuration */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={displayDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="TerraNova Real Estates" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={displayDesc} />
      <meta name="twitter:image" content={image} />
      
      {/* Search Engine Verification Placeholders */}
      <meta name="google-site-verification" content="GOOGLE_SEARCH_CONSOLE_VERIFICATION_ID_PLACEHOLDER" />
      
      {/* Dynamic Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
