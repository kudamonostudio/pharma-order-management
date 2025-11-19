import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching store' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const store = await prisma.store.update({
      where: { slug: params.slug },
      data: body,
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error updating store' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const store = await prisma.store.update({
      where: { slug: params.slug },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({
      message: 'store deleted successfully',
      store,
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error deleting store' },
      { status: 500 }
    );
  }
}