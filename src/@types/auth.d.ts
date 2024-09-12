import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * What user information we expect to be able to extract
   * from our backend response
   */

  interface User {
    accessToken: string | JWT;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  export interface JWT {
    data: User;
    error: "RefreshTokenExpired" | "RefreshAccessTokenError";
  }
}
