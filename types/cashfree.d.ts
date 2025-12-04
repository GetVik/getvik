declare module '@cashfreepayments/cashfree-js' {
    export interface Cashfree {
        checkout(options: {
            paymentSessionId: string;
            redirectTarget?: '_self' | '_blank' | '_top' | '_parent';
            returnUrl?: string;
        }): Promise<void>;
    }

    export function load(options: {
        mode: 'production' | 'sandbox';
    }): Promise<Cashfree | null>;
}
