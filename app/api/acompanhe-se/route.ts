import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const params = req.nextUrl.searchParams.toString()
  const url = `${process.env.BACKEND_URL}/acompanhe-se${params ? `?${params}` : ""}`

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error("ERRO PROXY ACOMPANHE-SE:", err)
    return NextResponse.json({ error: "Não foi possível conectar ao servidor" }, { status: 500 })
  }
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