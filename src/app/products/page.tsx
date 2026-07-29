"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
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
  featured: boolean;
  category: { nameAr: string; slug: string };
}

const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const addItem = useCart((s) => s.addItem);

  const handleAdd = useCallback(() => {
    addItem({
      productId: product.id,
      name: product.nameAr,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size,
    });
    toast.success("أضيف للسلة");
  }, [addItem, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="glassmorphism rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 transition-all duration-500 h-full flex flex-col">
        <Link href={`/products/${product.id}`} className="block">
          <div className="h-56 bg-gradient-to-br from-gold/5 to-gold/10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-gold/20 flex items-center justify-center">
              <span className="text-gold text-2xl font-bold">
                {product.nameAr.charAt(0)}
              </span>
            </div>
          </div>
        </Link>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-cream/30 text-xs mb-1">{product.brand}</p>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-base font-bold text-white mb-1 hover:text-gold transition-colors">
                {product.nameAr}
              </h3>
            </Link>
            <p className="text-cream/30 text-xs mb-1">
              {product.category.nameAr} · {product.size}
            </p>
            <p className="text-cream/30 text-xs mb-3">
              {product.concentration}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-gold font-bold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-cream/30 text-xs line-through mr-2">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="px-4 py-2 text-xs bg-gold/20 border border-gold/30 text-gold rounded-full hover:bg-gold/30 transition-all disabled:opacity-30"
            >
              {product.stock === 0 ? "نفد" : "أضف للسلة"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCategory) params.set("category", filterCategory);
    if (filterGender) params.set("gender", filterGender);
    if (filterBrand) params.set("brand", filterBrand);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);

    const controller = new AbortController();
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.filter((p: Product) => p.price <= priceRange));
        setLoading(false);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [filterCategory, filterGender, filterBrand, sort, search, priceRange]);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            جميع <span className="text-gradient">العطور</span>
          </h1>
          <p className="text-cream/40 max-w-lg mx-auto">
            اكتشف مجموعتنا الفاخرة من العطور المصنوعة بدقة وحرفية عالية.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <div className="glassmorphism rounded-2xl p-6 border border-white/5 space-y-6 sticky top-28">
              <div>
                <label className="text-cream/50 text-xs block mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن عطر..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-2">
                  التصنيف
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="">الكل</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-2">
                  الجنس
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="">الكل</option>
                  <option value="رجالي">رجالي</option>
                  <option value="حريمي">حريمي</option>
                  <option value="يونيسكس">يونيسكس</option>
                </select>
              </div>

              {brands.length > 0 && (
                <div>
                  <label className="text-cream/50 text-xs block mb-2">
                    العلامة التجارية
                  </label>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  >
                    <option value="">الكل</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-cream/50 text-xs block mb-2">
                  السعر: حتى {formatPrice(priceRange)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-2">
                  ترتيب حسب
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="">الأحدث</option>
                  <option value="price_asc">السعر: من الأقل للأعلى</option>
                  <option value="price_desc">السعر: من الأعلى للأقل</option>
                  <option value="name">الاسم</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-cream/40 text-lg">
                  لا توجد منتجات مطابقة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductsPage);
