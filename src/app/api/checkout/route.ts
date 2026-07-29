import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { name, email, phone, address, items, total } = await request.json();

    let customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      const tempPassword = await hashPassword(
        Math.random().toString(36).slice(-8)
      );
      customer = await prisma.customer.create({
        data: { name, email, password: tempPassword, phone, address },
      });

      const token = await createToken({
        id: customer.id,
        email: customer.email,
      });
      const cookieStore = await cookies();
      cookieStore.set("customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        total,
        address,
        phone,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
