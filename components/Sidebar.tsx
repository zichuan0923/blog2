"use client";

import type { PostItem } from "@/lib/types";

export default function Sidebar({
  posts,
  activeCategory,
  activeTag,
  onSelectCategory,
  onSelectTag,
}: {
  posts: PostItem[];
  activeCategory: string | null;
  activeTag: string | null;
  onSelectCategory: (c: string | null) => void;
  onSelectTag: (t: string | null) => void;
}) {
  const categories = Array.from(
    new Set(
      posts
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c))
    )
  );

  const tagCount = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags.split(",").map((x) => x.trim()).filter(Boolean)) {
      tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    }
  }
  const tags = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const clearable = activeCategory || activeTag;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900">
          分类
        </h3>
        <ul className="space-y-1">
          {categories.length === 0 && (
            <li className="text-sm text-zinc-400">暂无分类</li>
          )}
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => onSelectCategory(activeCategory === c ? null : c)}
                className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition ${
                  activeCategory === c
                    ? "bg-slate-700 font-medium text-white"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900">
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && (
            <span className="text-sm text-zinc-400">暂无标签</span>
          )}
          {tags.map(([t, count]) => (
            <button
              key={t}
              type="button"
              onClick={() => onSelectTag(activeTag === t ? null : t)}
              className={`rounded-full px-2.5 py-1 text-xs transition ${
                activeTag === t
                  ? "bg-slate-700 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              #{t} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900">
          关于博主
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-200">
            <span className="font-serif-display text-lg text-slate-600">M</span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">My Blog</p>
            <p className="text-xs text-zinc-400">记录思考，分享创造</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          一个简洁的个人博客，专注于技术、生活与阅读。在这里记录思考，分享有价值的文字。
        </p>
      </section>

      {clearable && (
        <button
          type="button"
          onClick={() => {
            onSelectCategory(null);
            onSelectTag(null);
          }}
          className="w-full rounded-lg border border-zinc-200 py-2 text-sm text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-800"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}
