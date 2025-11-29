import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });
  return NextResponse.json(products);
}
