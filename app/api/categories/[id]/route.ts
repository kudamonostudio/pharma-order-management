import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(params.id) },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching category' },
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
    const category = await prisma.category.update({
      where: { id: Number(params.id) },
      data: body,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.update({
      where: { id: Number(params.id) },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({
      message: 'Category deleted successfully',
      category,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error deleting order' },
      { status: 500 }
    )
  }
}