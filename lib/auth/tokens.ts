import jwt from "jsonwebtoken";

const DEFAULT_EXPIRATION = "10m";
const MFA_TOKEN_EXPIRATION = "10m";
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change";

export type AuthTokenPayload = {
  sub: number;
  email: string;
  name: string;
  role: string;
};

type MfaTokenPurpose = "setup" | "verify";

export type MfaTokenPayload = {
  sub: number;
  email: string;
  purpose: MfaTokenPurpose;
};

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: DEFAULT_EXPIRATION,
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, AUTH_SECRET) as AuthTokenPayload & {
    iat: number;
    exp: number;
  };
}

export function createMfaToken(payload: MfaTokenPayload) {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: MFA_TOKEN_EXPIRATION,
  });
}

export function verifyMfaToken(token: string, expectedPurpose: MfaTokenPurpose) {
  const payload = jwt.verify(token, AUTH_SECRET) as MfaTokenPayload & {
    iat: number;
    exp: number;
  };
  if (payload.purpose !== expectedPurpose) {
    throw new Error("Invalid MFA token purpose");
  }
  return payload;
}
