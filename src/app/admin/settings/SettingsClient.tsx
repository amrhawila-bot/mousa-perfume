"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { adminUpdateAccount, adminLogout } from "@/app/actions/auth";

interface SettingsClientProps {
  name: string;
  email: string;
}

export default function SettingsClient({
  name: initialName,
  email: initialEmail,
}: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await adminUpdateAccount({
      name,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("تم تحديث بيانات الحساب بنجاح");
    await adminLogout();
    router.push("/admin/login");
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/50 transition-colors";

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">إعدادات الحساب</h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glassmorphism rounded-3xl p-8 border border-white/5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-cream/60 text-sm mb-2">اسم المدير</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
              placeholder="اسم المدير"
            />
          </div>
          <div>
            <label className="block text-cream/60 text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="admin@noir.com"
            />
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 space-y-6">
          <p className="text-sm text-gold font-semibold">تغيير كلمة المرور</p>

          <div>
            <label className="block text-cream/60 text-sm mb-2">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-cream/60 text-sm mb-2">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass}
                placeholder="8 أحرف على الأقل"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass}
                placeholder="أعد إدخال كلمة المرور"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </motion.form>
    </div>
  );
}
