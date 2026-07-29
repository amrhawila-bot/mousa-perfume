"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/store";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "العطور", href: "/products" },
  { label: "التصنيفات", href: "/#categories" },
  { label: "آراء العملاء", href: "/#reviews" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCart((s) => s.items);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glassmorphism shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <div className="flex items-center gap-8">
            <motion.a
              href="/"
              className="text-2xl lg:text-3xl font-bold tracking-[0.3em] uppercase"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-white">MOUSA</span>
              <span className="text-gold mr-1">.</span>
            </motion.a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="relative text-sm tracking-wide text-cream/70 hover:text-gold transition-colors duration-300 group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-px bg-gradient-to-r from-gold to-gold-light transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="hidden lg:block text-cream/50 hover:text-gold transition-colors"
              aria-label="المفضلة"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative text-cream/50 hover:text-gold transition-colors"
              aria-label="سلة التسوق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden lg:block text-cream/50 hover:text-gold transition-colors"
              aria-label="حسابي"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              onClick={toggleMobile}
              className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="القائمة"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-cream block"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-px bg-cream block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-cream block"
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glassmorphism border-t border-white/5"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobile}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="text-lg tracking-wide text-cream/70 hover:text-gold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <hr className="border-white/5" />
              <Link
                href="/wishlist"
                onClick={closeMobile}
                className="text-lg tracking-wide text-cream/70 hover:text-gold transition-colors"
              >
                المفضلة
              </Link>
              <Link
                href="/account"
                onClick={closeMobile}
                className="text-lg tracking-wide text-cream/70 hover:text-gold transition-colors"
              >
                حسابي
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
