import "server-only";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/tokens";
import { updateUserLastSeen } from "@/lib/auth/user-service";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export async function getSessionUser(cookieHeader?: string): Promise<SessionUser | null> {
  let token: string | undefined;

  if (!cookieHeader) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get?.("postura_auth")?.value;
    } catch {
      // cookies() might throw outside of a request context
    }
  }

  if (!token) {
    const source = cookieHeader ?? "";
    token = source
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith("postura_auth="))
      ?.split("=")[1];

    if (token) {
      try {
        token = decodeURIComponent(token);
      } catch {
        token = undefined;
      }
    }
  }

  if (!token) {
    return null;
  }

  try {
    const payload = verifyAuthToken(token);
    updateUserLastSeen(payload.sub);
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
