import { describe, expect, it } from "vitest";
import { decisionScore } from "@/lib/scoring";

describe("transparent decision score", () => {
  it("uses the documented default weights", () => {
    expect(
      decisionScore({
        votes: 10,
        professionalIntent: 4,
        betaInterest: 3,
        paymentInterest: 2,
        meaningfulUseCases: 6
      })
    ).toBe(31);
  });
});
