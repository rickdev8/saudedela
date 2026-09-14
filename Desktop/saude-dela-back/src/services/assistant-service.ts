import { db, runtime } from "../prisma/db"

import { askLLM } from "../lib/llm"
import { generateEmbedding } from "../lib/embedding"

const TOP_K = 5

export async function askAssistant(question: string) {
  const questionEmbedding = await generateEmbedding(question)

  const plan = db.sql.public.knowledge_chunks
    .select("id", "source", "title", "url", "content")
    .orderBy((f, fns) => fns.cosineDistance(f.embedding, questionEmbedding), {
      direction: "asc",
    })
    .limit(TOP_K)
    .build()

  const relevantChunks = await runtime.query(plan)

  if (relevantChunks.length === 0) {
    return {
      answer: "Ainda não tenho informação suficiente sobre isso. Recomendo procurar um profissional de saúde.",
      sources: [],
    }
  }

  const answer = await askLLM(
    question,
    relevantChunks.map((c) => c.content)
  )

  return {
    answer,
    sources: relevantChunks.map((c) => ({ title: c.title, source: c.source, url: c.url })),
  }
}