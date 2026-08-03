"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const handleRemove = useCallback(
    (productId: string) => {
      removeItem(productId);
      toast.success("تمت الإزالة");
    },
    [removeItem]
  );

  const handleClear = useCallback(() => {
    clearCart();
    toast.success("تم إفراغ السلة");
  }, [clearCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-2 border-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-gold/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            سلتك فارغة
          </h2>
          <p className="text-cream/40 mb-6">
            تصفح مجموعتنا وأضف ما يعجبك
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-gold text-black rounded-full font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-white mb-8">سلة التسوق</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="glassmorphism rounded-2xl p-6 border border-white/5 flex items-center gap-6"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <p className="text-cream/40 text-xs">{item.size}</p>
                  <p className="text-gold font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-white/10 rounded-xl">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          handleRemove(item.productId);
                        } else {
                          updateQuantity(item.productId, item.quantity - 1);
                        }
                      }}
                      className="px-3 py-2 text-cream/40 hover:text-cream transition-colors text-sm"
                      aria-label="تقليل الكمية"
                    >
                      −
                    </button>
                    <span className="px-3 py-2 text-white text-sm min-w-[30px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-2 text-cream/40 hover:text-cream transition-colors text-sm"
                      aria-label="زيادة الكمية"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-2 text-cream/30 hover:text-red-400 transition-colors"
                    aria-label="إزالة المنتج"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glassmorphism rounded-2xl p-8 border border-white/5 h-fit sticky top-28">
            <h3 className="text-lg font-bold text-white mb-6">ملخص الطلب</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">عدد المنتجات</span>
                <span className="text-white">{itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">المجموع</span>
                <span className="text-gold font-bold text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3.5 bg-gold text-black text-center font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 mb-3"
            >
              إتمام الطلب
            </Link>
            <button
              onClick={handleClear}
              className="w-full py-2.5 text-sm text-cream/40 hover:text-red-400 transition-colors"
            >
              إفراغ السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
