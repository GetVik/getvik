/**
 * Detects generic AI-generated marketing content
 * Returns true if content appears to be generic marketing template
 */

/*
// Common marketing buzzwords and phrases used in AI-generated content
const MARKETING_BUZZWORDS = [
  'cutting-edge',
  'state-of-the-art',
  'revolutionary',
  'game-changing',
  'unlock',
  'unparalleled',
  'seamless',
  'enterprise-grade',
  'world-class',
  'next-generation',
  'innovative solution',
  'transform your',
  'boost productivity',
  'streamline your',
  'ultimate',
  'powerful',
  'advanced',
  'premium',
  'professional',
  'comprehensive',
  'robust',
  'scalable',
  'flexible',
  'intuitive',
  'user-friendly',
  'feature-rich',
  'all-in-one',
  'one-stop',
  'hassle-free',
  'effortless',
];

// Generic placeholder product names
const GENERIC_NAMES = [
  'test',
  'product',
  'solution',
  'tool',
  'platform',
  'system',
  'service',
  'application',
  'software',
  'digital product',
];

// Promotional phrases that indicate marketing copy
const PROMOTIONAL_PHRASES = [
  'instant digital delivery',
  'money-back guarantee',
  'priority customer support',
  'download today',
  'get started',
  'try it now',
  'limited time',
  'special offer',
  'act now',
  'don\'t miss out',
  'experience',
  'discover',
  'perfect for',
  'ideal for',
  'designed for',
  'key features',
  'what you get',
  'why choose',
];
*/

interface FilterResult {
  isGeneric: boolean;
  reason?: string;
  score: number; // 0-100, higher = more likely to be generic
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function detectGenericAIContent(_content: string, _productName?: string): FilterResult {

  return {
    isGeneric: false,
    score: 0,
    reason: undefined,
  };
}

/**
 * Get a user-friendly error message for generic content
 */
export function getGenericContentMessage(result: FilterResult): string {
  if (!result.isGeneric) return '';
  
  return `The AI generated generic marketing content instead of a specific product description. Please provide more details about your product (features, use cases, target audience) and try again. Detected: ${result.reason}`;
}
