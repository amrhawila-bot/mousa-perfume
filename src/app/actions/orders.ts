"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function placeOrder(data: {
  customerId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  address: string;
  phone: string;
}) {
  const order = await prisma.order.create({
    data: {
      customerId: data.customerId,
      total: data.total,
      address: data.address,
      phone: data.phone,
      status: "pending",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  revalidatePath("/account");
  return { success: true, orderId: order.id };
}
