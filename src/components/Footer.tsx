"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  المجموعات: ["نوار أبسولو", "روز إيترنيل", "سانتال رويال", "أمبر نايت"],
  اكتشف: ["عن نوار", "حرفيتنا", "الاستدامة", "الصحافة"],
  الدعم: ["اتصل بنا", "الشحن", "الإرجاع", "الأسئلة الشائعة"],
};

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.02)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="py-20 lg:py-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
            <div className="col-span-2 md:col-span-1">
              <motion.a
                href="/"
                className="text-2xl lg:text-3xl font-bold tracking-[0.3em] uppercase inline-block mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-white">MOUSA</span>
                <span className="text-gold mr-1">.</span>
              </motion.a>
              <p className="text-cream/40 text-sm leading-relaxed max-w-xs">
                نصنع العطور الخالدة منذ 1924. كل زجاجة هي شهادة على التزامنا بالجودة التي لا تُضاهى.
              </p>
              <div className="flex gap-4 mt-6">
                {["IG", "FB", "TW", "YT"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-cream/40 text-xs tracking-wider hover:border-gold/30 hover:text-gold transition-all duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-semibold text-sm tracking-wide mb-6">
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-cream/40 text-sm hover:text-gold transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs tracking-wide text-center sm:text-right">
            &copy; {new Date().getFullYear()} MOUSA Parfum. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-cream/30 text-xs hover:text-gold transition-colors duration-300">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-cream/30 text-xs hover:text-gold transition-colors duration-300">
              شروط الخدمة
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
