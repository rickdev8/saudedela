import { FastifyReply, FastifyRequest } from "fastify"
import { db } from "../prisma/db"
import { trackerEntrySchema } from "../schemas/tracker-schema"

const flowMap = { "Sem fluxo": "none", Leve: "light", Moderado: "medium", Intenso: "heavy" } as const

export async function createEntry(req: FastifyRequest, reply: FastifyReply) {
  const parsed = trackerEntrySchema.safeParse(req.body)
  if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })

  const userId = (req.user as { id: string }).id
  const entry = await db.orm.public.SymptomEntry.create({
    userId,
    date: parsed.data.date,
    flow: parsed.data.flow ? flowMap[parsed.data.flow] : null,
    mood: parsed.data.mood ?? null,
    symptoms: parsed.data.symptoms,
    painIntensity: parsed.data.painIntensity ?? null,
    energy: parsed.data.energy ?? null,
    sleep: parsed.data.sleep ?? null,
    notes: parsed.data.notes ?? null,
  })
  return reply.status(201).send({ entry })
}

export async function listEntries(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as { id: string }).id
  const entries = await db.orm.public.SymptomEntry.where({ userId }).orderBy("date", "desc").all()
  return reply.send({ entries })
}
