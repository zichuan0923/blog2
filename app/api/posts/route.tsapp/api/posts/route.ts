import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const where: Prisma.PostWhereInput = { published: true };
  if (category) {
    where.category = category;
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const where: Prisma.PostWhereInput = { published: true };
  if (category) {
    where.category = category;
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}
