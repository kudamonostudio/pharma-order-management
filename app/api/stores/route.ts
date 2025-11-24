import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: { name: "asc" },
    omit: {
      deletedAt: true,
    },
  });
  return NextResponse.json(stores);
}
