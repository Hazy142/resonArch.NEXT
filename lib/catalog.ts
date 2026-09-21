import type { Product } from "@/lib/types";

export const families = [
  "Workspaces & Bridges",
  "Engineering & Knowledge",
  "Proof & Trust",
  "CAD & Industry",
  "Creator & Media",
  "Compute & Runtime"
] as const;

export const catalog: Product[] = [
  {
    id: "godot-agent-workspace",
    slug: "godot-agent-workspace",
    family: "Workspaces & Bridges",
    title: "Godot Agent Workspace",
    promise: "Give an AI agent a real Godot workspace it can operate.",
    summary: "A managed workspace concept built from the existing go.mcp tool bridge and isolated Godot workspaces.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/go.mcp",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "creator"],
    knownLimitations: "Commercial auth, quotas and hardened multi-tenant isolation still require productization."
  },
  {
    id: "godot-web-build",
    slug: "godot-web-build",
    family: "Workspaces & Bridges",
    title: "Godot Web Build",
    promise: "Turn a Godot project into a playable web build through an API.",
    summary: "Packages the existing headless Godot web-export path as a focused service.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/go.mcp",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "creator"],
    knownLimitations: "Needs production queueing, quotas, artifact retention and abuse controls."
  },
  {
    id: "remote-computer-bridge",
    slug: "remote-computer-bridge",
    family: "Workspaces & Bridges",
    title: "Remote Computer Bridge",
    promise: "Let an agent operate a controlled remote workstation through explicit tools.",
    summary: "A product cut from the existing desktop-mcp remote tool bridge.",
    maturity: "PROTOTYPE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/desktop-mcp",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "engineering"],
    knownLimitations: "Authentication, permissions, audit policy and deployment hardening need redesign for a public product."
  },
  {
    id: "architecture-guard",
    slug: "architecture-guard",
    family: "Engineering & Knowledge",
    title: "Architecture Guard",
    promise: "Check proposed code changes against the architecture you intended.",
    summary: "A focused service cut from sentinel-agent architecture monitoring and repository context.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/sentinel-agent",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "engineering"],
    knownLimitations: "Needs a clean GitHub App integration, stable policy schema and product-grade tenancy."
  },
  {
    id: "ci-failure-investigator",
    slug: "ci-failure-investigator",
    family: "Engineering & Knowledge",
    title: "CI Failure Investigator",
    promise: "Turn a failed CI run into a traceable investigation instead of a log dump.",
    summary: "Builds on existing CI monitoring and triage logic in sentinel-agent.",
    maturity: "PROTOTYPE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/sentinel-agent",
    evidence: ["repository"],
    audiences: ["software"],
    knownLimitations: "The productized evidence contract and provider integrations are not finalized."
  },
  {
    id: "private-repo-brain",
    slug: "private-repo-brain",
    family: "Engineering & Knowledge",
    title: "Private Repo Brain",
    promise: "Private searchable project memory for agents and humans.",
    summary: "A focused commercial surface over Nether Bridge retrieval, graph and project context infrastructure.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/nether-bridge",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "engineering"],
    knownLimitations: "The current stack is infrastructure-first and needs a narrower onboarding, permission and billing surface."
  },
  {
    id: "repo-relationship-map",
    slug: "repo-relationship-map",
    family: "Engineering & Knowledge",
    title: "Repo Relationship Map",
    promise: "See how repositories, decisions, capabilities and open loops connect.",
    summary: "Productizes PLEXUS repository indexing, capability relationships and engineering graph views.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/resonarch.PLEXUS",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "engineering"],
    knownLimitations: "Cross-project onboarding and hosted collaboration are not yet a finished service."
  },
  {
    id: "evidence-bundle-seal",
    slug: "evidence-bundle-seal",
    family: "Proof & Trust",
    title: "Evidence Bundle Seal",
    promise: "Turn a pile of evidence files into one verifiable object.",
    summary: "A narrow service built from the NEXUS evidence graph and bundle sealing model.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/resonarch.nexus",
    evidence: ["repository", "deterministic verification"],
    audiences: ["software", "engineering"],
    knownLimitations: "Hosted storage, identity and lifecycle policies still need productization."
  },
  {
    id: "nexus-verify",
    slug: "nexus-verify",
    family: "Proof & Trust",
    title: "NEXUS Verify",
    promise: "Verify an evidence bundle locally or through a small API.",
    summary: "Exposes the existing NEXUS verification path as a simple standalone verifier.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/resonarch.nexus",
    evidence: ["repository", "deterministic verification"],
    audiences: ["software", "engineering", "exploring"],
    knownLimitations: "Public API rate limits, hosted trust roots and long-term schema guarantees are not finalized."
  },
  {
    id: "calculation-receipt",
    slug: "calculation-receipt",
    family: "Proof & Trust",
    title: "Calculation Receipt",
    promise: "Attach a reproducible receipt to an engineering calculation.",
    summary: "Uses the NEXUS calculation-receipt profile to bind inputs, outputs and calculation identity.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/resonarch.nexus",
    evidence: ["repository", "deterministic verification"],
    audiences: ["engineering", "software"],
    knownLimitations: "Domain-specific authority and regulatory meaning must remain external to the receipt mechanism."
  },
  {
    id: "cad-agent",
    slug: "cad-agent",
    family: "CAD & Industry",
    title: "CAD Agent",
    promise: "Give an AI agent controlled access to real CAD operations.",
    summary: "A managed product concept built from the existing Onshape MCP tool surface.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/onshape-mcp",
    evidence: ["repository", "working prototype"],
    audiences: ["engineering", "software"],
    knownLimitations: "Credential handling, tenant isolation, exact geometry semantics and provider terms need production review."
  },
  {
    id: "cad-export-api",
    slug: "cad-export-api",
    family: "CAD & Industry",
    title: "CAD Export API",
    promise: "Request controlled CAD exports without operating the UI yourself.",
    summary: "A narrow API product cut from the Onshape export/tooling path.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/onshape-mcp",
    evidence: ["repository", "working prototype"],
    audiences: ["engineering", "software"],
    knownLimitations: "Production credentials, provider quotas and export lifecycle management are still required."
  },
  {
    id: "mechanics-api",
    slug: "mechanics-api",
    family: "CAD & Industry",
    title: "Mechanics API",
    promise: "Versioned engineering calculations with explicit model identity.",
    summary: "A product surface over the authoritative models in hecht.compute / resonArch.Mechanics.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/hecht.compute",
    evidence: ["repository", "working prototype"],
    audiences: ["engineering", "software"],
    knownLimitations: "Calculation semantics are bounded to the implemented models and are not a substitute for engineering sign-off."
  },
  {
    id: "bearing-damage-frequencies",
    slug: "bearing-damage-frequencies",
    family: "CAD & Industry",
    title: "Bearing Damage Frequencies",
    promise: "Calculate versioned bearing damage frequencies through a tiny API.",
    summary: "A deliberately narrow service around the implemented damage-frequency model in hecht.compute.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/hecht.compute",
    evidence: ["repository", "working prototype"],
    audiences: ["engineering"],
    knownLimitations: "This is calculation infrastructure, not an automatic real-world bearing diagnosis."
  },
  {
    id: "dawmind",
    slug: "dawmind",
    family: "Creator & Media",
    title: "DAWMind",
    promise: "Operate parts of FL Studio through an agent with visual and API context.",
    summary: "A creator-facing product concept based on the existing FL Studio AI agent prototype.",
    maturity: "PROTOTYPE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/flstudio-ai-agent",
    evidence: ["repository", "working prototype"],
    audiences: ["creator"],
    knownLimitations: "UI automation remains environment-sensitive and requires strong local permission controls."
  },
  {
    id: "plugin-vision",
    slug: "plugin-vision",
    family: "Creator & Media",
    title: "Plugin Vision",
    promise: "Give an agent structured visual understanding of creative software plugins.",
    summary: "A narrower experiment cut from the DAWMind vision and interaction stack.",
    maturity: "PROTOTYPE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/flstudio-ai-agent",
    evidence: ["repository"],
    audiences: ["creator", "software"],
    knownLimitations: "Recognition robustness across plugins, resolutions and themes is still research/prototype work."
  },
  {
    id: "whisper-subtitle-studio",
    slug: "whisper-subtitle-studio",
    family: "Creator & Media",
    title: "Whisper Subtitle Studio",
    promise: "Generate timestamped subtitles locally in the browser.",
    summary: "A focused product surface over the existing browser-local WhisperTitles pipeline.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/WhisperTitles",
    evidence: ["repository", "working prototype"],
    audiences: ["creator", "exploring"],
    knownLimitations: "Accuracy and runtime depend on browser/device capability and source audio quality."
  },
  {
    id: "gpu-verification",
    slug: "gpu-verification",
    family: "Compute & Runtime",
    title: "GPU Verification",
    promise: "Explore evidence-backed checks for distributed GPU execution.",
    summary: "A research-facing product hypothesis based on the fiberfec distributed GPU runtime work.",
    maturity: "RESEARCH PILOT",
    state: "SIGNALING",
    sourceRepo: "Hazy142/fiberfec-distributed-gpu-runtime",
    evidence: ["repository", "research evidence"],
    audiences: ["software", "engineering", "exploring"],
    knownLimitations: "This is a research prototype and does not claim transparent GPU context migration, production security or performance superiority."
  },
  {
    id: "deterministic-replay",
    slug: "deterministic-replay",
    family: "Compute & Runtime",
    title: "Deterministic Replay",
    promise: "Replay a deterministic runtime and prove the resulting state.",
    summary: "A product cut from the deterministic runtime and replay evidence path in rsgt-engine.",
    maturity: "WORKING CORE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/rsgt-engine",
    evidence: ["repository", "tests / gates", "deterministic replay"],
    audiences: ["software", "engineering"],
    knownLimitations: "The runtime has bounded semantics and is not a general replacement for existing game or simulation engines."
  },
  {
    id: "fibercast",
    slug: "fibercast",
    family: "Compute & Runtime",
    title: "FiberCast",
    promise: "Stream causally ordered events and media with explicit transport evidence.",
    summary: "A service hypothesis around the existing FiberCast protocol/gateway work.",
    maturity: "PROTOTYPE",
    state: "SIGNALING",
    sourceRepo: "Hazy142/resonarch-fibercast",
    evidence: ["repository", "working prototype"],
    audiences: ["software", "creator"],
    knownLimitations: "Operational scale, browser interoperability and hosted service guarantees are not yet established."
  }
];

export const catalogBySlug = new Map(catalog.map((product) => [product.slug, product]));

export function productsForAudience(audience: string | null) {
  if (!audience) return catalog;
  return [...catalog].sort((a, b) => {
    const aMatch = a.audiences.includes(audience as never) ? 1 : 0;
    const bMatch = b.audiences.includes(audience as never) ? 1 : 0;
    return bMatch - aMatch;
  });
}
