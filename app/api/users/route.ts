import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, role, storeId, locationId } = body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        role,
        storeId,
        locationId,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}
