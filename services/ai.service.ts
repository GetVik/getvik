import api from '../lib/api';

interface AutofillResponse {
  description: string;
  seoTags: string[];
  suggestedPrice: number;
}

interface InsightsResponse {
  summary: string;
  actionableInsights: string[];
}

export const aiService = {
  async generateAutofill(title: string, category: string): Promise<AutofillResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      description: `This is a generated description for ${title} in category ${category}. It highlights the key features and benefits of the product.`,
      seoTags: [category, "digital product", "download", "premium"],
      suggestedPrice: 29.99
    };
  },

  async getSalesInsights(): Promise<InsightsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      summary: "Here's a summary of your recent sales performance.",
      actionableInsights: [
        "Your top selling product is 'Digital Art Pack'.",
        "Most of your traffic comes from social media.",
        "Consider running a discount campaign next week."
      ]
    };
  }
};