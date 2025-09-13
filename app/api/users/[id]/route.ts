import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching user' },
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

    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({
      message: 'User deleted successfully',
      user,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error deleting user' },
      { status: 500 }
    )
  }
}