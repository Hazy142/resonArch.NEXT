import { describe, expect, it } from "vitest";
import { votePayloadSchema } from "@/lib/vote-schema";

const base = {
  audience: "software",
  interestType: "use-myself",
  useCase: "",
  betaInterest: false,
  paymentInterest: false
} as const;

describe("ballot validation", () => {
  it("accepts one to three distinct services", () => {
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: ["a"] }).success).toBe(true);
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: ["a", "b", "c"] }).success).toBe(true);
  });

  it("rejects zero, four or duplicate services", () => {
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: [] }).success).toBe(false);
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: ["a", "b", "c", "d"] }).success).toBe(false);
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: ["a", "a"] }).success).toBe(false);
  });

  it("bounds free-text feedback", () => {
    expect(votePayloadSchema.safeParse({ ...base, serviceIds: ["a"], useCase: "x".repeat(501) }).success).toBe(false);
  });
});
