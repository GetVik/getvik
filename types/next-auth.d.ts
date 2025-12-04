import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    storeSlug?: string | null;
    isVerified: boolean;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      storeSlug?: string | null;
      isVerified?: boolean;
      phone?: string | null;
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    role: string;
    storeSlug?: string | null;
    expiresAt?: number;
    error?: string;
    isVerified?: boolean;
    phone?: string | null;
  }
}