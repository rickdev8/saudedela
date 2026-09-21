import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const response = await fetch(`${process.env.BACKEND_URL}/report`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Erro ao gerar relatório" }))
    return NextResponse.json(data, { status: response.status })
  }

  const buffer = await response.arrayBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="relatorio-saudedela.pdf"',
    },
  })
}