import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const page = req.nextUrl.searchParams.get("page") ?? "1"

  const response = await fetch(`${process.env.BACKEND_URL}/acompanhe-se?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const body = await req.json()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    )
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/acompanhe-se`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  )

  const data = await response.json()

  return NextResponse.json(data, {
    status: response.status,
  })
}