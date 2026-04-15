import {
  jwtVerify,
  SignJWT,
  createRemoteJWKSet,
  type JWTVerifyGetKey,
} from "jose";

export const SESSION_COOKIE_NAME = "rg_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const GOOGLE_ISSUERS = new Set([
  "https://accounts.google.com",
  "accounts.google.com",
]);

type GoogleJwks = JWTVerifyGetKey;

let cachedGoogleJwks: GoogleJwks | null = null;
function defaultGoogleJwks(): GoogleJwks {
  if (!cachedGoogleJwks) {
    cachedGoogleJwks = createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs"),
    );
  }
  return cachedGoogleJwks;
}

export function parseAllowlist(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

export function isEmailAllowed(
  email: string | undefined | null,
  allowlist: string[],
): boolean {
  if (!email) return false;
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export interface GoogleIdTokenClaims {
  email: string;
  name?: string;
  sub: string;
}

export async function verifyGoogleIdToken(
  idToken: string,
  options: { clientId: string; jwks?: GoogleJwks },
): Promise<GoogleIdTokenClaims> {
  const jwks = options.jwks ?? defaultGoogleJwks();
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: options.clientId,
  });

  const issuer = typeof payload.iss === "string" ? payload.iss : "";
  if (!GOOGLE_ISSUERS.has(issuer)) {
    throw new Error(`Invalid issuer: ${issuer}`);
  }

  if (payload.email_verified !== true) {
    throw new Error("Google token rejected: email_verified is not true");
  }

  const email = typeof payload.email === "string" ? payload.email : "";
  if (!email) {
    throw new Error("Google token missing email claim");
  }

  return {
    email: email.toLowerCase(),
    name: typeof payload.name === "string" ? payload.name : undefined,
    sub: typeof payload.sub === "string" ? payload.sub : "",
  };
}

export async function createSessionToken(
  email: string,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({ email: email.toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("rg-auth")
    .setAudience("rg-admin")
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

export interface SessionClaims {
  email: string;
  expiresAt: number;
}

export async function verifySessionToken(
  token: string,
  secret: Uint8Array,
): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, secret, {
    issuer: "rg-auth",
    audience: "rg-admin",
  });
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!email) {
    throw new Error("Session token missing email claim");
  }
  const expiresAt =
    typeof payload.exp === "number" ? payload.exp * 1000 : Date.now();
  return { email, expiresAt };
}

export function getSessionSecret(): Uint8Array {
  const raw =
    process.env.SESSION_SECRET || process.env.VITE_SESSION_SECRET || "";
  if (!raw) {
    throw new Error("SESSION_SECRET env var is not set");
  }
  return new TextEncoder().encode(raw);
}

export function readCookie(
  cookieHeader: string | undefined,
  name: string,
): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return null;
}

export function buildSessionCookie(token: string): string {
  const attrs = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];
  return attrs.join("; ");
}

export function buildClearSessionCookie(): string {
  const attrs = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  return attrs.join("; ");
}
