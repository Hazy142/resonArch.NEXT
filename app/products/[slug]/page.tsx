import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { getCatalogWithOverrides } from "@/db/catalog-sync";
import { catalogBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = catalogBySlug.get(slug);

  try {
    const liveCatalog = await getCatalogWithOverrides(getDb());
    product = liveCatalog.find((item) => item.slug === slug) || product;
  } catch {
    // The source-controlled catalogue remains a deliberate offline fallback.
  }

  if (!product) notFound();

  return (
    <main className="detail-shell">
      <nav className="topbar">
        <Link className="brand" href="/">
          resonArch<span>.NEXT</span>
        </Link>
        <Link className="ghost-link" href="/#lab">
          ← Back to the lab
        </Link>
      </nav>

      <section className="detail-hero">
        <div>
          <div className="eyebrow">{product.family}</div>
          <h1>{product.title}</h1>
          <p className="detail-promise">{product.promise}</p>
          <div className="status-row">
            <span className="status-pill">{product.maturity}</span>
            <span className="state-pill">{product.state}</span>
          </div>
        </div>
        <aside className="evidence-panel">
          <div className="eyebrow">PROVEN BY</div>
          {product.evidence.length ? (
            product.evidence.map((item) => (
              <div className="evidence-line" key={item}>
                <span className="evidence-dot" />
                {item}
              </div>
            ))
          ) : (
            <p>No evidence badge is currently claimed.</p>
          )}
        </aside>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <div className="eyebrow">WHAT IT DOES</div>
          <p>{product.summary}</p>
        </article>
        <article className="detail-card">
          <div className="eyebrow">WHY IT EXISTS</div>
          <p>{product.promise}</p>
        </article>
        <article className="detail-card">
          <div className="eyebrow">WHAT ALREADY WORKS</div>
          <p>
            The maturity label above is the current public claim. The source project is{" "}
            <strong>{product.sourceRepo}</strong>; only the evidence badges shown here are claimed by NEXT.
          </p>
        </article>
        <article className="detail-card">
          <div className="eyebrow">WHAT IS STILL MISSING</div>
          <p>{product.knownLimitations}</p>
        </article>
      </section>

      <section className="detail-footer-cta">
        <div>
          <div className="eyebrow">COMMUNITY SIGNAL</div>
          <h2>Would this be useful to you?</h2>
          <p>Add it to your Top 3 from the main lab. Vote counts stay hidden until you cast your ballot.</p>
        </div>
        <Link className="primary-button" href="/#lab">
          Pick from the lab →
        </Link>
      </section>
    </main>
  );
}
