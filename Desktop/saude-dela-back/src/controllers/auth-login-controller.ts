// controllers/auth.controller.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { loginSchema } from "../schemas/login-schema"
import { getUserById, validateUser } from "../services/auth-service"
import { signToken } from "../lib/jws"

export async function Login(req: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })

  try {
    const user = await validateUser(parsed.data.email, parsed.data.password)
    const token = signToken({ id: user.id, email: user.email })
    return reply.send({ user, token })
  } catch {
    return reply.status(401).send({ error: "E-mail ou senha incorretos" })
  }
}

export async function Me(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await getUserById(req.user!.id)
    return reply.send({ user })
  } catch {
    return reply.status(404).send({ error: "Usuário não encontrado" })
  }
}