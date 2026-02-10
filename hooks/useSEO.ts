import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  keywords?: string[];
  author?: string;
  structuredData?: Record<string, unknown>;
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

    // Update keywords for GEO/LLM optimization
    if (config.keywords && config.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      const keywordString = config.keywords.join(', ');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywordString);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywordString);
        document.head.appendChild(metaKeywords);
      }
    }

    // Update author meta tag
    if (config.author) {
      let metaAuthor = document.querySelector('meta[name="author"]');
      if (metaAuthor) {
        metaAuthor.setAttribute('content', config.author);
      } else {
        metaAuthor = document.createElement('meta');
        metaAuthor.setAttribute('name', 'author');
        metaAuthor.setAttribute('content', config.author);
        document.head.appendChild(metaAuthor);
      }
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

    // Add structured data (JSON-LD) for GEO/LLM optimization
    if (config.structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(config.structuredData);
    }

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [config.title, config.description, config.ogTitle, config.ogDescription, config.ogImage, config.canonical, config.keywords, config.author, config.structuredData]);
};
