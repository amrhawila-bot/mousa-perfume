"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  nameAr: z.string().min(1, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  brand: z.string().min(1, "العلامة التجارية مطلوبة"),
  categoryId: z.string().min(1, "التصنيف مطلوب"),
  price: z.string().transform(Number),
  oldPrice: z.string().transform(Number).optional(),
  stock: z.string().transform(Number),
  gender: z.string(),
  concentration: z.string(),
  size: z.string(),
  featured: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: any) => e.message).join(", ") };
  }

  await prisma.product.create({
    data: {
      ...parsed.data,
      oldPrice: parsed.data.oldPrice || null,
      featured: formData.get("featured") === "on",
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: any) => e.message).join(", ") };
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      oldPrice: parsed.data.oldPrice || null,
      featured: formData.get("featured") === "on",
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}
