"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger);

function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top bottom-=50",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        setSubmitted(true);
        setEmail("");
        toast.success("تم الاشتراك بنجاح!");
      }
    },
    [email]
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-charcoal overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div
        ref={contentRef}
        className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gold tracking-[0.35em] uppercase text-sm mb-4 font-medium"
        >
          اشترك في النشرة
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
        >
          انضم إلى <span className="text-gradient">النخبة</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-cream/50 max-w-lg mx-auto mb-10 text-sm sm:text-base leading-relaxed"
        >
          كن أول من يكتشف المجموعات الجديدة، واحصل على عروض حصرية، وإصدارات
          محدودة قبل الجميع.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism-gold rounded-2xl p-8 max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gold font-semibold text-lg">تم الاشتراك!</p>
            <p className="text-cream/50 text-sm mt-2">
              مرحباً بك في نخبة نوار. تحقق من بريدك الإلكتروني للحصول على هدية
              الترحيب.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
          >
            <div className="relative flex-1 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-full text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-black font-medium rounded-full text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 whitespace-nowrap"
            >
              اشتراك
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
