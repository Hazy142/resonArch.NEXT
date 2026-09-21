"use client";

import Link from "next/link";
import { OptInPanel } from "@/components/opt-in-panel";
import { useEffect, useMemo, useState } from "react";
import { families } from "@/lib/catalog";
import type { Audience, CommunitySignal, Product } from "@/lib/types";

// ── i18n ────────────────────────────────────────────────────────────────────
type Lang = "en" | "de";

const T = {
  en: {
    navExplore: "Explore",
    navSignal: "Community Signal",
    navRoadmap: "Roadmap",
    navGithub: "GitHub ↗",
    navAdmin: "Admin",
    eyebrowHero: "PUBLIC PRODUCT LAB / OPEN SOURCE",
    heroH1a: "AI that works in the",
    heroH1b: "real world.",
    heroLede: "We build infrastructure that lets AI work with real software, engineering systems and compute — while humans stay in control. Every action leaves a receipt.",
    badge1: "Open Source", badge2: "Evidence First", badge3: "Real Systems", badge4: "Built for People",
    founderLabel: "Built by",
    founderLocation: "· Büren, Germany",
    audienceKicker: "Start with your context",
    audiences: [
      { id: "software" as Audience, label: "I build software", detail: "Agents, repos, CI, runtime.", tag: "" },
      { id: "engineering" as Audience, label: "I work in engineering", detail: "CAD, mechanics, evidence.", tag: "Most common" },
      { id: "creator" as Audience, label: "I create things", detail: "Godot, audio, media tooling.", tag: "" },
      { id: "exploring" as Audience, label: "I'm exploring", detail: "Show me the whole lab.", tag: "" },
    ],
    audienceConfirm: "✓ Good — your feed is personalised.",
    whatIsKicker: "WHAT IS resonArch?",
    whatIsH2: "One system. Multiple real-world surfaces.",
    labKicker: "02 / EXPLORE THE LAB",
    labH2: "Pick what excites you.",
    labSub: "Families help you navigate. Concrete experiments are the actual vote targets.",
    counterUnlocked: "Community signal unlocked",
    counterLocked: "Vote counts hidden until you vote",
    explore: "Explore",
    pick: "↑ PICK",
    picked: "✓ PICKED",
    provenBy: "PROVEN BY",
    productState: "PRODUCT STATE",
    communityVotes: "community votes",
    maturityKicker: "03 / HOW FAR IS THIS REALLY?",
    maturityH2: "Technical maturity ≠ product maturity.",
    maturityItems: [
      ["WORKING CORE", "A bounded technical core already exists."],
      ["PROTOTYPE", "A working or partial prototype exists."],
      ["RESEARCH PILOT", "Research implementation; product claims stay bounded."],
      ["IDEA", "Concept only. No implementation claim."],
    ],
    roadmapStates: ["SIGNALING", "VALIDATING", "BUILDING", "BETA", "AVAILABLE"],
    signalKicker: "04 / COMMUNITY SIGNAL",
    signalH2unlocked: "Here's what the community wants next.",
    signalH2locked: "Your signal comes first.",
    signalSubUnlocked: "These counts use eligible ballots only. Declared intent is shown as intent — not customers or revenue.",
    signalSubLocked: "Community rankings remain hidden until you cast a valid Top-3 ballot, reducing herd effects.",
    lockTitle: "COMMUNITY SIGNAL LOCKED",
    lockBody: "Select up to three experiments and cast your ballot to unlock the aggregate.",
    lockBodyLoss: (n: number) => n > 0 ? `You're already missing insight from ${n} voters who went before you.` : "You're missing live insight from every voter before you.",
    lockCTA: (n: number) => n > 0 ? `Review my Top ${n} →` : `Review picks →`,
    scarcityNote: "Signal closes when we move to Build phase — could be this month.",
    roadmapKicker: "05 / FROM IDEAS TO REAL TOOLS",
    roadmapH2: "You are helping decide what resonArch ships next.",
    roadmapSteps: [
      ["01", "Community votes", "People choose concrete experiments, not vague themes."],
      ["02", "We validate", "Signal quality, use cases, feasibility and cost are reviewed."],
      ["03", "We build", "Selected cuts move from signaling into productization."],
      ["04", "You get early access", "Opted-in testers can join the next validation loop."],
    ],
    ossKicker: "06 / OPEN SOURCE",
    ossH2: "Self-host it. Fork it. Or use the official resonArch instance.",
    ossSub: "NEXT itself is Apache-2.0 licensed. The resonArch name, logos and official community data are not granted by the source-code license.",
    ossBtn: "View source ↗",
    footerTagline: "Real tools. Agent-operated. Human-controlled.",
    modalKicker: "CAST YOUR SIGNAL",
    modalH2: (n: number) => `Your Top ${n}`,
    interestLabel: "What makes this interesting?",
    interestOptions: [
      ["use-myself", "I'd use it myself"],
      ["team", "My team/company could use it"],
      ["integrate-api", "I'd integrate the API"],
      ["curious", "I'm mostly curious"],
    ],
    useCaseLabel: "What would you use it for?",
    useCasePlaceholder: "A concrete use case is more valuable than generic praise.",
    betaLabel: "I'd like to test an early version.",
    payLabel: "I'd consider paying for this if it works.",
    privacyNote: "No account or email is required. Your ballot is stored under an anonymous visitor identifier.",
    submitBtn: (s: boolean) => s ? "Submitting…" : "Cast vote & unlock Community Signal →",
    dockLabel: "YOUR SIGNAL",
    dockEmpty: "Pick up to three experiments",
    dockReview: "Review →",
    eligibleVoters: "eligible voters",
    betaVoters: "beta-interested voters",
    payVoters: "payment-intent voters",
    topPick: "",
    heroSocialProof: (n: number) => n > 3 ? `Join ${n} others who already cast their signal.` : "",
  },
  de: {
    navExplore: "Erkunden",
    navSignal: "Community-Signal",
    navRoadmap: "Roadmap",
    navGithub: "GitHub ↗",
    navAdmin: "Admin",
    eyebrowHero: "ÖFFENTLICHES PRODUKT-LAB / OPEN SOURCE",
    heroH1a: "KI, die in der",
    heroH1b: "echten Welt funktioniert.",
    heroLede: "Wir bauen Infrastruktur, die KI mit echter Software, Ingenieursystemen und Rechenleistung verbindet — während Menschen die Kontrolle behalten. Jede Aktion hinterlässt einen Nachweis.",
    badge1: "Open Source", badge2: "Evidenz zuerst", badge3: "Echte Systeme", badge4: "Für Menschen gebaut",
    founderLabel: "Gebaut von",
    founderLocation: "· Büren, Deutschland",
    audienceKicker: "Starte mit deinem Kontext",
    audiences: [
      { id: "software" as Audience, label: "Ich entwickle Software", detail: "Agents, Repos, CI, Runtime.", tag: "" },
      { id: "engineering" as Audience, label: "Ich arbeite im Ingenieurwesen", detail: "CAD, Mechanik, Nachweise.", tag: "Am häufigsten" },
      { id: "creator" as Audience, label: "Ich erstelle Inhalte", detail: "Godot, Audio, Media-Tools.", tag: "" },
      { id: "exploring" as Audience, label: "Ich schaue mich um", detail: "Zeig mir das gesamte Lab.", tag: "" },
    ],
    audienceConfirm: "✓ Gut — dein Feed ist jetzt personalisiert.",
    whatIsKicker: "WAS IST resonArch?",
    whatIsH2: "Ein System. Mehrere reale Oberflächen.",
    labKicker: "02 / DAS LAB ERKUNDEN",
    labH2: "Wähl aus, was dich begeistert.",
    labSub: "Familien helfen dir zu navigieren. Konkrete Experimente sind die eigentlichen Abstimmungsziele.",
    counterUnlocked: "Community-Signal freigeschaltet",
    counterLocked: "Abstimmungszahlen bis zur Stimmabgabe versteckt",
    explore: "Details",
    pick: "↑ WÄHLEN",
    picked: "✓ GEWÄHLT",
    provenBy: "BEWIESEN DURCH",
    productState: "PRODUKTSTATUS",
    communityVotes: "Community-Stimmen",
    maturityKicker: "03 / WIE WEIT IST DAS WIRKLICH?",
    maturityH2: "Technische Reife ≠ Produktreife.",
    maturityItems: [
      ["WORKING CORE", "Ein begrenzter technischer Kern existiert bereits."],
      ["PROTOTYPE", "Ein funktionsfähiger oder teilweiser Prototyp existiert."],
      ["RESEARCH PILOT", "Forschungsimplementierung; Produktaussagen bleiben begrenzt."],
      ["IDEA", "Nur ein Konzept. Keine Implementierungsaussage."],
    ],
    roadmapStates: ["SIGNALING", "VALIDIERUNG", "BAUT", "BETA", "VERFÜGBAR"],
    signalKicker: "04 / COMMUNITY-SIGNAL",
    signalH2unlocked: "Das will die Community als nächstes.",
    signalH2locked: "Dein Signal kommt zuerst.",
    signalSubUnlocked: "Diese Zahlen verwenden nur gültige Stimmzettel. Absicht ist als Absicht dargestellt — nicht als Kunden oder Umsatz.",
    signalSubLocked: "Community-Rankings bleiben verborgen, bis du einen gültigen Top-3-Stimmzettel abgibst — um Herdeneffekte zu reduzieren.",
    lockTitle: "COMMUNITY-SIGNAL GESPERRT",
    lockBody: "Wähle bis zu drei Experimente und gib deinen Stimmzettel ab, um das Aggregat freizuschalten.",
    lockBodyLoss: (n: number) => n > 0 ? `Du verpasst bereits Einblicke von ${n} Teilnehmern, die vor dir abgestimmt haben.` : "Du verpasst live Einblicke von allen bisherigen Abstimmenden.",
    lockCTA: (n: number) => n > 0 ? `Mein Top ${n} überprüfen →` : `Auswahl überprüfen →`,
    scarcityNote: "Signal schließt, wenn wir in die Build-Phase gehen — könnte diesen Monat passieren.",
    roadmapKicker: "05 / VON IDEEN ZU ECHTEN TOOLS",
    roadmapH2: "Du hilfst zu entscheiden, was resonArch als nächstes baut.",
    roadmapSteps: [
      ["01", "Community stimmt ab", "Menschen wählen konkrete Experimente, keine vagen Themen."],
      ["02", "Wir validieren", "Signalqualität, Use Cases, Machbarkeit und Kosten werden geprüft."],
      ["03", "Wir bauen", "Ausgewählte Schnitte gehen von Signaling in die Produktisierung über."],
      ["04", "Du bekommst frühen Zugang", "Angemeldete Tester können in die nächste Validierungsrunde einsteigen."],
    ],
    ossKicker: "06 / OPEN SOURCE",
    ossH2: "Selbst hosten. Forken. Oder die offizielle resonArch-Instanz nutzen.",
    ossSub: "NEXT selbst ist unter Apache-2.0 lizenziert. Der Name resonArch, Logos und offizielle Community-Daten werden nicht durch die Quellcode-Lizenz gewährt.",
    ossBtn: "Quellcode ansehen ↗",
    footerTagline: "Echte Tools. Agent-betrieben. Menschlich kontrolliert.",
    modalKicker: "DEIN SIGNAL ABGEBEN",
    modalH2: (n: number) => `Dein Top ${n}`,
    interestLabel: "Was macht das interessant für dich?",
    interestOptions: [
      ["use-myself", "Ich würde es selbst nutzen"],
      ["team", "Mein Team/Unternehmen könnte es nutzen"],
      ["integrate-api", "Ich würde die API integrieren"],
      ["curious", "Ich bin hauptsächlich neugierig"],
    ],
    useCaseLabel: "Wofür würdest du es nutzen?",
    useCasePlaceholder: "Ein konkreter Anwendungsfall ist wertvoller als allgemeines Lob.",
    betaLabel: "Ich würde gerne eine frühe Version testen.",
    payLabel: "Ich würde dafür bezahlen, wenn es funktioniert.",
    privacyNote: "Kein Account oder E-Mail erforderlich. Dein Stimmzettel wird unter einer anonymen Besucher-ID gespeichert.",
    submitBtn: (s: boolean) => s ? "Wird eingereicht…" : "Stimme abgeben & Community-Signal freischalten →",
    dockLabel: "DEIN SIGNAL",
    dockEmpty: "Wähle bis zu drei Experimente",
    dockReview: "Überprüfen →",
    eligibleVoters: "berechtigte Abstimmende",
    betaVoters: "Beta-interessierte Abstimmende",
    payVoters: "zahlungsbereite Abstimmende",
    topPick: "",
    heroSocialProof: (n: number) => n > 3 ? `Schließ dich ${n} anderen an, die bereits abgestimmt haben.` : "",
  },
};

