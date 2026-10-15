import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_ROUTES = [
  "/",
  "/entrar",
  "/criar-conta",
  "/auth/dados",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
]

const secret = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null

if (!secret) {
  console.error("JWT_SECRET ausente no frontend: todas as rotas protegidas vão redirecionar pro login.")
}

function matches(pathname: string, route: string) {
  return pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
}

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some((route) => matches(pathname, route))
}

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token || !secret) return false

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] })
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()
  if (await hasValidSession(req)) return NextResponse.next()

  const response = pathname.startsWith("/api/")
    ? NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    : NextResponse.redirect(new URL("/entrar", req.url))

  if (req.cookies.has("token")) {
    response.cookies.delete("token")
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}