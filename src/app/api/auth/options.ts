import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Get a new access token from backend using the refresh token
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token.data.refreshToken,
      }),
    });

    if (!response.ok) {
      return token;
    }

    const { accessToken } = await response.json();

    const access = jwtDecode(accessToken) as any;

    token.data.valid_until = access.exp;
    token.data.accessToken = accessToken;

    return token;
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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

          const { accessToken, refreshToken } = await response.json();

          const access = jwtDecode(accessToken) as any;

          const user = {
            id: access.id,
            email: access.email,
            accessToken,
            refreshToken,
            valid_until: access.exp,
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
        return { ...token, data: user };
      }

      if (Date.now() < token.data.valid_until * 1000) {
        return token;
      }

      if (Date.now() > token.data.valid_until * 1000) {
        await refreshAccessToken(token);
        return token;
      }

      return { ...token, error: "RefreshTokenExpired" } as JWT;
    },
    async session({ session, token }) {
      session.user.id = token.data.id as string;
      session.user.accessToken = token.data.accessToken as string;
      return session;
    },
  },
};
