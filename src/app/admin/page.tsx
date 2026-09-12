import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { currentUser } from "@/lib/auth";
import AdminDashboard from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin dashboard — Zivora",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    return (
      <main className="loading-screen">
        <div className="empty-state">
          <div className="empty-icon">
            <ShieldCheck size={28} />
          </div>
          <h3>Restricted area</h3>
          <p>
            {!user
              ? "Please sign in with an administrator account to view this dashboard."
              : "Your account does not have administrator access. Demo accounts can never access admin functionality."}
          </p>
          <Link className="primary-button" href="/">
            Back to the app
          </Link>
        </div>
      </main>
    );
  }
  return <AdminDashboard adminName={user.name} adminId={user.id} />;
}
