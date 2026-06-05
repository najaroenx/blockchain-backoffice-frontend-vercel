import { getSessionToken } from "@/libs/auth"; // ✅ เปลี่ยน path ตามจริง
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));


jest.mock("@/app/api/auth/options", () => ({
  authOptions: {},
}));

describe("getSessionToken", () => {
  it("should return accessToken when session exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { accessToken: "mock-token" },
    });

    const token = await getSessionToken();
    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(token).toBe("mock-token");
  });

  it("should return undefined if session exists but no accessToken", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {},
    });

    const token = await getSessionToken();
    expect(token).toBeUndefined();
  });

  it("should return undefined if no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const token = await getSessionToken();
    expect(token).toBeUndefined();
  });
});
