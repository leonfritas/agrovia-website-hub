// Temporarily disable NextAuth API route
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "NextAuth temporarily disabled" }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ error: "NextAuth temporarily disabled" }, { status: 503 });
}
