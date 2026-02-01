import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update page title
    document.title = config.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', config.description);
      document.head.appendChild(metaDescription);
    }

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', config.ogTitle || config.title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', config.ogTitle || config.title);
      document.head.appendChild(ogTitle);
    }

    // Update OG description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', config.ogDescription || config.description);
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', config.ogDescription || config.description);
      document.head.appendChild(ogDescription);
    }

    // Update OG image if provided
    if (config.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', config.ogImage);
      } else {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', config.ogImage);
        document.head.appendChild(ogImage);
      }
    }

    // Update canonical URL if provided
    if (config.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', config.canonical);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', config.canonical);
        document.head.appendChild(canonical);
      }
    }

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [config.title, config.description, config.ogTitle, config.ogDescription, config.ogImage, config.canonical]);
};
