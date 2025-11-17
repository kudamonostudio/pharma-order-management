import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(params.id) },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const order = await prisma.order.update({
      where: { id: Number(params.id) },
      data: body,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error updating order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.update({
      where: { id: Number(params.id) },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({
      message: 'Order deleted successfully',
      order,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error deleting order' },
      { status: 500 }
    )
  }
}