import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";
// test
export const getSessionToken = async () => {
  const session = await getServerSession(authOptions);
  return session?.user.accessToken;
};
