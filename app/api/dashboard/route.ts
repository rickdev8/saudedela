import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const month = req.nextUrl.searchParams.get("month")
  const url = month
    ? `${process.env.BACKEND_URL}/dashboard?month=${month}`
    : `${process.env.BACKEND_URL}/dashboard`

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error("ERRO PROXY DASHBOARD:", err)
    return NextResponse.json({ error: "Não foi possível conectar ao servidor" }, { status: 500 })
  }
}