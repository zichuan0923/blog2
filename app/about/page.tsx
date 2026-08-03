import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于 · My Blog",
};

export default function AboutPage() {
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

        <article className="prose-blog">
          <h1 className="font-serif-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            关于这个博客
          </h1>

          <p>
            这是一个极简风格的个人博客，用 Next.js 14、Tailwind CSS 与
            SQLite 构建。它专注于一件事：让文字成为主角。
          </p>

          <h2>这里有什么</h2>
          <ul>
            <li>技术笔记与学习记录</li>
            <li>阅读笔记与书评</li>
            <li>生活随笔与思考</li>
          </ul>

          <h2>设计理念</h2>
          <blockquote>简约不是简陋，而是对每个元素的存在都保持审慎。</blockquote>
          <p>
            黑、白、灰是基调，一种克制的强调色点缀其间。留白比装饰更重要。
          </p>

          <h2>联系我</h2>
          <p>你可以通过 GitHub 或邮箱与我联系，欢迎交流与讨论。</p>

          <p className="pt-4 text-sm text-zinc-400">— My Blog · Think · Write · Share</p>
        </article>
      </div>
    </div>
  );
}