import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchMe, type MeResponse } from "@/lib/authClient";
import { SignInWithGoogle } from "./SignInWithGoogle";

type AuthState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "signedIn"; email: string; adminEmails: string[] };

const AuthContext = createContext<AuthState>({ status: "loading" });

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

interface RequireAdminProps {
  children: ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const refresh = async () => {
    const me: MeResponse = await fetchMe();
    if (me.signedIn && me.email) {
      setState({
        status: "signedIn",
        email: me.email,
        adminEmails: me.adminEmails ?? [],
      });
    } else {
      setState({ status: "signedOut" });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading admin area…</div>
      </div>
    );
  }

  if (state.status === "signedOut") {
    return <SignInWithGoogle onSuccess={refresh} />;
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
