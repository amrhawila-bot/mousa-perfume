"use client";

import { useState, useEffect, useCallback } from "react";
import { customerLogin, customerRegister, customerLogout } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.customer) {
          setLoggedIn(true);
          setOrders(data.orders || []);
        }
      });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const result =
        mode === "login"
          ? await customerLogin(email, password)
          : await customerRegister(name, email, password);

      setLoading(false);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(mode === "login" ? "مرحباً بعودتك" : "تم إنشاء الحساب");
        window.location.reload();
      }
    },
    [mode, name, email, password]
  );

  const handleLogout = useCallback(async () => {
    await customerLogout();
    setLoggedIn(false);
    setOrders([]);
    toast.success("تم تسجيل الخروج");
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "login" ? "register" : "login"));
  }, []);

  if (loggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">حسابي</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
            >
              تسجيل الخروج
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="glassmorphism rounded-2xl p-12 text-center border border-white/5">
              <p className="text-cream/40 mb-4">لا توجد طلبات سابقة</p>
              <a href="/products" className="text-gold hover:underline">
                تصفح المنتجات
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glassmorphism rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-cream/40 text-sm font-mono">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : order.status === "processing"
                          ? "bg-blue-500/10 text-blue-400"
                          : order.status === "delivered"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {order.status === "pending"
                        ? "قيد الانتظار"
                        : order.status === "processing"
                        ? "قيد المعالجة"
                        : order.status === "delivered"
                        ? "تم التوصيل"
                        : "ملغي"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-cream/70">
                          {item.product?.nameAr} x{item.quantity}
                        </span>
                        <span className="text-gold">
                          {(item.price * item.quantity).toLocaleString("ar-SA")} جنيه
                        </span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-white/5 my-3" />
                  <div className="flex justify-between">
                    <span className="text-cream/50 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                    <span className="text-gold font-bold">
                      {order.total.toLocaleString("ar-SA")} جنيه
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-6"
      >
        <div className="glassmorphism rounded-3xl p-8 lg:p-10 border border-white/5">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
          <p className="text-cream/40 text-sm text-center mb-8">
            {mode === "login"
              ? "مرحباً بعودتك إلى نوار"
              : "انضم إلى عالم الفخامة"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-cream/50 text-xs block mb-1">
                  الاسم
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
            )}
            <div>
              <label className="text-cream/50 text-xs block mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
            >
              {loading
                ? "جاري..."
                : mode === "login"
                ? "تسجيل الدخول"
                : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-cream/30 text-sm mt-6">
            {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
            <button onClick={toggleMode} className="text-gold hover:underline">
              {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
