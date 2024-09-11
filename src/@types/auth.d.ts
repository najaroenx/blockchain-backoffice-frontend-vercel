import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    accessToken: string | JWT;
  }

  interface Session {
    user: User;
  }
}
