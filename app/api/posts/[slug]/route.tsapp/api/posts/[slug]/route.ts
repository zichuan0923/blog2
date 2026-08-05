import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, avatar: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, avatar: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
