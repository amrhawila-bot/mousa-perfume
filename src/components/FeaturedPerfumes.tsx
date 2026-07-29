"use client";

import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const perfumes = [
  {
    name: "نوار أبسولو",
    nameEn: "Noir Absolu",
    notes: "برغموت، عنبر، عود",
    price: 320,
    oldPrice: 380,
    color: "from-[#1a1a2e] to-[#16213e]",
    slug: "noir-absolu",
  },
  {
    name: "روز إيترنيل",
    nameEn: "Rose Éternelle",
    notes: "ورد دمشقي، زعفران، مسك",
    price: 380,
    color: "from-[#2d1b2e] to-[#1a1a2e]",
    slug: "rose-eternelle",
  },
  {
    name: "سانتال رويال",
    nameEn: "Santal Royal",
    notes: "خشب الصندل، فانيليا، كشمير",
    price: 350,
    oldPrice: 400,
    color: "from-[#1e2a1e] to-[#1a1a2e]",
    slug: "santal-royal",
  },
  {
    name: "أمبر نايت",
    nameEn: "Ambre Nuit",
    notes: "عنبر، تونكا، جلود",
    price: 420,
    color: "from-[#2e1a1a] to-[#1a1a2e]",
    slug: "ambre-nuit",
  },
];

const PerfumeCard = memo(function PerfumeCard({
  perfume,
  index,
}: {
  perfume: (typeof perfumes)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div ref={cardRef} whileHover={{ y: -8 }} className="group relative">
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-b ${perfume.color} border border-white/5 p-8 h-full min-h-[400px] flex flex-col justify-end transition-all duration-500 hover:border-gold/20`}
      >
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, rgba(212,175,55,0.15), transparent)`,
          }}
        />

        <div className="relative z-10">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6">
              <span className="text-gold text-lg font-serif">✦</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {perfume.name}
            </h3>
            <p className="text-cream/40 text-sm tracking-wide mb-4">
              {perfume.notes}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold text-xl font-semibold">
                {formatPrice(perfume.price)}
              </span>
              {perfume.oldPrice && (
                <span className="text-cream/30 text-sm line-through mr-2">
                  {formatPrice(perfume.oldPrice)}
                </span>
              )}
            </div>
            <Link
              href="/products"
              className="px-5 py-2 text-xs tracking-[0.15em] uppercase text-gold border border-gold/30 rounded-full hover:bg-gold/10 transition-all duration-300"
            >
              اكتشف
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function FeaturedPerfumes() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.querySelectorAll(".title-line"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=50",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fragrances"
      className="relative py-32 lg:py-40 bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-20">
          <p className="title-line text-gold tracking-[0.35em] uppercase text-sm mb-4 font-medium">
            عطور مميزة
          </p>
          <h2 className="title-line text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            مجموعتنا <span className="text-gradient">الفاخرة</span>
          </h2>
          <p className="title-line text-cream/40 mt-4 max-w-lg mx-auto text-sm sm:text-base">
            كل عطر هو تحفة فنية، مصنوع من أجود المكونات من جميع أنحاء العالم.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {perfumes.map((perfume, i) => (
            <PerfumeCard key={perfume.name} perfume={perfume} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(FeaturedPerfumes);
