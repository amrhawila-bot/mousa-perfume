"use client";

import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "إيزابيل لوران",
    title: "خبيرة عطور",
    rating: 5,
    text: "تجربة عطرية لا تضاهى. نوار أبسولو أصبح عطري المفضل - يدوم طويلاً ويتطور بشكل جميل خلال اليوم.",
  },
  {
    name: "جيمس ويتفيلد",
    title: "محرر نمط حياة فاخر",
    rating: 5,
    text: "الحرفية وراء كل زجاجة استثنائية. روز إيترنيل تلتقط جوهر آلاف البتلات في قطرة واحدة. فن خالص.",
  },
  {
    name: "إيلينا فوس",
    title: "جامعة عطور",
    rating: 5,
    text: "جربت عطوراً من جميع أنحاء العالم، ونوار تتفرد. سانتال رويال هو درس متقن في الأناقة الخشبية.",
  },
  {
    name: "ماركوس تشين",
    title: "مدير تجميل",
    rating: 4,
    text: "أمبر نايت معقد بشكل ساحر. مزيج العنبر والجلود يخلق دفئاً جريئاً وجذاباً في آن واحد.",
  },
];

const Stars = memo(function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
});

const ReviewCard = memo(function ReviewCard({
  review,
  index,
}: {
  review: (typeof reviews)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { x: index % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom-=80",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -4 }}
      className="glassmorphism rounded-2xl p-8 border border-white/5 hover:border-gold/15 transition-all duration-500"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 flex items-center justify-center text-gold font-bold text-lg">
          {review.name.charAt(0)}
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{review.name}</h4>
          <p className="text-cream/40 text-xs tracking-wide">
            {review.title}
          </p>
        </div>
      </div>
      <Stars count={review.rating} />
      <p className="text-cream/60 text-sm leading-relaxed mt-4 italic">
        &ldquo;{review.text}&rdquo;
      </p>
    </motion.div>
  );
});

function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.querySelectorAll(".review-title-line"),
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
      id="reviews"
      className="relative py-32 lg:py-40 bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <p className="review-title-line text-gold tracking-[0.35em] uppercase text-sm mb-4 font-medium">
            آراء العملاء
          </p>
          <h2 className="review-title-line text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            أصوات <span className="text-gradient">الأناقة</span>
          </h2>
          <p className="review-title-line text-cream/40 mt-4 text-sm sm:text-base">
            استمع إلى من جربوا الفرق مع نوار.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Reviews);
