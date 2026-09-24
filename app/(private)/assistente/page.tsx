"use client";


import Image from "next/image";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useState } from "react";
import { useAuth } from "@/app/context/auth";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; source: string; url: string | null }[];
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    content: "Como posso entender melhor as mudanças no meu ciclo?",
  },
  {
    role: "assistant",
    content:
      "As mudanças podem acontecer por vários motivos. Registrar seu ciclo, humor e sintomas por alguns meses pode ajudar a identificar padrões para conversar com um profissional.",
    sources: [
      {
        title: "Ministério da Saúde",
        source: "Ministério da Saúde",
        url: null,
      },
      { title: "FEBRASGO", source: "FEBRASGO", url: null },
    ],
  },
];

const MAX_HISTORY_MESSAGES = 6;

export default function AssistentePage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { logout } = useAuth();

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedMessage },
    ];
    setMessages(nextMessages);
    setMessage("");
    setErrorMessage(null);
    setIsSending(true);

    try {
      const history = nextMessages
        .slice(0, -1)
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assistant/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmedMessage, history }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error ?? "Não foi possível obter uma resposta agora.",
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources ?? [],
        },
      ]);
    } catch {
      setErrorMessage("Não foi possível conectar ao assistente.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      event.keyCode !== 229
    ) {
      handleSendMessage();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <main className="tracking-page">
      <AppSidebar active="/assistente" />

      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Assistente</span>

          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>

        <section className="assistant-page section-wrap">
          <div className="assistant-intro">
            <p className="tracking-context">Converse com evidências</p>

            <h1>
              Uma dúvida sua.
              <br />
              <em>Fontes de verdade.</em>
            </h1>

            <p className="tracking-lead">
              Faça uma pergunta sobre saúde feminina e encontre caminhos para
              continuar sua investigação, sempre com fontes confiáveis por
              perto.
            </p>
          </div>

          <div className="conversation-card">
            <div className="chat-header">
              <span>
                <i />
                Assistente SaúdeDela
              </span>

              <span>Baseado em fontes públicas</span>
            </div>

            <div className="conversation-body">
              {messages.map((msg, index) =>
                msg.role === "user" ? (
                  <div className="user-message" key={index}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="bot-message" key={index}>
                    <Image
                      src="/Design sem nome (4) (1).png"
                      alt="Assistente SaúdeDela"
                      width={55}
                      height={55}
                      className="bot-avatar"
                    />

                    <div>
                      <p>{msg.content}</p>

                      <small>Resposta educativa, não diagnóstica.</small>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="source-chips">
                          {Array.from(
                            new Set(msg.sources.map((s) => s.source)),
                          ).map((sourceName, sourceIndex) => (
                            <span key={sourceIndex}>{sourceName}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}

              {isSending && (
                <div className="bot-message">
                  <Image
                    src="/Design sem nome (4) (1).png"
                    alt="Assistente SaúdeDela"
                    width={38}
                    height={38}
                    className="bot-avatar"
                  />
                  <div>
                    <span className="thinking-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              )}

              
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma pergunta"
                aria-label="Digite uma pergunta"
                disabled={isSending}
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                aria-label="Enviar mensagem"
              >
                {isSending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>

          <div className="suggestion-row">
            <span>Experimente perguntar</span>

            <button
              type="button"
              onClick={() => handleSuggestion("O que é um ciclo irregular?")}
            >
              O que é um ciclo irregular?
            </button>

            <button
              type="button"
              onClick={() => handleSuggestion("Quando procurar ajuda?")}
            >
              Quando procurar ajuda?
            </button>

            <button
              type="button"
              onClick={() => handleSuggestion("Como registrar sintomas?")}
            >
              Como registrar sintomas?
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
