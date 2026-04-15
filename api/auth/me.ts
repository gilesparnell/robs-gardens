import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  SESSION_COOKIE_NAME,
  getSessionSecret,
  parseAllowlist,
  readCookie,
  verifySessionToken,
} from "../../src/lib/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = readCookie(req.headers.cookie, SESSION_COOKIE_NAME);
  if (!token) {
    return res.status(200).json({ signedIn: false });
  }

  let secret: Uint8Array;
  try {
    secret = getSessionSecret();
  } catch {
    return res.status(200).json({ signedIn: false });
  }

  try {
    const claims = await verifySessionToken(token, secret);
    const allowlist = parseAllowlist(process.env.ADMIN_EMAILS);
    return res.status(200).json({
      signedIn: true,
      email: claims.email,
      adminEmails: allowlist,
    });
  } catch {
    return res.status(200).json({ signedIn: false });
  }
}
