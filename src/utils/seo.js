/**
 * SEO Utilities for TerraNova Real Estates
 */

/**
 * Convert a string into an SEO-friendly URL slug.
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

/**
 * Generate a consistent SEO-friendly slug for a property based on its title and location.
 */
export const getPropertySlug = (property) => {
  if (!property) return '';
  const firstLocationPart = property.location ? property.location.split(',')[0] : '';
  const combine = `${property.title}-${firstLocationPart}`;
  return slugify(combine);
};

/**
 * Generate the canonical URL for a specific path.
 */
export const getCanonicalUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://www.terranovarealestates.in${cleanPath}`;
};

/**
 * Schema.org Website JSON-LD
 */
export const getWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TerraNova Real Estates",
    "url": "https://www.terranovarealestates.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.terranovarealestates.in/properties?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Schema.org Organization JSON-LD
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TerraNova Real Estates",
    "url": "https://www.terranovarealestates.in",
    "logo": "https://www.terranovarealestates.in/assets/logo.png",
    "sameAs": [
      "https://www.facebook.com/terranovarealestates",
      "https://twitter.com/terranovarealestates",
      "https://www.instagram.com/terranovarealestates"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8089729949",
      "contactType": "sales representative",
      "email": "terranovarealestateoffice@gmail.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Malayalam"]
    }
  };
};

/**
 * Schema.org RealEstateAgent & LocalBusiness JSON-LD (Kerala local SEO)
 */
export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "TerraNova Real Estates",
    "image": "https://www.terranovarealestates.in/assets/logo.png",
    "@id": "https://www.terranovarealestates.in/#agent",
    "url": "https://www.terranovarealestates.in",
    "telephone": "+91-8089729949",
    "email": "terranovarealestateoffice@gmail.com",
    "priceRange": "₹₹-₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kowdiar",
      "addressLocality": "Thiruvananthapuram",
      "addressRegion": "Kerala",
      "postalCode": "695003",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 8.524139,
      "longitude": 76.963472
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };
};

/**
 * Schema.org BreadcrumbList JSON-LD
 */
export const getBreadcrumbSchema = (crumbs = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Schema.org SingleFamilyResidence / RealEstateListing JSON-LD
 */
export const getPropertySchema = (property) => {
  if (!property) return null;
  
  const propertyUrl = getCanonicalUrl(`/properties/${getPropertySlug(property)}`);
  
  // Extract numerical values from mock data
  const bedsCount = parseInt(property.beds, 10) || 0;
  const bathsCount = parseInt(property.baths, 10) || 0;
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": `${property.title} in ${property.location} - TerraNova`,
    "description": property.description || property.tagline,
    "url": propertyUrl,
    "datePosted": "2026-06-01",
    "about": {
      "@type": "SingleFamilyResidence",
      "name": property.title,
      "image": property.img,
      "description": property.description || property.tagline,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.location,
        "addressCountry": "IN"
      },
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.area
      },
      "numberOfBedrooms": bedsCount > 0 ? bedsCount : undefined,
      "numberOfBathroomsTotal": bathsCount > 0 ? bathsCount : undefined,
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "INR"
      }
    }
  };
};
