
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
      console.error("BACKEND_URL não configurada")

      return NextResponse.json(
        { error: "Servidor não configurado" },
        { status: 500 }
      )
    }

    const body = await req.json()

    const response = await fetch(
      `${backendUrl.replace(/\/+$/, "")}/assistant/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    )

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error("ERRO PROXY ASSISTANT:", error)

    return NextResponse.json(
      { error: "Não foi possível conectar ao assistente" },
      { status: 500 }
    )
  }
}