export function HomeExperience({ initialCatalog }: { initialCatalog: Product[] }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [audienceJustSet, setAudienceJustSet] = useState(false);
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
  const [lang, setLang] = useState<Lang>("de");

  const t = T[lang];

  useEffect(() => {
    const storedAudience = window.localStorage.getItem("next:audience") as Audience | null;
    const storedPicks = window.localStorage.getItem("next:picks");
    const storedLang = window.localStorage.getItem("next:lang") as Lang | null;
    if (storedAudience) setAudience(storedAudience);
    if (storedLang) setLang(storedLang);
    if (storedPicks) {
      try {
        const parsed = JSON.parse(storedPicks);
        if (Array.isArray(parsed)) setPicks(parsed.slice(0, 3));
      } catch { /* ignore */ }
    }
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => { if (p?.products) setCatalog(p.products); })
      .catch(() => undefined);
    fetch("/api/community-signal")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => { if (p?.products) setCommunity(p); })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (audience) window.localStorage.setItem("next:audience", audience);
  }, [audience]);
  useEffect(() => {
    window.localStorage.setItem("next:picks", JSON.stringify(picks));
  }, [picks]);
  useEffect(() => {
    window.localStorage.setItem("next:lang", lang);
  }, [lang]);

  function selectAudience(id: Audience) {
    setAudience(id);
    setAudienceJustSet(true);
    setTimeout(() => setAudienceJustSet(false), 2200);
  }

  const products = useMemo(() => {
    const filtered = family === "All" ? catalog : catalog.filter((p) => p.family === family);
    if (!audience) return filtered;
    return [...filtered].sort((a, b) => {
      const aScore = a.audiences.includes(audience) ? 1 : 0;
      const bScore = b.audiences.includes(audience) ? 1 : 0;
      return bScore - aScore;
    });
  }, [catalog, family, audience]);

  const pickedProducts = picks
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  function togglePick(id: string) {
    if (community) return;
    setVoteError(null);
    setPicks((cur) => {
      if (cur.includes(id)) return cur.filter((i) => i !== id);
      if (cur.length >= 3) {
        setVoteError(lang === "de" ? "Dein Top 3 ist voll. Entferne eine Auswahl, bevor du eine neue hinzufügst." : "Your Top 3 is full. Remove one pick before adding another.");
        return cur;
      }
      return [...cur, id];
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
        body: JSON.stringify({ serviceIds: picks, audience, interestType, useCase, betaInterest, paymentInterest }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || (lang === "de" ? "Der Stimmzettel konnte nicht angenommen werden." : "The ballot could not be accepted."));
      const result = await fetch("/api/community-signal");
      if (!result.ok) throw new Error(lang === "de" ? "Stimme angenommen, aber Community-Signal konnte noch nicht geladen werden." : "Vote accepted, but Community Signal could not be loaded yet.");
      setCommunity(await result.json());
      setReviewOpen(false);
      window.localStorage.removeItem("next:picks");
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : (lang === "de" ? "Der Stimmzettel konnte nicht angenommen werden." : "The ballot could not be accepted."));
    } finally {
      setSubmitting(false);
    }
  }

  const totalVoters = community?.eligibleVoters ?? 0;
  const socialProofText = t.heroSocialProof(totalVoters);

  return (
    <main>
      {/* Skip link for keyboard/screen reader users */}
      <a className="skip-link" href="#lab">{lang === "de" ? "Zum Inhalt springen" : "Skip to content"}</a>

      <nav className="topbar page-width">
        <a className="brand" href="#top">resonArch<span>.NEXT</span></a>
        <div className="topnav-links">
          <a href="#lab">{t.navExplore}</a>
          <a href="#signal">{t.navSignal}</a>
          <a href="#roadmap">{t.navRoadmap}</a>
          <a href="https://github.com/Hazy142/resonArch.NEXT" target="_blank" rel="noopener noreferrer" className="nav-github">{t.navGithub}</a>
          <Link href="/admin">{t.navAdmin}</Link>
          {/* Language toggle */}
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            aria-label="Switch language"
          >
            {lang === "de" ? "EN" : "DE"}
          </button>
        </div>
      </nav>

      <section className="hero page-width" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{t.eyebrowHero}</div>
            <h1>{t.heroH1a} <span>{t.heroH1b}</span></h1>
            <p className="hero-lede">{t.heroLede}</p>
            <div className="hero-badges">
              <span>{t.badge1}</span>
              <span>{t.badge2}</span>
              <span>{t.badge3}</span>
              <span>{t.badge4}</span>
            </div>
            {/* Social proof counter */}
            {socialProofText ? (
              <div className="social-proof-strip">
                <span className="social-proof-dot" aria-hidden="true">●</span>
                {socialProofText}
              </div>
            ) : null}
            <div className="founder-strip">
              <span className="founder-label">{t.founderLabel}</span>
              <a href="https://www.linkedin.com/in/elsen-andre" target="_blank" rel="noopener noreferrer" className="founder-link">
                André Elsen · Founder & Systems Architect
              </a>
              <span className="founder-location">{t.founderLocation}</span>
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

        {/* Audience selector with commitment & decoy */}
        <div className="audience-block">
          <div className="section-kicker"><span>01</span>{t.audienceKicker}</div>
          {audienceJustSet ? (
            <div className="audience-confirm" role="status" aria-live="polite">{t.audienceConfirm}</div>
          ) : null}
          <div className="audience-grid">
            {t.audiences.map((option) => (
              <button
                className={["audience-card", audience === option.id ? "selected" : "", option.tag ? "decoy" : ""].filter(Boolean).join(" ")}
                key={option.id}
                onClick={() => selectAudience(option.id)}
                aria-pressed={audience === option.id}
              >
                {option.tag ? <span className="decoy-tag">{option.tag}</span> : null}
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
            <div className="eyebrow">{t.whatIsKicker}</div>
            <h2>{t.whatIsH2}</h2>
          </div>
          <div className="system-flow">
            <span>AI</span><b>↔</b><span>{lang === "de" ? "Software" : "Software"}</span><b>↔</b><span>{lang === "de" ? "Ingenieurwesen" : "Engineering"}</span><b>↔</b><span>{lang === "de" ? "Nachweise" : "Evidence"}</span><b>↔</b><span>Compute</span>
          </div>
        </div>
      </section>

      <section className="lab-section page-width" id="lab">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.labKicker}</div>
            <h2>{t.labH2}</h2>
            <p>{t.labSub}</p>
          </div>
          <div className="counter-lock">
            {community ? t.counterUnlocked : t.counterLocked}
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
            const signal = community?.products.find((e) => e.serviceId === product.id);
            return (
              <article className={["product-card", selected ? "picked" : ""].filter(Boolean).join(" ")} key={product.id}>
                <div className="product-card-top">
                  <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="product-family">{product.family}</span>
                  <span className="maturity-chip">{product.maturity}</span>
                </div>
                <h3>{product.title}</h3>
                <p className="product-promise">{product.promise}</p>
                <p className="product-summary">{product.summary}</p>
                <div className="evidence-mini">
                  <span>{t.provenBy}</span>
                  <div>{product.evidence.map((item) => <small key={item}>{item}</small>)}</div>
                </div>
                {signal ? (
                  <div className="signal-inline">
                    <strong>{signal.votes}</strong>
                    <span>{t.communityVotes}</span>
                  </div>
                ) : null}
                <div className="product-card-footer">
                  <div>
                    <small>{t.productState}</small>
                    <strong>{product.state}</strong>
                  </div>
                  <div className="card-actions">
                    <Link href={"/products/" + product.slug}>{t.explore}</Link>
                    <button
                      className={selected ? "pick-button picked" : "pick-button"}
                      onClick={() => togglePick(product.id)}
                      disabled={Boolean(community)}
                      aria-pressed={selected}
                    >
                      {selected ? t.picked : t.pick}
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
            <div className="eyebrow">{t.maturityKicker}</div>
            <h2>{t.maturityH2}</h2>
          </div>
        </div>
        <div className="maturity-grid">
          {t.maturityItems.map(([label, text]) => (
            <div className="maturity-card" key={label}><strong>{label}</strong><p>{text}</p></div>
          ))}
        </div>
        <div className="roadmap-line">
          {t.roadmapStates.map((state, index) => (
            <div key={state}><span>{index + 1}</span><strong>{state}</strong></div>
          ))}
        </div>
      </section>

      <section className="community-section" id="signal">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t.signalKicker}</div>
              <h2>{community ? t.signalH2unlocked : t.signalH2locked}</h2>
              <p>{community ? t.signalSubUnlocked : t.signalSubLocked}</p>
            </div>
          </div>

          {community ? (
            <>
              <CommunityResults community={community} catalog={catalog} t={t} />
              <OptInPanel />
            </>
          ) : (
            <div className="locked-signal">
              <div className="lock-mark" aria-hidden="true">⌁</div>
              <div>
                <strong>{t.lockTitle}</strong>
                <p>{t.lockBody}</p>
                {/* Loss aversion: show how many voters went before */}
                <p className="loss-aversion-note">{t.lockBodyLoss(totalVoters)}</p>
                {/* Scarcity signal */}
                <p className="scarcity-note">⚠ {t.scarcityNote}</p>
              </div>
              <button
                className="primary-button"
                disabled={!audience || picks.length === 0}
                onClick={() => setReviewOpen(true)}
              >
                {t.lockCTA(picks.length)}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="roadmap-section page-width" id="roadmap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.roadmapKicker}</div>
            <h2>{t.roadmapH2}</h2>
          </div>
        </div>
        <div className="process-grid">
          {t.roadmapSteps.map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="open-source-section">
        <div className="page-width open-source-grid">
          <div>
            <div className="eyebrow">{t.ossKicker}</div>
            <h2>{t.ossH2}</h2>
            <p>{t.ossSub}</p>
          </div>
          <a className="primary-button" href="https://github.com/Hazy142/resonArch.NEXT" target="_blank" rel="noopener noreferrer">{t.ossBtn}</a>
        </div>
      </section>

      <footer className="footer page-width">
        <div className="brand">resonArch<span>.NEXT</span></div>
        <p>{t.footerTagline}</p>
        <div className="footer-links">
          <a href="https://github.com/Hazy142/resonArch.NEXT" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/elsen-andre" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
        <span>Apache-2.0</span>
      </footer>

      {/* Selection dock */}
      {!community ? (
        <div className="selection-dock">
          <div>
            <span className="dock-count">{picks.length}/3</span>
            <div>
              <strong>{t.dockLabel}</strong>
              <small>{picks.length ? pickedProducts.map((p) => p.title).join(" · ") : t.dockEmpty}</small>
            </div>
          </div>
          <button disabled={!audience || picks.length === 0} onClick={() => setReviewOpen(true)} className="dock-button">
            {t.dockReview}
          </button>
        </div>
      ) : null}

      {/* Vote modal */}
      {reviewOpen ? (
        <div className="modal-backdrop" onMouseDown={() => setReviewOpen(false)}>
          <div className="vote-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t.modalKicker}>
            <button className="modal-close" onClick={() => setReviewOpen(false)} aria-label="Close">×</button>
            <div className="eyebrow">{t.modalKicker}</div>
            <h2>{t.modalH2(picks.length)}</h2>
            <div className="review-picks">
              {pickedProducts.map((p) => (
                <div key={p.id}><span>{p.family}</span><strong>{p.title}</strong></div>
              ))}
            </div>

            <label>
              <span>{t.interestLabel}</span>
              <select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
                {t.interestOptions.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </label>

            <label>
              <span>{t.useCaseLabel} <small>optional</small></span>
              <textarea
                maxLength={500}
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder={t.useCasePlaceholder}
              />
              <small className="char-count">{useCase.length}/500</small>
            </label>

            <label className="check-row">
              <input type="checkbox" checked={betaInterest} onChange={(e) => setBetaInterest(e.target.checked)} />
              <span>{t.betaLabel}</span>
            </label>
            <label className="check-row">
              <input type="checkbox" checked={paymentInterest} onChange={(e) => setPaymentInterest(e.target.checked)} />
              <span>{t.payLabel}</span>
            </label>

            <p className="privacy-note">{t.privacyNote}</p>
            {voteError ? <div className="error-box">{voteError}</div> : null}

            <button className="primary-button wide" disabled={!audience || picks.length === 0 || submitting} onClick={castVote}>
              {t.submitBtn(submitting)}
            </button>
          </div>
        </div>
      ) : null}

      {voteError && !reviewOpen ? <div className="toast" role="alert">{voteError}</div> : null}
    </main>
  );
}

function CommunityResults({ community, catalog, t }: { community: CommunitySignal; catalog: Product[]; t: typeof T["en"] }) {
  const rows = [...community.products].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(1, ...rows.map((r) => r.votes));
  return (
    <div className="community-results">
      <div className="results-summary">
        <div><strong>{community.eligibleVoters}</strong><span>{t.eligibleVoters}</span></div>
        <div><strong>{community.betaInterestedVoters}</strong><span>{t.betaVoters}</span></div>
        <div><strong>{community.paymentInterestedVoters}</strong><span>{t.payVoters}</span></div>
      </div>
      <div className="ranking-list">
        {rows.map((row, index) => {
          const product = catalog.find((p) => p.id === row.serviceId);
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
