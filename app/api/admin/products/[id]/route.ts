import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureCatalogInDb } from "@/db/catalog-sync";
import { services } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin";

const schema = z
  .object({
    technicalMaturity: z.enum(["IDEA", "PROTOTYPE", "WORKING CORE", "RESEARCH PILOT"]).optional(),
    productState: z.enum(["SIGNALING", "VALIDATING", "BUILDING", "BETA", "AVAILABLE"]).optional()
  })
  .refine((value) => Boolean(value.technicalMaturity || value.productState), "No update supplied.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product state update." }, { status: 400 });

  const { id } = await context.params;
  const db = getDb();
  await ensureCatalogInDb(db);

  const [updated] = await db
    .update(services)
    .set({
      ...(parsed.data.technicalMaturity ? { technicalMaturity: parsed.data.technicalMaturity } : {}),
      ...(parsed.data.productState ? { productState: parsed.data.productState } : {}),
      updatedAt: new Date()
    })
    .where(eq(services.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  return NextResponse.json({ updated });
}
