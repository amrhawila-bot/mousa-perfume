"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/app/actions/auth";
import { useState } from "react";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: "📊" },
  { href: "/admin/products", label: "المنتجات", icon: "🧴" },
  { href: "/admin/categories", label: "التصنيفات", icon: "📁" },
  { href: "/admin/orders", label: "الطلبات", icon: "📦" },
  { href: "/admin/customers", label: "العملاء", icon: "👥" },
  { href: "/admin/settings", label: "إعدادات الحساب", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  const sidebar = (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="text-2xl font-bold tracking-wider text-white">
          MOUSA<span className="text-gold">.</span>
        </Link>
        <p className="text-cream/30 text-xs mt-1">لوحة التحكم</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
              pathname === link.href
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-cream/50 hover:text-cream hover:bg-white/5"
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
        >
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/30 hover:text-cream/60 transition-all duration-300 mt-1"
        >
          <span>🏠</span>
          <span>العودة للمتجر</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed top-0 right-0 w-64 h-full bg-charcoal border-l border-white/5 z-40 max-lg:hidden">
        {sidebar}
      </aside>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gold text-black flex items-center justify-center shadow-2xl"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="fixed top-0 right-0 w-64 h-full bg-charcoal border-l border-white/5 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
