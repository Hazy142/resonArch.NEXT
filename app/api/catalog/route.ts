import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { getCatalogWithOverrides } from "@/db/catalog-sync";
import { catalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getCatalogWithOverrides(getDb());
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: catalog, source: "static-fallback" });
  }
}
