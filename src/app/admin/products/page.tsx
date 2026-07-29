import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import ProductsClient from "./ProductsClient";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany();

  return <ProductsClient products={products} categories={categories} />;
}
