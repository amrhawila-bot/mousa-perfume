import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany();

  return <ProductsClient products={products} categories={categories} />;
}
