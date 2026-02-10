/**
 * GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization) Utilities
 * 
 * Helps optimize content to be cited, summarized, or recommended within AI-generated responses
 * (e.g., ChatGPT, Perplexity, Google AI Overviews) rather than just ranking as traditional blue links.
 * 
 * Key strategies:
 * - Clear, authoritative, and structured content
 * - Factual information with proper citations
 * - Q&A format content
 * - Comprehensive definitions and explanations
 * - Expert attribution
 */

export interface GEOStructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Generate FAQ Schema for LLM citation optimization
 * FAQs are commonly pulled by AI models for direct answers
 */
export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): GEOStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(item => ({
    '@type': 'Question',
    'name': item.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.answer
    }
  }))
});

/**
 * Generate BreadcrumbList Schema for clear content hierarchy
 * Helps LLMs understand content structure and relationships
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): GEOStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url
  }))
});

/**
 * Generate Article Schema for blog posts and detailed content
 * Includes author attribution crucial for LLM citations
 */
export const generateArticleSchema = (config: {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}): GEOStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': config.headline,
  'description': config.description,
  'image': config.image || '',
  'author': {
    '@type': 'Organization',
    'name': config.author || 'TRAX'
  },
  'datePublished': config.datePublished || new Date().toISOString(),
  'dateModified': config.dateModified || new Date().toISOString()
});

/**
 * Generate LocalBusiness Schema for geo-targeted content
 * Important for regional and location-specific LLM recommendations
 */
export const generateLocalBusinessSchema = (config: {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  image?: string;
  url?: string;
}): GEOStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': config.name,
  'description': config.description,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': config.address.streetAddress,
    'addressLocality': config.address.addressLocality,
    'postalCode': config.address.postalCode,
    'addressCountry': config.address.addressCountry
  },
  'telephone': config.telephone,
  'image': config.image,
  'url': config.url
});

/**
 * Generate Thing Schema for generic content
 * Useful for establishing entity information for knowledge graphs
 */
export const generateThingSchema = (config: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}): GEOStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Thing',
  'name': config.name,
  'description': config.description,
  'url': config.url,
  'image': config.image,
  'sameAs': config.sameAs || []
});

/**
 * GEO Best Practices for Content:
 * 
 * 1. Use clear, direct language
 *    - AI models favor simple, unambiguous explanations
 *    - Avoid jargon unless it's the technical term being explained
 * 
 * 2. Structure content hierarchically
 *    - Use proper heading hierarchy (H1, H2, H3)
 *    - LLMs use these for content understanding
 * 
 * 3. Include definitions and context
 *    - Start sections with clear definitions
 *    - Provide background information
 * 
 * 4. Use factual, verifiable information
 *    - Include specific data points, dates, and figures
 *    - AI models prioritize factual content for citations
 * 
 * 5. Attribute expertise and authority
 *    - Clearly state author credentials
 *    - Use structured data to indicate expertise
 * 
 * 6. Format lists and key information
 *    - Use bullet points and numbered lists
 *    - AI models extract and restructure this format
 * 
 * 7. Answer common questions directly
 *    - Use FAQ schema
 *    - Answer questions in the first paragraph
 * 
 * 8. Provide comprehensive coverage
 *    - Go deeper than typical blog posts
 *    - Cover multiple aspects of a topic
 */
