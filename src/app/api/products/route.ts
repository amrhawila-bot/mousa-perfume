import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const productSelect = {
  id: true,
  nameAr: true,
  nameEn: true,
  description: true,
  price: true,
  oldPrice: true,
  image: true,
  brand: true,
  stock: true,
  gender: true,
  concentration: true,
  size: true,
  featured: true,
  images: { select: { id: true, url: true } },
  category: { select: { nameAr: true, slug: true } },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const featured = searchParams.get("featured");
  const id = searchParams.get("id");

  if (id) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: productSelect,
    });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  }

  const where: Record<string, unknown> = { hidden: false };

  if (category) where.category = { slug: category };
  if (brand) where.brand = brand;
  if (gender) where.gender = gender;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { nameAr: { contains: search } },
      { nameEn: { contains: search } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { nameAr: "asc" };

  const products = await prisma.product.findMany({
    where: where as any,
    select: productSelect,
    orderBy,
  });

  return NextResponse.json(products);
}
