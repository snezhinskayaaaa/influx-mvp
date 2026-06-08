import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const profiles = await prisma.profile.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ profiles });
}
