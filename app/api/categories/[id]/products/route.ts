import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: {
    id: string
  }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const categoryId = Number(params.id)

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category id' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId,
        deletedAt: null,
      },
      omit: {
        deletedAt: true,
      },
    })

    return NextResponse.json(products);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching products for category' },
      { status: 500 }
    )
  }
}
