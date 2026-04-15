import { Link } from "react-router-dom";
import { Calendar, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/RequireAdmin";
import { postSignOut } from "@/lib/authClient";

export default function AdminDashboard() {
  const auth = useAuth();
  const email = auth.status === "signedIn" ? auth.email : "";

  const handleSignOut = async () => {
    await postSignOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold">Admin</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-mono">{email}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-muted-foreground mb-8">
          Admin tools for Rob Gardening &amp; Maintenance.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/admin/schedule"
            className="block p-6 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Manage Schedule</h2>
                <p className="text-sm text-muted-foreground">
                  Edit the 2-week rotating crew schedule across Sydney service areas.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="block p-6 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Manage Users</h2>
                <p className="text-sm text-muted-foreground">
                  View the admin allowlist and which Google accounts can access this area.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
