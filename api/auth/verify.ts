import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildSessionCookie,
  createSessionToken,
  getSessionSecret,
  isEmailAllowed,
  parseAllowlist,
  verifyGoogleIdToken,
} from "../../src/lib/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res
      .status(503)
      .json({ error: "VITE_GOOGLE_CLIENT_ID env var is not set" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  const idToken = typeof body.idToken === "string" ? body.idToken : "";
  if (!idToken) {
    return res.status(400).json({ error: "idToken is required" });
  }

  let googleClaims;
  try {
    googleClaims = await verifyGoogleIdToken(idToken, { clientId });
  } catch (err) {
    return res.status(401).json({
      error: "Invalid Google ID token",
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  const allowlist = parseAllowlist(process.env.ADMIN_EMAILS);
  if (!isEmailAllowed(googleClaims.email, allowlist)) {
    return res
      .status(403)
      .json({ error: "Email is not on the admin allowlist" });
  }

  let sessionToken: string;
  try {
    sessionToken = await createSessionToken(
      googleClaims.email,
      getSessionSecret(),
    );
  } catch (err) {
    return res.status(503).json({
      error: "Server session signing not configured",
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  res.setHeader("Set-Cookie", buildSessionCookie(sessionToken));
  return res
    .status(200)
    .json({ ok: true, email: googleClaims.email, name: googleClaims.name });
}
