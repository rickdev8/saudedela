type Message = { role: "user" | "assistant"; content: string }

export async function askLLM(question: string, context: string[], history: Message[] = []): Promise<string> {
  const contextText = context.map((c, i) => `[Fonte ${i + 1}]: ${c}`).join("\n\n")

  const systemPrompt = `Você é o assistente educativo do SaúdeDela, especializado em saúde da mulher.

Responda SOMENTE com base no contexto fornecido abaixo. Se a resposta não estiver no contexto, diga que não tem informação suficiente e sugira procurar um profissional de saúde.
Nunca dê diagnóstico. Seja acolhedora, clara e direta.
Use o histórico da conversa apenas para entender o contexto da pergunta atual (ex: "isso" se referindo a algo mencionado antes).

Formato da resposta:
1. Comece com uma resposta DIRETA à pergunta em 1 frase curta (ex: "Sim, isso pode acontecer." ou "Não necessariamente, mas...").
2. Depois, explique o porquê com base no contexto, de forma breve.
3. Não use frases como "com base nas informações fornecidas" ou "de acordo com o contexto" — vá direto ao conteúdo.

Contexto:
${contextText}`

  const historyContents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [...historyContents, { role: "user", parts: [{ text: question }] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: "low" },
          maxOutputTokens: 3000,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Falha ao consultar IA: ${response.status}`)
  }

  const data = await response.json()
  const candidate = data.candidates[0]

  if (candidate.finishReason === "MAX_TOKENS") {
    console.warn("⚠️ Resposta do assistente foi cortada por limite de tokens")
  }

  return candidate.content.parts[0].text
}