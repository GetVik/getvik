import { load } from '@cashfreepayments/cashfree-js';

/**
 * Initialize and execute Cashfree payment
 * @param payment_session_id - The payment session ID from backend
 * @param subscriptionId - The subscription ID to verify after payment
 * @returns Promise that resolves when payment flow is initiated
 */
export async function initiateCashfreePayment(
  payment_session_id: string,
  subscriptionId: string,
  environment: 'production' | 'sandbox'
): Promise<void> {
  const cashfree = await load({
    mode: environment,
  });

  if (!cashfree) {
    throw new Error('Cashfree SDK failed to load');
  }

  const returnUrl = `${window.location.origin}/subscription/callback?subscription_id=${subscriptionId}`;

  await cashfree.checkout({
    paymentSessionId: payment_session_id,
    redirectTarget: '_self',
    returnUrl,
  });
}
