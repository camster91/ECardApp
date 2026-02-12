import { cookies } from "next/headers";

const MOCK_COOKIE = "mock-user-email";

export interface MockUser {
  id: string;
  email: string;
}

export async function getMockUser(): Promise<MockUser | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(MOCK_COOKIE)?.value;
  if (!email) return null;
  return { id: "demo-user-001", email };
}

export async function setMockUser(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearMockUser() {
  const cookieStore = await cookies();
  cookieStore.delete(MOCK_COOKIE);
}
