import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      total: true,
      status: true,
      address: true,
      phone: true,
      createdAt: true,
      customer: { select: { name: true, email: true } },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: { select: { nameAr: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
