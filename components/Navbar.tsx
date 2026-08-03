"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    setSearchOpen(false);
    const q = query.trim();
    if (q) {
      router.push(`/home?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/home");
    }
    setQuery("");
  };

  const navLinkClass = (href: string): string =>
    `relative text-sm text-zinc-600 transition hover:text-zinc-900 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-slate-600 after:transition-all hover:after:w-full ${
      pathname === href ? "text-zinc-900 after:w-full" : ""
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/home"
          className="font-serif-display text-lg font-semibold tracking-tight text-zinc-900"
        >
          My Blog
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/home" className={navLinkClass("/home")}>
            首页
          </Link>
          <Link href="/about" className={navLinkClass("/about")}>
            关于
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <form
            onSubmit={submitSearch}
            className={`flex items-center transition-all ${
              searchOpen ? "w-52" : "w-0"
            }`}
          >
            {searchOpen && (
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章…"
                className="w-full rounded-md border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm outline-none transition focus:border-slate-500"
              />
            )}
          </form>

          <button
            type="button"
            aria-label="搜索"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="用户菜单"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 transition hover:border-zinc-300"
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "用户"}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-medium text-zinc-600">
                  {(session?.user?.name ?? "U").slice(0, 1).toUpperCase()}
                </span>
              )}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/5"
                  >
                    <div className="border-b border-zinc-100 px-4 py-2.5">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {session?.user?.name ?? "未登录"}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {session?.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      个人中心
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      退出登录
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}