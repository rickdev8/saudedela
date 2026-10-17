import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }
    const response = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
      
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Erro ao buscar usuário" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na rota /api/auth/me:", error)

    return NextResponse.json(
      { error: "Erro interno ao buscar usuário" },
      { status: 500 }
    )
  }
}