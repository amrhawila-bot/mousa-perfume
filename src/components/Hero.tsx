"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.querySelectorAll(".reveal-text"),
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen min-h-[700px] overflow-hidden bg-background"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] z-10" />
        <Scene />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <div ref={textRef} className="text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gold tracking-[0.35em] uppercase text-sm lg:text-base mb-6 font-medium"
          >
            دار العطور الفاخرة
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none mb-8"
          >
            <span className="reveal-text block text-white">
              أناقة
            </span>
            <span className="reveal-text block text-gradient">
              خالدة
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-cream/50 text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            عطور مصنوعة يدوياً في قلب فرنسا. كل قطرة تحكي قصة التراث والشغف والرقى.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="group relative px-8 py-3.5 overflow-hidden rounded-full bg-gold text-black font-medium tracking-[0.15em] uppercase text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              <span className="relative z-10">تسوق الآن</span>
              <span className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/#fragrances"
              className="px-8 py-3.5 rounded-full border border-white/20 text-cream tracking-[0.15em] uppercase text-sm hover:bg-white/5 hover:border-gold/40 transition-all duration-300"
            >
              مجموعتنا
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-cream/30">
            <span className="text-[10px] tracking-[0.3em] uppercase">
              اتمرر للأسفل
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
