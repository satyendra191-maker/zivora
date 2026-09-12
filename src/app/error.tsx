"use client";

import { CircleHelp } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="loading-screen">
      <div className="empty-state">
        <div className="empty-icon">
          <CircleHelp size={28} />
        </div>
        <h3>Let&rsquo;s reconnect</h3>
        <p>{error.message || "Something went wrong on our side."}</p>
        <button className="primary-button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
