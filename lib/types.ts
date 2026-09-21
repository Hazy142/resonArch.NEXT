export type Audience = "software" | "engineering" | "creator" | "exploring";

export type Family =
  | "Workspaces & Bridges"
  | "Engineering & Knowledge"
  | "Proof & Trust"
  | "CAD & Industry"
  | "Creator & Media"
  | "Compute & Runtime";

export type TechnicalMaturity =
  | "IDEA"
  | "PROTOTYPE"
  | "WORKING CORE"
  | "RESEARCH PILOT";

export type ProductState =
  | "SIGNALING"
  | "VALIDATING"
  | "BUILDING"
  | "BETA"
  | "AVAILABLE";

export type EvidenceType =
  | "repository"
  | "working prototype"
  | "tests / gates"
  | "deterministic verification"
  | "deterministic replay"
  | "physical run"
  | "real-world usage"
  | "research evidence";

export type Product = {
  id: string;
  slug: string;
  family: Family;
  title: string;
  promise: string;
  summary: string;
  maturity: TechnicalMaturity;
  state: ProductState;
  sourceRepo: string;
  evidence: EvidenceType[];
  audiences: Audience[];
  knownLimitations: string;
};

export type CommunityProductSignal = {
  serviceId: string;
  votes: number;
  betaInterest: number;
  paymentInterest: number;
  audiences: Record<Audience, number>;
};

export type CommunitySignal = {
  eligibleVoters: number;
  products: CommunityProductSignal[];
};
