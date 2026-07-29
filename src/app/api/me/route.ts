import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session)
    return NextResponse.json({ customer: null, orders: [] });

  const orders = await prisma.order.findMany({
    where: { customerId: session.id },
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
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

  return NextResponse.json({ customer: { id: session.id, email: session.email }, orders });
}
