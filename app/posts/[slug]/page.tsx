import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
    select: { title: true, excerpt: true },
  });
  if (!post) return {};
  return { title: `${post.title} · My Blog`, description: post.excerpt ?? undefined };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
    include: {
      author: { select: { name: true, avatar: true } },
    },
  });

  if (!post) notFound();

  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-[720px] px-6 py-12">
        <Link
          href="/home"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回首页
        </Link>

        <article>
          <header className="mb-10 border-b border-zinc-200/80 pb-8">
            {post.category && (
              <span className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {post.category}
              </span>
            )}
            <h1 className="font-serif-display text-3xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400">
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                {post.author?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.avatar}
                    alt={post.author.name ?? "作者"}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-medium text-slate-600">
                    {(post.author?.name ?? "M").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
              <span>{post.author?.name ?? "博主"}</span>
              <span>·</span>
              <time dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt.toISOString())}
              </time>
            </div>
          </header>

          {post.coverImage && (
            <div className="mb-10 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose-blog">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {tags.length > 0 && (
            <footer className="mt-12 flex flex-wrap gap-2 border-t border-zinc-200/80 pt-8">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500"
                >
                  #{t}
                </span>
              ))}
            </footer>
          )}
        </article>
      </div>
    </div>
  );
}