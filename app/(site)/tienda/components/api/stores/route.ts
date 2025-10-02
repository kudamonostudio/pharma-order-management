import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });
  return NextResponse.json(stores);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Name and address are required' },
        { status: 400 }
      )
    }

    const store = await prisma.store.create({
      data: {
        name,
        address,
        phone,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error creating store' },
      { status: 500 }
    );
  }
}