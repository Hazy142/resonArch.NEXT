import Link from "next/link";

export default function NotFound() {
  return (
    <main className="detail-shell">
      <nav className="topbar">
        <Link className="brand" href="/">resonArch<span>.NEXT</span></Link>
      </nav>
      <section className="detail-hero">
        <div>
          <div className="eyebrow">404 / OUTSIDE THE LAB</div>
          <h1>That experiment is not in the catalogue.</h1>
          <p className="detail-promise">The public catalogue is intentionally bounded to explicit NEXT entries.</p>
          <Link className="primary-button" href="/">Return to NEXT →</Link>
        </div>
      </section>
    </main>
  );
}
