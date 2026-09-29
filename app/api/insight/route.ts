import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/insight`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error("ERRO PROXY INSIGHT:", err)
    return NextResponse.json({ error: "Não foi possível conectar ao servidor" }, { status: 500 })
  }
}