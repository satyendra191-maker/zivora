import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="loading-screen">
      <div className="empty-state">
        <div className="empty-icon">
          <Compass size={28} />
        </div>
        <h3>This space doesn&rsquo;t exist</h3>
        <p>The page you&rsquo;re looking for moved or was never here.</p>
        <Link className="primary-button" href="/">
          Find your people
        </Link>
      </div>
    </main>
  );
}
