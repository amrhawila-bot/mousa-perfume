"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">سلتك فارغة</h2>
          <Link href="/products" className="text-gold hover:underline">تسوق الآن</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, items, total }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        clearCart();
        router.push(`/order-confirmation?id=${data.orderId}`);
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-white mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="glassmorphism rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-white font-semibold mb-4">معلومات التوصيل</h3>
              <div>
                <label className="text-cream/50 text-xs block mb-1">الاسم الكامل</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-cream/50 text-xs block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-cream/50 text-xs block mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-cream/50 text-xs block mb-1">عنوان التوصيل</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? "جاري المعالجة..." : `تأكيد الطلب - ${formatPrice(total)}`}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="glassmorphism rounded-2xl p-6 border border-white/5 sticky top-28">
              <h3 className="text-white font-semibold mb-4">المنتجات</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-cream/70">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-gold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-white/5 mb-4" />
              <div className="flex justify-between">
                <span className="text-white font-semibold">المجموع</span>
                <span className="text-gold font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
