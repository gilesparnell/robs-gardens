export interface MeResponse {
  signedIn: boolean;
  email?: string;
  adminEmails?: string[];
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });
  if (!res.ok) {
    return { signedIn: false };
  }
  return (await res.json()) as MeResponse;
}

export async function postVerify(idToken: string): Promise<boolean> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return res.ok;
}

export async function postSignOut(): Promise<void> {
  await fetch("/api/auth/signout", {
    method: "POST",
    credentials: "include",
  });
}
