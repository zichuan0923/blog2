# My Blog

简约风格的个人博客网站，基于 Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + NextAuth.js + Prisma + SQLite。

## 功能

- **欢迎页**：进入网站后 1 秒渐变切换到登录页
- **登录 / 注册**：马赛克动画背景（Canvas 网格呼吸变色 + 鼠标交互），支持邮箱密码登录、GitHub OAuth 登录
- **博客首页**：文章列表（分类 / 标签筛选、搜索）、毛玻璃导航栏、侧边栏
- **文章详情**：Markdown 渲染，优雅排版
- **个人中心**：用户信息与文章列表

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 认证 | NextAuth.js（Credentials + GitHub OAuth） |
| 数据库 | Prisma + SQLite |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（复制 .env.example 为 .env 并填写）
#    cp .env.example .env

# 3. 初始化数据库并填充种子数据
npx prisma db push
npm run seed

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

**演示账号**：`demo@example.com` / `password123`

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | SQLite 连接串，如 `file:./dev.db` |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥，生产环境请更换 |
| `NEXTAUTH_URL` | 部署地址，如 `http://localhost:3000` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth App 凭据（在 GitHub Settings → Developer settings → OAuth Apps 创建，回调地址为 `{NEXTAUTH_URL}/api/auth/callback/github`） |

## 项目结构

```
app/
├── page.tsx              欢迎页
├── login/page.tsx        登录 / 注册页
├── home/page.tsx         博客首页
├── posts/[slug]/page.tsx 文章详情
├── profile/page.tsx      个人中心
├── api/                  认证与文章 API
components/               马赛克背景、导航栏、表单等组件
lib/                      Prisma 单例、NextAuth 配置、类型
prisma/                   Schema 与种子数据
middleware.ts             路由鉴权
```
