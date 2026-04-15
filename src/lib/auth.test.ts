// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import {
  generateKeyPair,
  SignJWT,
  exportJWK,
  createLocalJWKSet,
  type KeyLike,
} from "jose";
import {
  isEmailAllowed,
  parseAllowlist,
  createSessionToken,
  verifySessionToken,
  verifyGoogleIdToken,
  SESSION_MAX_AGE_SECONDS,
} from "./auth";

const TEST_CLIENT_ID = "test-client-id.apps.googleusercontent.com";
const TEST_SESSION_SECRET = new TextEncoder().encode(
  "x".repeat(48), // 48+ bytes of key material for HS256
);

let googlePrivateKey: KeyLike;
let googleJwks: ReturnType<typeof createLocalJWKSet>;

beforeAll(async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  googlePrivateKey = privateKey;
  const jwk = await exportJWK(publicKey);
  jwk.kid = "test-kid";
  jwk.use = "sig";
  jwk.alg = "RS256";
  googleJwks = createLocalJWKSet({ keys: [jwk] });
});

async function makeGoogleIdToken(
  overrides: Partial<{
    email: string;
    audience: string;
    issuer: string;
    expiresIn: string;
    emailVerified: boolean;
  }> = {},
): Promise<string> {
  const {
    email = "giles@parnellsystems.com",
    audience = TEST_CLIENT_ID,
    issuer = "https://accounts.google.com",
    expiresIn = "1h",
    emailVerified = true,
  } = overrides;

  return new SignJWT({ email, email_verified: emailVerified, name: "Giles" })
    .setProtectedHeader({ alg: "RS256", kid: "test-kid" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(googlePrivateKey);
}

describe("parseAllowlist", () => {
  it("splits comma-separated emails and lowercases them", () => {
    expect(parseAllowlist("Giles@Foo.com, info@robgardens.com")).toEqual([
      "giles@foo.com",
      "info@robgardens.com",
    ]);
  });

  it("trims whitespace and drops empty entries", () => {
    expect(parseAllowlist(" a@b.com , , c@d.com ,")).toEqual([
      "a@b.com",
      "c@d.com",
    ]);
  });

  it("returns empty array for undefined or empty string", () => {
    expect(parseAllowlist(undefined)).toEqual([]);
    expect(parseAllowlist("")).toEqual([]);
  });
});

describe("isEmailAllowed", () => {
  const allowlist = ["giles@parnellsystems.com", "info@robgardens.com"];

  it("returns true for an email in the allowlist", () => {
    expect(isEmailAllowed("giles@parnellsystems.com", allowlist)).toBe(true);
  });

  it("is case-insensitive on the input email", () => {
    expect(isEmailAllowed("Giles@ParnellSystems.com", allowlist)).toBe(true);
  });

  it("returns false for an email not in the allowlist", () => {
    expect(isEmailAllowed("random@gmail.com", allowlist)).toBe(false);
  });

  it("returns false for empty / undefined inputs", () => {
    expect(isEmailAllowed("", allowlist)).toBe(false);
    expect(isEmailAllowed("a@b.com", [])).toBe(false);
  });
});

describe("createSessionToken / verifySessionToken", () => {
  it("roundtrips an email through sign + verify", async () => {
    const token = await createSessionToken(
      "giles@parnellsystems.com",
      TEST_SESSION_SECRET,
    );
    const claims = await verifySessionToken(token, TEST_SESSION_SECRET);
    expect(claims.email).toBe("giles@parnellsystems.com");
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(
      "giles@parnellsystems.com",
      TEST_SESSION_SECRET,
    );
    const wrongSecret = new TextEncoder().encode("y".repeat(48));
    await expect(verifySessionToken(token, wrongSecret)).rejects.toThrow();
  });

  it("rejects a tampered token", async () => {
    const token = await createSessionToken(
      "giles@parnellsystems.com",
      TEST_SESSION_SECRET,
    );
    const tampered = token.slice(0, -4) + "AAAA";
    await expect(verifySessionToken(tampered, TEST_SESSION_SECRET)).rejects.toThrow();
  });

  it("sets a 7-day expiry by default (constant export)", () => {
    expect(SESSION_MAX_AGE_SECONDS).toBe(7 * 24 * 60 * 60);
  });
});

describe("verifyGoogleIdToken", () => {
  it("returns the email claim for a valid token", async () => {
    const idToken = await makeGoogleIdToken();
    const claims = await verifyGoogleIdToken(idToken, {
      clientId: TEST_CLIENT_ID,
      jwks: googleJwks,
    });
    expect(claims.email).toBe("giles@parnellsystems.com");
  });

  it("rejects a token with the wrong audience", async () => {
    const idToken = await makeGoogleIdToken({
      audience: "someone-else.apps.googleusercontent.com",
    });
    await expect(
      verifyGoogleIdToken(idToken, {
        clientId: TEST_CLIENT_ID,
        jwks: googleJwks,
      }),
    ).rejects.toThrow();
  });

  it("rejects a token with the wrong issuer", async () => {
    const idToken = await makeGoogleIdToken({
      issuer: "https://evil.example.com",
    });
    await expect(
      verifyGoogleIdToken(idToken, {
        clientId: TEST_CLIENT_ID,
        jwks: googleJwks,
      }),
    ).rejects.toThrow();
  });

  it("rejects an expired token", async () => {
    const idToken = await makeGoogleIdToken({ expiresIn: "-5m" });
    await expect(
      verifyGoogleIdToken(idToken, {
        clientId: TEST_CLIENT_ID,
        jwks: googleJwks,
      }),
    ).rejects.toThrow();
  });

  it("rejects a token where email_verified is false", async () => {
    const idToken = await makeGoogleIdToken({ emailVerified: false });
    await expect(
      verifyGoogleIdToken(idToken, {
        clientId: TEST_CLIENT_ID,
        jwks: googleJwks,
      }),
    ).rejects.toThrow(/email_verified/);
  });
});
