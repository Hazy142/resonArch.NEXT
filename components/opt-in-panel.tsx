"use client";

import { useState } from "react";

export function OptInPanel() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);
    const response = await fetch("/api/opt-in", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, consent })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(payload?.error || "Opt-in could not be recorded.");
      return;
    }
    setStatus("Recorded. Email delivery / double opt-in transport is not enabled in this v1 build yet.");
    setEmail("");
    setConsent(false);
  }

  return (
    <form className="opt-in-panel" onSubmit={submit}>
      <div>
        <div className="eyebrow">OPTIONAL / EARLY ACCESS</div>
        <h3>Want to test what moves into beta?</h3>
        <p>Your email is stored separately from the anonymous ballot.</p>
      </div>
      <div className="opt-in-fields">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <label>
          <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>I want product/beta updates and can withdraw this consent.</span>
        </label>
        <button className="primary-button" type="submit">Join early access →</button>
        {status ? <small>{status}</small> : null}
      </div>
    </form>
  );
}
