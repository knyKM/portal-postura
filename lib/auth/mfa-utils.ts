import { authenticator } from "otplib";

const MFA_APP_NAME = process.env.MFA_APP_NAME || "Postura SM";

authenticator.options = {
  window: 1,
};

export function createMfaSecret(email: string) {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(email, MFA_APP_NAME, secret);
  return { secret, otpauthUrl };
}

export function getMfaOtpauthUrl(email: string, secret: string) {
  return authenticator.keyuri(email, MFA_APP_NAME, secret);
}

export function checkMfaCode(secret: string | null, code: string) {
  if (!secret) return false;
  return authenticator.verify({ secret, token: code });
}
