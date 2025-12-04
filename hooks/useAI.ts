import { useState, useCallback } from 'react';
import { aiService } from '@/services/ai.service';
import { toast } from 'react-hot-toast'; 

interface ApiErrorResponse {
  message: string;
}
export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleApiError = (err: unknown, defaultMsg: string) => {
    let msg = defaultMsg;

    if (err instanceof Error) {
      msg = err.message;
    }

    setError(msg);
    toast.error(msg);
  };

  const triggerAutofill = useCallback(async (title: string, category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiService.generateAutofill(title, category);
      toast.success('Content generated successfully');
      return data;
    } catch (err) {
      handleApiError(err, 'Failed to generate content');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiService.getSalesInsights();
      return data;
    } catch (err) {
      handleApiError(err, 'Failed to analyze data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    showUpgradeModal,
    setShowUpgradeModal,
    triggerAutofill,
    triggerInsights
  };
};