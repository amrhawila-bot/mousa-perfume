"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist, useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const addItem = useCart((s) => s.addItem);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (wishlist.items.length === 0) {
      setProducts([]);
      return;
    }
    Promise.all(
      wishlist.items.map((id) =>
        fetch(`/api/products?id=${id}`).then((r) => r.json())
      )
    ).then(setProducts);
  }, [wishlist.items]);

  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-2 border-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">قائمة المفضلة فارغة</h2>
          <p className="text-cream/40 mb-6">أضف منتجاتك المفضلة هنا</p>
          <Link href="/products" className="inline-block px-8 py-3 bg-gold text-black rounded-full font-semibold">
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-white mb-8">المفضلة</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) =>
            product && !product.error ? (
              <div key={product.id} className="glassmorphism rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition-all">
                <Link href={`/products/${product.id}`}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 mx-auto mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.nameAr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-semibold text-center mb-1">{product.nameAr}</h3>
                </Link>
                <p className="text-gold font-bold text-center mb-4">{formatPrice(product.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        name: product.nameAr,
                        price: product.price,
                        quantity: 1,
                        image: product.image,
                        size: product.size || "100ml",
                      });
                      toast.success("أضيف للسلة");
                    }}
                    className="flex-1 py-2 text-sm bg-gold/20 border border-gold/30 text-gold rounded-xl hover:bg-gold/30 transition-all"
                  >
                    أضف للسلة
                  </button>
                  <button
                    onClick={() => {
                      wishlist.toggle(product.id);
                      toast.success("أزيل من المفضلة");
                    }}
                    className="px-3 py-2 text-sm border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
