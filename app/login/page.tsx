"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MosaicBackground from "@/components/MosaicBackground";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      <MosaicBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="mb-8 text-center">
          <div className="font-serif-display text-2xl font-semibold tracking-tight text-zinc-800">
            My Blog
          </div>
          <p className="mt-1 text-xs tracking-[0.25em] uppercase text-zinc-500">
            Think · Write · Share
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl border border-white/50 bg-white/70 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur-md"
        >
          <div className="mb-8 flex rounded-lg bg-zinc-100/80 p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-md bg-slate-700"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {t === "login" ? "登录" : "注册"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <LoginForm onSwitchToRegister={() => setTab("register")} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <RegisterForm onSwitchToLogin={() => setTab("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}