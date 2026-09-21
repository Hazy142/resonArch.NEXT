import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { services } from "@/db/schema";
import * as schema from "@/db/schema";
import { catalog } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export async function ensureCatalogInDb(db: NodePgDatabase<typeof schema>) {
  for (const product of catalog) {
    await db
      .insert(services)
      .values({
        id: product.id,
        slug: product.slug,
        family: product.family,
        title: product.title,
        promise: product.promise,
        summary: product.summary,
        technicalMaturity: product.maturity,
        productState: product.state,
        sourceRepo: product.sourceRepo,
        evidence: product.evidence,
        audiences: product.audiences,
        knownLimitations: product.knownLimitations,
        isPublic: true
      })
      .onConflictDoNothing({ target: services.id });
  }
}

export async function getCatalogWithOverrides(db: NodePgDatabase<typeof schema>): Promise<Product[]> {
  await ensureCatalogInDb(db);
  const rows = await db.select().from(services).where(eq(services.isPublic, true));
  const byId = new Map(rows.map((row) => [row.id, row]));

  return catalog
    .filter((product) => byId.get(product.id)?.isPublic !== false)
    .map((product) => {
      const row = byId.get(product.id);
      if (!row) return product;
      return {
        ...product,
        title: row.title,
        promise: row.promise,
        summary: row.summary,
        maturity: row.technicalMaturity as Product["maturity"],
        state: row.productState as Product["state"],
        sourceRepo: row.sourceRepo,
        evidence: row.evidence as Product["evidence"],
        audiences: row.audiences as Product["audiences"],
        knownLimitations: row.knownLimitations
      };
    });
}
