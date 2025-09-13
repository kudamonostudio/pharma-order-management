import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const orders = await prisma.order.findMany()
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderCode, date, status, total, locationId, userId } = body

    const order = await prisma.order.create({
      data: {
        orderCode,
        date: new Date(date),
        status,
        total,
        locationId,
        userId,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    )
  }
}
