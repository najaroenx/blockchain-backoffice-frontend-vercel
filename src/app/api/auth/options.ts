import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const data = await api(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });

          const { accessToken, refreshToken } = data;

          const access = jwtDecode(accessToken) as any;

          const user = {
            id: access.id,
            email: access.email,
            accessToken,
            refreshToken,
            valid_until: access.exp,
          };

          return user;
        } catch (error) {
          logger.error(`Error occurred: ${error}`);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return { ...token, data: user };
      }

      if (token.data.accessToken) {
        const access = jwtDecode(token.data.accessToken) as any;

        if (Date.now() < access.exp * 1000) {
          token.data.valid_until = access.exp;
          return token;
        }

        return token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.data.id as string;
      session.user.accessToken = token.data.accessToken as string;
      return session;
    },
  },
};
