import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/RequireAdmin";

export default function AdminUsers() {
  const auth = useAuth();
  const adminEmails = auth.status === "signedIn" ? auth.adminEmails : [];
  const currentEmail = auth.status === "signedIn" ? auth.email : "";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" /> Back to admin
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-semibold">Manage Users</h1>
            <p className="text-sm text-muted-foreground">
              Admin allowlist and permissions.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <section className="mb-10">
          <h2 className="font-semibold text-lg mb-4">Current admins</h2>
          {adminEmails.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No admin emails configured. Set the <code className="font-mono">ADMIN_EMAILS</code> env
              var on Vercel (comma-separated) to grant access.
            </p>
          ) : (
            <ul className="rounded-lg border border-border bg-card divide-y divide-border">
              {adminEmails.map((email) => (
                <li
                  key={email}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <span className="font-mono text-sm">{email}</span>
                  {email === currentEmail && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg bg-muted/30 border border-border p-6">
          <h3 className="font-semibold mb-2">How to add or remove an admin</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The allowlist is stored as the <code className="font-mono">ADMIN_EMAILS</code> environment
            variable on Vercel (comma-separated). To add or remove an admin:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>Open the Rob's Gardens project in the Vercel dashboard.</li>
            <li>
              Go to <span className="font-medium">Settings → Environment Variables</span>.
            </li>
            <li>
              Edit <code className="font-mono">ADMIN_EMAILS</code> and save.
            </li>
            <li>Redeploy the site so the new value takes effect.</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-4">
            A proper in-app edit flow with role-based permissions is planned for a future phase.
          </p>
        </section>
      </main>
    </div>
  );
}
