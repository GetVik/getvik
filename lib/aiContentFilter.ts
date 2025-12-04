/**
 * Detects generic AI-generated marketing content
 * Returns true if content appears to be generic marketing template
 */

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

interface FilterResult {
  isGeneric: boolean;
  reason?: string;
  score: number; // 0-100, higher = more likely to be generic
}

export function detectGenericAIContent(content: string, productName?: string): FilterResult {
  if (!content || content.trim().length === 0) {
    return { isGeneric: false, score: 0 };
  }

  const lowerContent = content.toLowerCase();
  const lowerProductName = productName?.toLowerCase() || '';
  
  let score = 0;
  const reasons: string[] = [];

  // Check 1: Generic product name (high weight)
  if (productName) {
    const isGenericName = GENERIC_NAMES.some(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      return regex.test(lowerProductName) && lowerProductName.length <= 15;
    });
    
    if (isGenericName) {
      score += 30;
      reasons.push('generic product name');
    }
  }

  // Check 2: Count marketing buzzwords
  const buzzwordCount = MARKETING_BUZZWORDS.filter(word => 
    lowerContent.includes(word.toLowerCase())
  ).length;
  
  if (buzzwordCount >= 5) {
    score += 25;
    reasons.push(`${buzzwordCount} marketing buzzwords`);
  } else if (buzzwordCount >= 3) {
    score += 15;
  }

  // Check 3: Count promotional phrases
  const promoCount = PROMOTIONAL_PHRASES.filter(phrase => 
    lowerContent.includes(phrase.toLowerCase())
  ).length;
  
  if (promoCount >= 3) {
    score += 20;
    reasons.push(`${promoCount} promotional phrases`);
  } else if (promoCount >= 2) {
    score += 10;
  }

  // Check 4: Template-like structure (multiple bullet points with generic features)
  const bulletPointPattern = /[-•*]\s+.+/g;
  const bulletPoints = content.match(bulletPointPattern);
  
  if (bulletPoints && bulletPoints.length >= 4) {
    // Check if bullet points contain generic feature descriptions
    const genericBullets = bulletPoints.filter(bullet => {
      const lowerBullet = bullet.toLowerCase();
      return MARKETING_BUZZWORDS.some(word => lowerBullet.includes(word)) ||
             PROMOTIONAL_PHRASES.some(phrase => lowerBullet.includes(phrase));
    });
    
    if (genericBullets.length >= 3) {
      score += 15;
      reasons.push('template-like bullet structure');
    }
  }

  // Check 5: Contains common AI template headers
  const templateHeaders = [
    'key features:',
    'perfect for:',
    'what you get:',
    'why choose',
    'benefits:',
  ];
  
  const headerCount = templateHeaders.filter(header => 
    lowerContent.includes(header)
  ).length;
  
  if (headerCount >= 2) {
    score += 15;
    reasons.push('template headers detected');
  }

  // Check 6: Excessive use of asterisks/emphasis (AI loves to emphasize everything)
  const emphasisPattern = /\*\*[^*]+\*\*|\*[^*]+\*/g;
  const emphasisMatches = content.match(emphasisPattern);
  
  if (emphasisMatches && emphasisMatches.length >= 8) {
    score += 10;
    reasons.push('excessive emphasis');
  }

  // Check 7: Very generic opening lines
  const genericOpenings = [
    'optimize your workflow',
    'unlock unparalleled',
    'experience the ultimate',
    'discover the power',
    'transform your',
    'revolutionize your',
  ];
  
  const hasGenericOpening = genericOpenings.some(opening => 
    lowerContent.startsWith(opening) || lowerContent.includes(`# ${opening}`)
  );
  
  if (hasGenericOpening) {
    score += 10;
    reasons.push('generic opening line');
  }

  // Determine if content is generic (threshold: 50+)
  const isGeneric = score >= 50;
  
  return {
    isGeneric,
    score,
    reason: isGeneric ? reasons.join(', ') : undefined,
  };
}

/**
 * Get a user-friendly error message for generic content
 */
export function getGenericContentMessage(result: FilterResult): string {
  if (!result.isGeneric) return '';
  
  return `The AI generated generic marketing content instead of a specific product description. Please provide more details about your product (features, use cases, target audience) and try again. Detected: ${result.reason}`;
}
