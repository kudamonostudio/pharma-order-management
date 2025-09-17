import { NextResponse } from "next/server"
import openapi from "@/openapi.json"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "🚫 Not available in production" },
      { status: 403 }
    )
  }

  return NextResponse.json(openapi)
}
