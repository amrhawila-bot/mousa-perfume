"use client";

import { useState } from "react";
import { adminLogin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("مرحباً بك في لوحة التحكم");
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glassmorphism rounded-3xl p-8 lg:p-10 border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">MOUSA</h1>
            <p className="text-gold text-sm tracking-widest uppercase">لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-cream/60 text-sm mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="admin@noir.com"
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
