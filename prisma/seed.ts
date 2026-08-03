import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo 博主",
      email: "demo@example.com",
      password,
    },
  });

  const posts = [
    {
      title: "你好，世界",
      slug: "hello-world",
      excerpt: "这是我的第一篇博客，关于为什么开始写作，以及这个网站诞生的缘由。",
      category: "随笔",
      tags: "随笔,开始,写作",
      content: `# 你好，世界

这是我在这个博客上写下的第一篇文章。

## 为什么开始写作

写作是一件很奇妙的事。它把转瞬即逝的念头凝固下来，让几个月后的自己还能透过文字触摸到当时的想法。

> 写作是思考的痕迹。

## 这个网站

这个网站是一个简洁的个人博客，用 Next.js 构建。它没有花哨的装饰，只专注于文字本身。

## 接下来

我会在这里记录技术学习、生活感悟和阅读笔记。希望这些文字对你有用。

—— 谢谢阅读。`,
    },
    {
      title: "用 Next.js 14 构建个人博客的实践",
      slug: "nextjs-14-blog-practice",
      excerpt:
        "从零开始搭建一个简洁博客的完整实践：App Router、服务端组件、Markdown 渲染与认证。",
      category: "技术",
      tags: "Next.js,React,TypeScript,博客",
      content: `# 用 Next.js 14 构建个人博客的实践

最近用 Next.js 14 重写了自己的博客，记录一些关键实践。

## App Router

App Router 是 Next.js 14 的核心。文件系统即路由，配合 Server Components 可以显著减少客户端 JavaScript。

## 服务端组件

博客这类以内容为主的网站非常适合服务端组件：

- 直接查询数据库，无需客户端请求
- 天然支持 \`notFound()\` 与 \`generateMetadata\`
- 首屏渲染更快

## Markdown 渲染

使用 \`react-markdown\` 渲染文章正文，配合自定义排版样式即可获得优雅的阅读体验。

## 认证

使用 NextAuth 同时支持邮箱密码与 GitHub OAuth 登录，JWT 会话策略简单可靠。

\`\`\`ts
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [CredentialsProvider, GithubProvider],
};
\`\`\`

## 小结

简洁即美。博客的价值在于内容，工具应该退到幕后。`,
    },
    {
      title: "阅读笔记：《设计中的设计》",
      slug: "design-of-design-notes",
      excerpt:
        "原研哉的设计哲学：留白、克制与对日常生活的重新审视，其实和写博客是同一件事。",
      category: "阅读",
      tags: "阅读,设计,笔记",
      content: `# 阅读笔记：《设计中的设计》

原研哉在书中反复强调一个观点：**设计不是创造新东西，而是重新发现日常**。

## 留白的价值

他说，日本的设计喜欢留白。留白不是空，而是让观者用想象力去填充。

这和写作很像——好的文章给读者留出思考的空间，而不是把所有话说完。

## 克制的力量

> 设计就是让人生活更美好的一种思考方式。

极简不是简陋。克制意味着对每个元素的必要性都有判断。

## 对我的启发

1. 写博客时，删掉多余的形容词
2. 界面设计上，一屏只做一件事
3. 保持简单，但保持有趣

这本书值得一读再读。`,
    },
    {
      title: "记录生活的四种方式",
      slug: "four-ways-to-record-life",
      excerpt:
        "摄影、日记、代码与博客——不同媒介记录生活的不同切片，它们各自擅长捕捉什么？",
      category: "生活",
      tags: "生活,随笔,摄影",
      content: `# 记录生活的四种方式

我们总想留住些什么。不同的人用不同的方式记录生活。

## 摄影

照片捕捉瞬间的光影与情绪，一张照片可以承载千言万语。

## 日记

日记记录内心真实的波动。它不需要读者，所以格外坦诚。

## 代码

代码是思考的副产品。把它写下来，就等于把当时的思路存档。

## 博客

博客介于日记与公开发表之间。它要求你把想法整理清楚，才能对他人负责。

## 一点想法

其实不必执着于某种固定的记录方式。关键是保持记录的习惯本身。`,
    },
    {
      title: "Tailwind CSS 极简配色指南",
      slug: "tailwind-minimal-color-guide",
      excerpt:
        "如何用黑白灰与单一强调色构建一个干净耐看的界面？分享几个实用的配色思路。",
      category: "技术",
      tags: "Tailwind,CSS,设计",
      content: `# Tailwind CSS 极简配色指南

极简界面不意味着单调。关键在于**克制的层次**。

## 中性色做主调

用 \`zinc\`、\`neutral\` 或 \`stone\` 作为页面主色调：

- 背景：\`bg-[#fafafa]\` 或 \`bg-zinc-50\`
- 正文：\`text-zinc-900\`
- 次要文字：\`text-zinc-500\`
- 分割线：\`border-zinc-200\`

## 一种强调色点缀

选择一种低饱和度的强调色（比如 slate 蓝），只用于按钮、链接和选中态。

## 留白是最好的装饰

间距比颜色更重要。\`px-6 py-10\` 的慷慨留白会让界面显得高级。

记住：**少即是多**。`,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        published: true,
        authorId: user.id,
      },
    });
  }

  console.log("✅ 种子数据完成：1 个用户，", posts.length, "篇文章");
  console.log("   演示账号：demo@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });