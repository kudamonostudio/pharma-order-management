import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(params.id) },
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const store = await prisma.store.update({
      where: { id: Number(params.id) },
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
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.update({
      where: { id: Number(params.id) },
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