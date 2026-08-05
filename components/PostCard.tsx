"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostItem } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/types";

export default function PostCard({ post }: { post: PostItem }) {
  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/[0.03] transition-shadow hover:shadow-md hover:shadow-zinc-900/[0.06]"
    >
      <Link href={`/posts/${post.slug}`} className="block">
        {post.coverImage ? (
          <div className="relative h-44 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-slate-100">
            <span className="font-serif-display text-3xl text-slate-300">
              {(post.title ?? "B").slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {post.category}
              </span>
            )}
            <span className="text-xs text-zinc-400">
              {formatDate(post.createdAt)} · 约{" "}
              {readingTime(post.title, post.excerpt)} 分钟
            </span>
          </div>

          <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-slate-600">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
              {post.excerpt}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-zinc-50 px-2 py-0.5 text-xs text-zinc-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
