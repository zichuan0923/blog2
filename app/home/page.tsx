"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import type { PostItem } from "@/lib/types";

export default function HomePage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: { posts?: PostItem[] }) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch(() => {
        // 忽略加载失败，显示空态
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = posts;
    if (category) {
      list = list.filter((p) => p.category === category);
    }
    if (tag) {
      list = list.filter((p) =>
        p.tags
          .split(",")
          .map((t) => t.trim())
          .includes(tag)
      );
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, category, tag, query]);

  const heading = query
    ? `搜索「${query}」`
    : category && tag
      ? `${category} · #${tag}`
      : category
        ? category
        : tag
          ? `#${tag}`
          : "全部文章";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="font-serif-display text-3xl font-semibold tracking-tight text-zinc-900">
            {heading}
          </h1>
          <span className="text-sm text-zinc-400">
            {loading ? "" : `${filtered.length} 篇`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200/80 bg-white"
                  >
                    <div className="h-32 w-full bg-zinc-100" />
                    <div className="space-y-3 p-6">
                      <div className="h-3 w-20 rounded bg-zinc-100" />
                      <div className="h-5 w-3/4 rounded bg-zinc-100" />
                      <div className="h-3 w-full rounded bg-zinc-100" />
                      <div className="h-3 w-2/3 rounded bg-zinc-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-24 text-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mb-4 h-12 w-12 text-zinc-300"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p className="text-sm text-zinc-400">还没有文章</p>
                <p className="mt-1 text-xs text-zinc-300">
                  换个筛选条件试试，或稍后再来
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar
                posts={posts}
                activeCategory={category}
                activeTag={tag}
                onSelectCategory={setCategory}
                onSelectTag={setTag}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
