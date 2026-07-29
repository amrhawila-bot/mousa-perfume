import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { nameAr, nameEn } = await request.json();
  const slug = nameEn.toLowerCase().replace(/\s+/g, "-");

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "التصنيف موجود بالفعل" }, { status: 400 });

  const category = await prisma.category.create({ data: { nameAr, nameEn, slug } });
  return NextResponse.json(category);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, nameAr, nameEn } = await request.json();
  const slug = nameEn.toLowerCase().replace(/\s+/g, "-");

  const category = await prisma.category.update({
    where: { id },
    data: { nameAr, nameEn, slug },
  });
  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const hasProducts = await prisma.product.findFirst({ where: { categoryId: id } });
  if (hasProducts) {
    return NextResponse.json(
      { error: "لا يمكن حذف التصنيف لأنه يحتوي على منتجات" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
