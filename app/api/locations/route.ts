import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');

  const whereClause = storeId 
    ? { 
        storeId: parseInt(storeId),
        deletedAt: null
      }
    : { deletedAt: null };

  const locations = await prisma.location.findMany({
    where: whereClause,
    orderBy: { name: 'asc' }
  });
  
  return NextResponse.json({ locations });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone, storeId } = body;

    if (!name || !address || !storeId) {
      return NextResponse.json(
        { error: 'Name, address and storeId are required' },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        phone,
        storeId,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error creating location' },
      { status: 500 }
    );
  }
}