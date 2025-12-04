import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        if (credentials?.email === "demo@getvik.com" && credentials?.password === "password") {
          return {
            id: "mock-creator-id",
            name: "GetVik Demo",
            email: "demo@getvik.com",
            image: "https://ui-avatars.com/api/?name=GetVik&background=random",
            role: "Creator",
            storeSlug: "getvik-demo",
            isVerified: true,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.storeSlug = user.storeSlug;
        token.name = user.name;
        token.image = user.image;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          storeSlug: token.storeSlug as string,
          name: token.name as string,
          image: token.image as string,
          isVerified: token.isVerified as boolean,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET || "mock-secret",
};