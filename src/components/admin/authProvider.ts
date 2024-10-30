import { AuthProvider } from "react-admin";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

export const authProvider = (session?: Session | null): AuthProvider => ({
  login: async ({ email, password }) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result || !result.ok) {
      throw new Error(result?.error as string);
    }
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),

  checkAuth: (_params) => {
    if (session?.user) return Promise.resolve();
    else return Promise.reject();
  },

  logout: async (params) => {
    if (params === null) await signOut({ redirect: false });
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(),
});
