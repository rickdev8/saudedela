import { z } from "zod"

export const trackerEntrySchema = z.object({
  date: z.coerce.date(),
  flow: z.enum(["Sem fluxo", "Leve", "Moderado", "Intenso"]).optional().nullable(),
  mood: z.string().trim().max(40).optional().nullable(),
  symptoms: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  painIntensity: z.enum(["Nenhuma", "Leve", "Moderada", "Forte", "Muito forte"]).optional().nullable(),
  energy: z.enum(["Baixa", "Normal", "Alta"]).optional().nullable(),
  sleep: z.enum(["Ruim", "Regular", "Bom"]).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
})

export type TrackerEntryInput = z.infer<typeof trackerEntrySchema>
