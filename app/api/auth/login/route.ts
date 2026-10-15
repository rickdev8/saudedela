
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    if (!data.token || !data.user) {
      return NextResponse.json(
        { message: "O backend não retornou o usuário e o token." },
        { status: 502 },
      )
    }

    const res = NextResponse.json({ user: data.user })

    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch {
    return NextResponse.json(
      { message: "Erro ao realizar login." },
      { status: 500 },
    )
  }
}
