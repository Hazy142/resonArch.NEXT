import { describe, expect, it } from "vitest";
import { catalog, families } from "@/lib/catalog";

describe("NEXT catalogue", () => {
  it("contains the approved six families and twenty vote targets", () => {
    expect(families).toHaveLength(6);
    expect(catalog).toHaveLength(20);
  });

  it("has stable unique ids and slugs", () => {
    expect(new Set(catalog.map((item) => item.id)).size).toBe(catalog.length);
    expect(new Set(catalog.map((item) => item.slug)).size).toBe(catalog.length);
  });

  it("keeps evidence claims explicit and bounded", () => {
    const gpu = catalog.find((item) => item.id === "gpu-verification");
    expect(gpu?.maturity).toBe("RESEARCH PILOT");
    expect(gpu?.evidence).toContain("research evidence");
    expect(gpu?.evidence).not.toContain("physical run");
  });
});
