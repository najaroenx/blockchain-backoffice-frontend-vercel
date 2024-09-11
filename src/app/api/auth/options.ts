import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const BACKEND_URL =
          process.env.MERCHANT_BACKEND || "http://localhost:4000";

        try {
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const { accessToken, userId } = await response.json();

          const user = {
            accessToken,
            id: userId,
          };

          return user;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/#/login",
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
};
