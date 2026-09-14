import { FastifyRequest, FastifyReply } from "fastify"
import { registerSchema } from "../schemas/register-schema"
import { createUser } from "../services/auth-service"

export async function Register(req: FastifyRequest, reply: FastifyReply) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
  
    try {
      const user = await createUser(parsed.data.name, parsed.data.email, parsed.data.password)
      return reply.status(201).send({ user })
    } catch (err: any) {
      if (err.message === "EMAIL_IN_USE") {
        return reply.status(409).send({ error: "E-mail já cadastrado" })
      }
      return reply.status(500).send({ error: "Erro ao criar conta" })
    }
  }