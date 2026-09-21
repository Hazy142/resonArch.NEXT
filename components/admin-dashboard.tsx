"use client";

import { useEffect, useState } from "react";

type ProductRow = {
  id: string;
  title: string;
  family: string;
  technicalMaturity: string;
  productState: string;
  votes: number;
  professionalIntent: number;
  betaInterest: number;
  paymentInterest: number;
  meaningfulUseCases: number;
  decisionScore: number;
};

type Overview = {
  totals: {
    validVoters: number;
    ballots: number;
    suspicious: number;
    betaInterest: number;
    paymentIntent: number;
    writtenUseCases: number;
  };
  products: ProductRow[];
};

type IntegrityRow = {
  ballotId: string;
  audience: string;
  state: string;
  createdAt: string;
  eventType: string | null;
  detail: Record<string, unknown> | null;
};

export function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [integrity, setIntegrity] = useState<IntegrityRow[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    if (response.status === 401) {
      setUnauthorized(true);
      setOverview(null);
      return;
    }
    if (!response.ok) {
      setError("Admin analytics could not be loaded.");
      return;
    }
    setUnauthorized(false);
    setOverview(await response.json());

    const integrityResponse = await fetch("/api/admin/integrity", { cache: "no-store" });
    if (integrityResponse.ok) {
      const payload = await integrityResponse.json();
      setIntegrity(payload.suspicious || []);
    }
  }

  useEffect(() => {
    load().catch(() => setError("Admin analytics could not be loaded."));
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      setError("Invalid admin credentials.");
      return;
    }
    setPassword("");
    await load();
  }

  async function updateProduct(id: string, patch: Record<string, string>) {
    const response = await fetch("/api/admin/products/" + id, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (!response.ok) {
      setError("Product status update failed.");
      return;
    }
    await load();
  }

  async function decideIntegrity(ballotId: string, decision: "restore" | "exclude") {
    const reason = window.prompt(
      decision === "restore"
        ? "Why should this ballot be restored?"
        : "Why should this ballot remain excluded?"
    );
    if (!reason) return;

    const response = await fetch("/api/admin/integrity", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ballotId, decision, reason })
    });

    if (!response.ok) {
      setError("Integrity decision could not be recorded.");
      return;
    }
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setOverview(null);
    setIntegrity([]);
    setUnauthorized(true);
  }

  if (unauthorized) {
    return (
      <main className="admin-shell admin-login-shell">
        <form className="admin-login" onSubmit={login}>
          <div className="eyebrow">resonArch NEXT / ADMIN</div>
          <h1>Decision dashboard</h1>
          <p>Single-operator access for v1. Public voting remains accountless.</p>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
          />
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary-button" type="submit">Enter dashboard →</button>
        </form>
      </main>
    );
  }

  if (!overview) {
    return <main className="admin-shell"><p>Loading decision evidence…</p></main>;
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="eyebrow">PRIVATE / DECISION DASHBOARD</div>
          <h1>What should resonArch productize next — and why?</h1>
        </div>
        <div className="admin-actions">
          <a className="ghost-admin-button" href="/api/admin/export?format=csv">CSV export</a>
          <a className="ghost-admin-button" href="/api/admin/export?format=json">JSON export</a>
          <button className="ghost-admin-button" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="admin-metrics">
        <Metric value={overview.totals.validVoters} label="valid voters" />
        <Metric value={overview.totals.ballots} label="ballots" />
        <Metric value={overview.totals.betaInterest} label="beta interest" />
        <Metric value={overview.totals.paymentIntent} label="payment intent" />
        <Metric value={overview.totals.writtenUseCases} label="written use cases" />
        <Metric value={overview.totals.suspicious} label="suspicious / excluded" />
      </section>

      {error ? <div className="error-box admin-error">{error}</div> : null}

      <section className="admin-table-wrap">
        <div className="admin-table-heading">
          <div>
            <div className="eyebrow">SIGNAL QUALITY</div>
            <h2>Transparent prioritization</h2>
          </div>
          <p>Decision Score is a sorting aid, not market truth. Human judgment remains final.</p>
        </div>

        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <span>Product</span><span>Votes</span><span>Pro intent</span><span>Beta</span><span>Pay</span><span>Use cases</span><span>Score</span><span>Status</span>
          </div>
          {overview.products.map((product) => (
            <div className="admin-row" key={product.id}>
              <div className="admin-product"><strong>{product.title}</strong><small>{product.family}</small></div>
              <span>{product.votes}</span>
              <span>{product.professionalIntent}</span>
              <span>{product.betaInterest}</span>
              <span>{product.paymentInterest}</span>
              <span>{product.meaningfulUseCases}</span>
              <strong className="score">{product.decisionScore.toFixed(1)}</strong>
              <div className="status-controls">
                <select
                  value={product.technicalMaturity}
                  onChange={(event) => updateProduct(product.id, { technicalMaturity: event.target.value })}
                >
                  <option>IDEA</option>
                  <option>PROTOTYPE</option>
                  <option>WORKING CORE</option>
                  <option>RESEARCH PILOT</option>
                </select>
                <select
                  value={product.productState}
                  onChange={(event) => updateProduct(product.id, { productState: event.target.value })}
                >
                  <option>SIGNALING</option>
                  <option>VALIDATING</option>
                  <option>BUILDING</option>
                  <option>BETA</option>
                  <option>AVAILABLE</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="integrity-section">
        <div className="admin-table-heading">
          <div>
            <div className="eyebrow">INTEGRITY REVIEW</div>
            <h2>Suspicious or excluded ballots</h2>
          </div>
          <p>Raw evidence is retained. Operator decisions are recorded instead of silently deleting ballots.</p>
        </div>
        {integrity.length ? (
          <div className="integrity-list">
            {integrity.map((row) => (
              <div className="integrity-row" key={row.ballotId}>
                <div>
                  <strong>{row.state}</strong>
                  <small>{row.audience} · {new Date(row.createdAt).toLocaleString()}</small>
                  <small>{row.eventType || "manual decision state"}</small>
                </div>
                <code>{row.ballotId.slice(0, 12)}…</code>
                <div className="integrity-actions">
                  <button onClick={() => decideIntegrity(row.ballotId, "restore")}>Restore</button>
                  <button onClick={() => decideIntegrity(row.ballotId, "exclude")}>Keep excluded</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="integrity-empty">No suspicious or excluded ballots are waiting for review.</p>
        )}
      </section>

      <section className="admin-note">
        <strong>Human-controlled. Evidence-backed.</strong>
        <p>
          The dashboard surfaces community interest, professional relevance, beta willingness, payment intent,
          written use cases and integrity state. It does not choose a product for you.
        </p>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="admin-metric"><strong>{value}</strong><span>{label}</span></div>;
}
