import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { postVerify } from "@/lib/authClient";

interface SignInWithGoogleProps {
  onSuccess: () => void;
}

export function SignInWithGoogle({ onSuccess }: SignInWithGoogleProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const [error, setError] = useState<string | null>(null);

  if (!clientId) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-lg bg-destructive/10 text-destructive">
        <h2 className="font-semibold text-lg mb-2">Admin sign-in not configured</h2>
        <p className="text-sm">
          <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> is not set. Ask the site
          owner to configure the Google OAuth client.
        </p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="max-w-md mx-auto mt-20 p-8 rounded-lg bg-card border border-border shadow-sm text-center">
        <h1 className="font-serif text-2xl font-semibold mb-2">Admin sign-in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in with your allowlisted Google account to access the Rob Gardening admin area.
        </p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const idToken = credentialResponse.credential;
              if (!idToken) {
                setError("Google did not return a credential token.");
                return;
              }
              const ok = await postVerify(idToken);
              if (ok) {
                setError(null);
                onSuccess();
              } else {
                setError(
                  "Your email is not on the admin allowlist, or the server rejected the token.",
                );
              }
            }}
            onError={() => setError("Google sign-in failed. Please try again.")}
            theme="outline"
            size="large"
          />
        </div>
        {error && (
          <p className="mt-6 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
