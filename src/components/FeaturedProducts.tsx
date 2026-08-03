"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart, useWishlist } from "@/lib/store";
import toast from "react-hot-toast";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  oldPrice: number | null;
  image: string;
  brand: string;
  category: { nameAr: string };
  stock: number;
}

const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();

  const handleAddToCart = useCallback(() => {
    addItem({
      productId: product.id,
      name: product.nameAr,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: "100ml",
    });
    toast.success("أضيف للسلة");
  }, [addItem, product]);

  const handleToggleWishlist = useCallback(() => {
    wishlist.toggle(product.id);
    toast.success(
      wishlist.has(product.id) ? "أزيل من المفضلة" : "أضيف للمفضلة"
    );
  }, [wishlist, product.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="glassmorphism rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 transition-all duration-500">
        <Link href={`/products/${product.id}`}>
          <div className="h-64 bg-gradient-to-br from-gold/5 to-gold/10 overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.nameAr}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="p-6">
          <p className="text-cream/30 text-xs mb-1">{product.brand}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-white mb-1 hover:text-gold transition-colors">
              {product.nameAr}
            </h3>
          </Link>
          <p className="text-cream/40 text-xs mb-4">
            {product.category.nameAr}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-cream/30 text-sm line-through mr-2">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full border transition-all ${
                  wishlist.has(product.id)
                    ? "border-gold/30 text-gold"
                    : "border-white/10 text-cream/30 hover:text-gold hover:border-gold/30"
                }`}
                aria-label="المفضلة"
              >
                <svg
                  className="w-4 h-4"
                  fill={wishlist.has(product.id) ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="p-2 rounded-full border border-white/10 text-cream/30 hover:text-gold hover:border-gold/30 transition-all disabled:opacity-30"
                aria-label="أضف للسلة"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className="relative py-32 lg:py-40 bg-charcoal"
      id="categories"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.02)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.35em] uppercase text-sm mb-4 font-medium">
            أحدث الإصدارات
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            منتجات <span className="text-gradient">مميزة</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.slice(0, 6).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 bg-gold text-black font-medium rounded-full text-sm tracking-wide hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
          >
            عرض جميع العطور
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
