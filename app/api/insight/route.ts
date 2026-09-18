import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔥 GET /api/insight foi chamado")

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  console.log("🍪 Token:", token ? "existe" : "não existe")

  if (!token) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    )
  }

  console.log("🔗 BACKEND_URL:", process.env.BACKEND_URL)

  const response = await fetch(`${process.env.BACKEND_URL}/insight`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log("📡 Backend status:", response.status)

  const data = await response.json()

  return NextResponse.json(data, {
    status: response.status,
  })
}