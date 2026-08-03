"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";

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

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

function parseImageList(formData: FormData, field: string): string[] {
  const raw = formData.get(field);
  if (!raw || typeof raw !== "string" || !raw.trim()) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x): x is string =>
        typeof x === "string" && x.startsWith("/") && !x.includes("..")
    );
  } catch {
    return [];
  }
}

function isUploadedImage(url: string): boolean {
  return url.startsWith("/uploads/products/");
}

async function deleteImageFile(url: string) {
  if (!isUploadedImage(url)) return;
  const fileName = path.basename(url);
  const filePath = path.join(UPLOAD_DIR, fileName);
  if (!filePath.startsWith(UPLOAD_DIR)) return;
  try {
    await unlink(filePath);
  } catch {
    // ignore missing files
  }
}

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: any) => e.message).join(", ") };
  }

  const images = parseImageList(formData, "images");
  const primaryImage = images[0] || "/placeholder.svg";

  await prisma.product.create({
    data: {
      ...parsed.data,
      oldPrice: parsed.data.oldPrice || null,
      featured: formData.get("featured") === "on",
      image: primaryImage,
      images: images.length
        ? { create: images.map((url) => ({ url })) }
        : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: any) => e.message).join(", ") };
  }

  const images = parseImageList(formData, "images");
  const removedImages = parseImageList(formData, "removedImages");
  const primaryImage = images[0] || "/placeholder.svg";

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { images: { select: { url: true } } },
  });

  const existingUrls = new Set((existing?.images || []).map((img) => img.url));

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        oldPrice: parsed.data.oldPrice || null,
        featured: formData.get("featured") === "on",
        image: primaryImage,
      },
    }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    ...(images.length
      ? [prisma.productImage.createMany({ data: images.map((url) => ({ productId: id, url })) })]
      : []),
  ]);

  for (const url of removedImages) {
    if (!existingUrls.has(url)) continue;
    await deleteImageFile(url);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { image: true, images: { select: { url: true } } },
  });

  if (product) {
    const urls = new Set<string>();
    product.images.forEach((img) => urls.add(img.url));
    if (product.image) urls.add(product.image);
    for (const url of urls) {
      await deleteImageFile(url);
    }
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
