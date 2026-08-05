"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // 淡入 0.5s + 停留 1s 后开始淡出
    const timer = setTimeout(() => setLeaving(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    // 淡出 0.8s 结束后跳转登录页
    const timer = setTimeout(() => router.push("/login"), 800);
    return () => clearTimeout(timer);
  }, [leaving, router]);

  return (
    <motion.div
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: leaving ? 0.8 : 0.5, ease: "easeOut" }}
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex flex-col items-center justify-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-serif-display text-6xl md:text-7xl text-zinc-50 tracking-tight"
      >
        My Blog
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        className="mt-8 text-xs md:text-sm tracking-[0.35em] uppercase text-zinc-400"
      >
        Think · Write · Share
      </motion.p>
      <div className="absolute bottom-10 h-px w-16 bg-zinc-700/60" />
    </motion.div>
  );
}
