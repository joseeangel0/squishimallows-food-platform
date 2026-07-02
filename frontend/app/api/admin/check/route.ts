import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const admin = await requireAdmin();
    return NextResponse.json({ isAdmin: !!admin });
  } catch (e) {
    console.error("[admin/check]", e);
    return NextResponse.json({ isAdmin: false });
  }
}
