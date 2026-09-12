import { HeartHandshake } from "lucide-react";

export default function Loading() {
  return (
    <main className="loading-screen">
      <div className="loading-brand">
        <HeartHandshake size={34} />
      </div>
      <h2>Finding your kind of people</h2>
      <p>Getting your connection space ready…</p>
      <div className="skeleton-grid">
        {[1, 2, 3].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
    </main>
  );
}
