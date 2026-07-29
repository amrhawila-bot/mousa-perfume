"use client";

import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const brands = [
  { name: "Chanel", tagline: "الأسطورة" },
  { name: "Dior", tagline: "الأناقة" },
  { name: "Creed", tagline: "الإرث" },
  { name: "Tom Ford", tagline: "الفخامة" },
  { name: "Byredo", tagline: "الفن" },
  { name: "Le Labo", tagline: "الشغف" },
];

const BrandCard = memo(function BrandCard({
  brand,
  index,
}: {
  brand: (typeof brands)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom-=50",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div ref={cardRef} whileHover={{ scale: 1.05 }} className="group">
      <div className="glassmorphism rounded-2xl p-8 lg:p-10 text-center h-full flex flex-col items-center justify-center gap-4 border border-white/5 hover:border-gold/20 transition-all duration-500 cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-2">
          <span className="text-gold text-2xl font-bold">
            {brand.name.charAt(0)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide">
          {brand.name}
        </h3>
        <p className="text-cream/40 text-xs tracking-[0.2em] uppercase">
          {brand.tagline}
        </p>
      </div>
    </motion.div>
  );
});

function Brands() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.querySelectorAll(".brand-title-line"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
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
      id="brands"
      className="relative py-32 lg:py-40 bg-charcoal"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <p className="brand-title-line text-gold tracking-[0.35em] uppercase text-sm mb-4 font-medium">
            دور العطور
          </p>
          <h2 className="brand-title-line text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            علامات <span className="text-gradient">مختارة</span>
          </h2>
          <p className="brand-title-line text-cream/40 mt-4 text-sm sm:text-base">
            أشهر بيوت العطور العالمية، مجتمعة تحت سقف واحد.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {brands.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Brands);
