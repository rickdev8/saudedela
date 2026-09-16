import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const response = await fetch(`${process.env.BACKEND_URL}/acompanhe-se`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    return NextResponse.json({ user: null }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}