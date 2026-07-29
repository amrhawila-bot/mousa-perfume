"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart, useWishlist } from "@/lib/store";
import toast from "react-hot-toast";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  brand: string;
  stock: number;
  gender: string;
  concentration: string;
  size: string;
  category: { nameAr: string; slug: string };
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    fetch(`/api/products?id=${id}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        return fetch(`/api/products?category=${data.category.slug}`, {
          signal: controller.signal,
        });
      })
      .then((r) => r.json())
      .then((data) => {
        setRelated(data.filter((p: Product) => p.id !== id).slice(0, 4));
        setLoading(false);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.nameAr,
      price: product.price,
      quantity,
      image: product.image,
      size: product.size,
    });
    toast.success("أضيف للسلة");
  }, [addItem, product, quantity]);

  const handleToggleWishlist = useCallback(() => {
    if (!product) return;
    wishlist.toggle(product.id);
    toast.success(
      wishlist.has(product.id) ? "أزيل من المفضلة" : "أضيف للمفضلة"
    );
  }, [wishlist, product]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <p className="text-cream/40">المنتج غير موجود</p>
      </div>
    );
  }

  const discount =
    product.oldPrice
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism rounded-3xl p-12 lg:p-16 flex items-center justify-center border border-white/5"
          >
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-2 border-gold/20 flex items-center justify-center">
              <span className="text-gold text-6xl lg:text-8xl font-bold">
                {product.nameAr.charAt(0)}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gold text-sm tracking-wide mb-2">
              {product.brand}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              {product.nameAr}
            </h1>
            <p className="text-cream/40 text-sm mb-6">{product.nameEn}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-cream/30 text-lg line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.oldPrice && (
                <span className="text-green-400 text-sm">
                  خصم {discount}%
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cream/60 text-xs">
                {product.category.nameAr}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cream/60 text-xs">
                {product.gender}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cream/60 text-xs">
                {product.concentration}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cream/60 text-xs">
                {product.size}
              </span>
              <span
                className={`px-4 py-1.5 rounded-full border text-xs ${
                  product.stock > 0
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {product.stock > 0
                  ? `متوفر (${product.stock})`
                  : "غير متوفر"}
              </span>
            </div>

            <p className="text-cream/60 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-white/10 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-cream/60 hover:text-cream transition-colors"
                  aria-label="تقليل الكمية"
                >
                  −
                </button>
                <span className="px-4 py-3 text-white min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-4 py-3 text-cream/60 hover:text-cream transition-colors"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 px-8 py-3.5 bg-gold text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
              >
                {product.stock === 0 ? "غير متوفر" : "أضف للسلة"}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 py-3.5 rounded-xl border transition-all ${
                  wishlist.has(product.id)
                    ? "border-gold/30 text-gold"
                    : "border-white/10 text-cream/40 hover:text-gold hover:border-gold/30"
                }`}
                aria-label="المفضلة"
              >
                <svg
                  className="w-5 h-5"
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
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              منتجات <span className="text-gradient">مشابهة</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="glassmorphism rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-gold text-lg font-bold">
                      {rp.nameAr.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-center mb-1 group-hover:text-gold transition-colors">
                    {rp.nameAr}
                  </h3>
                  <p className="text-gold text-center font-bold">
                    {formatPrice(rp.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProductDetail);
