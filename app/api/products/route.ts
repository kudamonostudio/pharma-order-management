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
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, categoryId } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price y categoryId son requeridos' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error creando el producto' },
      { status: 500 }
    );
  }
}