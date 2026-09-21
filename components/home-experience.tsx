"use client";

import Link from "next/link";
import { OptInPanel } from "@/components/opt-in-panel";
import { useEffect, useMemo, useState } from "react";
import { families } from "@/lib/catalog";
import type { Audience, CommunitySignal, Product } from "@/lib/types";

const audienceOptions: Array<{ id: Audience; label: string; detail: string }> = [
  { id: "software", label: "I build software", detail: "Agents, repos, CI, runtime." },
  { id: "engineering", label: "I work in engineering", detail: "CAD, mechanics, evidence." },
  { id: "creator", label: "I create things", detail: "Godot, audio, media tooling." },
  { id: "exploring", label: "I'm exploring", detail: "Show me the whole lab." }
];

const maturityCopy = [
  ["WORKING CORE", "A bounded technical core already exists."],
  ["PROTOTYPE", "A working or partial prototype exists."],
  ["RESEARCH PILOT", "Research implementation; product claims stay bounded."],
  ["IDEA", "Concept only. No implementation claim."]
] as const;

export function HomeExperience({ initialCatalog }: { initialCatalog: Product[] }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [family, setFamily] = useState<string>("All");
  const [picks, setPicks] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [interestType, setInterestType] = useState("use-myself");
  const [useCase, setUseCase] = useState("");
  const [betaInterest, setBetaInterest] = useState(false);
  const [paymentInterest, setPaymentInterest] = useState(false);
  const [community, setCommunity] = useState<CommunitySignal | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedAudience = window.localStorage.getItem("next:audience") as Audience | null;
    const storedPicks = window.localStorage.getItem("next:picks");
    if (storedAudience) setAudience(storedAudience);
    if (storedPicks) {
      try {
        const parsed = JSON.parse(storedPicks);
        if (Array.isArray(parsed)) setPicks(parsed.slice(0, 3));
      } catch {
        // Ignore malformed local UI state.
      }
    }

    fetch("/api/catalog")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.products) setCatalog(payload.products);
      })
      .catch(() => undefined);

    fetch("/api/community-signal")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.products) setCommunity(payload);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (audience) window.localStorage.setItem("next:audience", audience);
  }, [audience]);

  useEffect(() => {
    window.localStorage.setItem("next:picks", JSON.stringify(picks));
  }, [picks]);

  const products = useMemo(() => {
    const filtered = family === "All" ? catalog : catalog.filter((product) => product.family === family);
    if (!audience) return filtered;
    return [...filtered].sort((a, b) => {
      const aScore = a.audiences.includes(audience) ? 1 : 0;
      const bScore = b.audiences.includes(audience) ? 1 : 0;
      return bScore - aScore;
    });
  }, [catalog, family, audience]);

  const pickedProducts = picks
    .map((id) => catalog.find((product) => product.id === id))
    .filter(Boolean) as Product[];

  function togglePick(id: string) {
    if (community) return;
    setVoteError(null);
    setPicks((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setVoteError("Your Top 3 is full. Remove one pick before adding another.");
        return current;
      }
      return [...current, id];
    });
  }

  async function castVote() {
    if (!audience || picks.length < 1 || picks.length > 3) return;
    setSubmitting(true);
    setVoteError(null);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceIds: picks,
          audience,
          interestType,
          useCase,
          betaInterest,
          paymentInterest
        })
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "The ballot could not be accepted.");
      }

      const result = await fetch("/api/community-signal");
      if (!result.ok) throw new Error("Vote accepted, but Community Signal could not be loaded yet.");
      setCommunity(await result.json());
      setReviewOpen(false);
      window.localStorage.removeItem("next:picks");
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : "The ballot could not be accepted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <nav className="topbar page-width">
        <a className="brand" href="#top">
          resonArch<span>.NEXT</span>
        </a>
        <div className="topnav-links">
          <a href="#lab">Explore</a>
          <a href="#signal">Community Signal</a>
          <a href="#roadmap">Roadmap</a>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>

      <section className="hero page-width" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">PUBLIC PRODUCT LAB / OPEN SOURCE</div>
            <h1>AI that works in the <span>real world.</span></h1>
            <p className="hero-lede">
              We build infrastructure that lets AI work with real software, engineering systems and compute —
              while humans stay in control. Every action leaves a receipt.
            </p>
            <div className="hero-badges">
              <span>Open Source</span>
              <span>Evidence First</span>
              <span>Real Systems</span>
              <span>Built for People</span>
            </div>
          </div>
          <div className="signal-orbit" aria-hidden="true">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit-core">
              <span>NEXT</span>
              <small>community signal</small>
            </div>
          </div>
        </div>

        <div className="audience-block">
          <div className="section-kicker"><span>01</span>Start with your context</div>
          <div className="audience-grid">
            {audienceOptions.map((option) => (
              <button
                className={"audience-card " + (audience === option.id ? "selected" : "")}
                key={option.id}
                onClick={() => setAudience(option.id)}
              >
                <strong>{option.label}</strong>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="system-strip">
        <div className="page-width system-grid">
          <div>
            <div className="eyebrow">WHAT IS resonArch?</div>
            <h2>One system. Multiple real-world surfaces.</h2>
          </div>
          <div className="system-flow">
            <span>AI</span><b>↔</b><span>Software</span><b>↔</b><span>Engineering</span><b>↔</b><span>Evidence</span><b>↔</b><span>Compute</span>
          </div>
        </div>
      </section>

      <section className="lab-section page-width" id="lab">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / EXPLORE THE LAB</div>
            <h2>Pick what excites you.</h2>
            <p>Families help you navigate. Concrete experiments are the actual vote targets.</p>
          </div>
          <div className="counter-lock">
            {community ? "Community signal unlocked" : "Vote counts hidden until you vote"}
          </div>
        </div>

        <div className="family-tabs" role="tablist" aria-label="Product families">
          {["All", ...families].map((item) => (
            <button key={item} className={family === item ? "active" : ""} onClick={() => setFamily(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products.map((product, index) => {
            const selected = picks.includes(product.id);
            const signal = community?.products.find((entry) => entry.serviceId === product.id);
            return (
              <article className={"product-card " + (selected ? "picked" : "")} key={product.id}>
                <div className="product-card-top">
                  <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="product-family">{product.family}</span>
                  <span className="maturity-chip">{product.maturity}</span>
                </div>
                <h3>{product.title}</h3>
                <p className="product-promise">{product.promise}</p>
                <p className="product-summary">{product.summary}</p>

                <div className="evidence-mini">
                  <span>PROVEN BY</span>
                  <div>
                    {product.evidence.map((item) => <small key={item}>{item}</small>)}
                  </div>
                </div>

                {signal ? (
                  <div className="signal-inline">
                    <strong>{signal.votes}</strong>
                    <span>eligible community votes</span>
                  </div>
                ) : null}

                <div className="product-card-footer">
                  <div>
                    <small>PRODUCT STATE</small>
                    <strong>{product.state}</strong>
                  </div>
                  <div className="card-actions">
                    <Link href={"/products/" + product.slug}>Explore</Link>
                    <button
                      className={selected ? "pick-button picked" : "pick-button"}
                      onClick={() => togglePick(product.id)}
                      disabled={Boolean(community)}
                    >
                      {selected ? "✓ PICKED" : "↑ PICK"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="maturity-section page-width">
        <div className="section-heading compact">
          <div>
            <div className="eyebrow">03 / HOW FAR IS THIS REALLY?</div>
            <h2>Technical maturity ≠ product maturity.</h2>
          </div>
        </div>
        <div className="maturity-grid">
          {maturityCopy.map(([label, text]) => (
            <div className="maturity-card" key={label}><strong>{label}</strong><p>{text}</p></div>
          ))}
        </div>
        <div className="roadmap-line">
          {["SIGNALING", "VALIDATING", "BUILDING", "BETA", "AVAILABLE"].map((state, index) => (
            <div key={state}><span>{index + 1}</span><strong>{state}</strong></div>
          ))}
        </div>
      </section>

      <section className="community-section" id="signal">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <div className="eyebrow">04 / COMMUNITY SIGNAL</div>
              <h2>{community ? "Here's what the community wants next." : "Your signal comes first."}</h2>
              <p>
                {community
                  ? "These counts use eligible ballots only. Declared intent is shown as intent — not customers or revenue."
                  : "Community rankings remain hidden until you cast a valid Top-3 ballot, reducing herd effects."}
              </p>
            </div>
          </div>

          {community ? (
            <>
              <CommunityResults community={community} catalog={catalog} />
              <OptInPanel />
            </>
          ) : (
            <div className="locked-signal">
              <div className="lock-mark">⌁</div>
              <div>
                <strong>COMMUNITY SIGNAL LOCKED</strong>
                <p>Select up to three experiments and cast your ballot to unlock the aggregate.</p>
              </div>
              <button className="primary-button" disabled={!audience || picks.length === 0} onClick={() => setReviewOpen(true)}>
                Review my Top {picks.length || 3} →
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="roadmap-section page-width" id="roadmap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">05 / FROM IDEAS TO REAL TOOLS</div>
            <h2>You are helping decide what resonArch ships next.</h2>
          </div>
        </div>
        <div className="process-grid">
          {[
            ["01", "Community votes", "People choose concrete experiments, not vague themes."],
            ["02", "We validate", "Signal quality, use cases, feasibility and cost are reviewed."],
            ["03", "We build", "Selected cuts move from signaling into productization."],
            ["04", "You get early access", "Opted-in testers can join the next validation loop."]
          ].map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="open-source-section">
        <div className="page-width open-source-grid">
          <div>
            <div className="eyebrow">06 / OPEN SOURCE</div>
            <h2>Self-host it. Fork it. Or use the official resonArch instance.</h2>
            <p>
              NEXT itself is Apache-2.0 licensed. The resonArch name, logos and official community data are not
              granted by the source-code license.
            </p>
          </div>
          <a className="primary-button" href="https://github.com/Hazy142/resonArch.NEXT">View source ↗</a>
        </div>
      </section>

      <footer className="footer page-width">
        <div className="brand">resonArch<span>.NEXT</span></div>
        <p>Real tools. Agent-operated. Human-controlled.</p>
        <span>Apache-2.0</span>
      </footer>

      {!community ? (
        <div className="selection-dock">
          <div>
            <span className="dock-count">{picks.length}/3</span>
            <div>
              <strong>YOUR SIGNAL</strong>
              <small>{picks.length ? pickedProducts.map((item) => item.title).join(" · ") : "Pick up to three experiments"}</small>
            </div>
          </div>
          <button disabled={!audience || picks.length === 0} onClick={() => setReviewOpen(true)} className="dock-button">
            Review →
          </button>
        </div>
      ) : null}

      {reviewOpen ? (
        <div className="modal-backdrop" onMouseDown={() => setReviewOpen(false)}>
          <div className="vote-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setReviewOpen(false)} aria-label="Close">×</button>
            <div className="eyebrow">CAST YOUR SIGNAL</div>
            <h2>Your Top {picks.length}</h2>
            <div className="review-picks">
              {pickedProducts.map((product) => (
                <div key={product.id}><span>{product.family}</span><strong>{product.title}</strong></div>
              ))}
            </div>

            <label>
              <span>What makes this interesting?</span>
              <select value={interestType} onChange={(event) => setInterestType(event.target.value)}>
                <option value="use-myself">I'd use it myself</option>
                <option value="team">My team/company could use it</option>
                <option value="integrate-api">I'd integrate the API</option>
                <option value="curious">I'm mostly curious</option>
              </select>
            </label>

            <label>
              <span>What would you use it for? <small>optional</small></span>
              <textarea
                maxLength={500}
                value={useCase}
                onChange={(event) => setUseCase(event.target.value)}
                placeholder="A concrete use case is more valuable than generic praise."
              />
              <small className="char-count">{useCase.length}/500</small>
            </label>

            <label className="check-row">
              <input type="checkbox" checked={betaInterest} onChange={(event) => setBetaInterest(event.target.checked)} />
              <span>I'd like to test an early version.</span>
            </label>
            <label className="check-row">
              <input type="checkbox" checked={paymentInterest} onChange={(event) => setPaymentInterest(event.target.checked)} />
              <span>I'd consider paying for this if it works.</span>
            </label>

            <p className="privacy-note">
              No account or email is required. Your ballot is stored under an anonymous visitor identifier.
            </p>

            {voteError ? <div className="error-box">{voteError}</div> : null}

            <button className="primary-button wide" disabled={!audience || picks.length === 0 || submitting} onClick={castVote}>
              {submitting ? "Submitting…" : "Cast vote & unlock Community Signal →"}
            </button>
          </div>
        </div>
      ) : null}

      {voteError && !reviewOpen ? <div className="toast">{voteError}</div> : null}
    </main>
  );
}

function CommunityResults({ community, catalog }: { community: CommunitySignal; catalog: Product[] }) {
  const rows = [...community.products].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(1, ...rows.map((row) => row.votes));

  return (
    <div className="community-results">
      <div className="results-summary">
        <div><strong>{community.eligibleVoters}</strong><span>eligible voters</span></div>
        <div><strong>{community.betaInterestedVoters}</strong><span>beta-interested voters</span></div>
        <div><strong>{community.paymentInterestedVoters}</strong><span>payment-intent voters</span></div>
      </div>

      <div className="ranking-list">
        {rows.map((row, index) => {
          const product = catalog.find((item) => item.id === row.serviceId);
          if (!product) return null;
          return (
            <div className="ranking-row" key={row.serviceId}>
              <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="ranking-product"><strong>{product.title}</strong><small>{product.family}</small></div>
              <div className="ranking-bar"><span style={{ width: String(Math.max(4, (row.votes / maxVotes) * 100)) + "%" }} /></div>
              <strong className="ranking-count">{row.votes}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
