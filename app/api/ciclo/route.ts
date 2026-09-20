import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const body = await req.json()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const response = await fetch(`${process.env.BACKEND_URL}/ciclo`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return NextResponse.json({ user: null }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const response = await fetch(`${process.env.BACKEND_URL}/ciclo`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 404) {
    return NextResponse.json(null)
  }

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}