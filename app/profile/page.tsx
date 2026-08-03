import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/types";

export const metadata: Metadata = {
  title: "个人中心 · My Blog",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-3xl px-6 py-12">
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

        <section className="mb-10 flex items-center gap-6 rounded-2xl border border-zinc-200/80 bg-white p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name ?? "用户"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-serif-display text-3xl text-slate-600">
                {(user.name ?? "U").slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-serif-display text-2xl font-semibold tracking-tight text-zinc-900">
              {user.name ?? "未命名用户"}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
            <p className="mt-3 text-xs text-zinc-400">
              加入于 {formatDate(user.createdAt.toISOString())}
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900">
            我的文章（{user.posts.length}）
          </h2>
          {user.posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-14 text-center text-sm text-zinc-400">
              还没有写过文章
            </div>
          ) : (
            <ul className="space-y-3">
              {user.posts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/posts/${p.slug}`}
                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-5 py-4 transition hover:border-zinc-300 hover:shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{p.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {formatDate(p.createdAt.toISOString())}
                        {!p.published && (
                          <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-500">
                            草稿
                          </span>
                        )}
                      </p>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0 text-zinc-300"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}