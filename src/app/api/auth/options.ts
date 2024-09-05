import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { db } from "@/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });

          if (user) {
            return { id: user.id, email: user.email };
          } else {
            return null;
          }
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
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = "https://www.fillmurray.com/128/128";
      }

      return session;
    },
  },
};
