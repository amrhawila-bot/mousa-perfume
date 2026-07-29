"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto px-6"
    >
      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">تم تأكيد الطلب!</h1>
      <p className="text-cream/50 mb-2">شكراً لك على طلبك. سنقوم بمعالجته قريباً.</p>
      {orderId && (
        <p className="text-cream/30 text-sm mb-8 font-mono">
          رقم الطلب: #{orderId.slice(0, 8)}
        </p>
      )}
      <Link
        href="/products"
        className="inline-block px-8 py-3 bg-gold text-black rounded-full font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
      >
        متابعة التسوق
      </Link>
    </motion.div>
  );
}

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
      <Suspense fallback={
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
