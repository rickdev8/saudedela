
"use client";

import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";

export default function AssistentePage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((prev) => [...prev, trimmedMessage]);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <main className="tracking-page">
      <AppSidebar active="/assistente" />
      {/* menu compartilhado acima */}
      <div hidden>
        <Link className="brand sidebar-brand" href="/">
          <span className="pulse-mark">◌</span>

          <span>
            Saúde<span>Dela</span>
          </span>
        </Link>

        <div className="sidebar-user">
          <span className="avatar">M</span>

          <div>
            <strong>Olá, Marina</strong>
            <small>Seu espaço pessoal</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-label">Acompanhe-se</span>

          <Link className="sidebar-link" href="/acompanhe-se">
            <i>＋</i>
            Registro diário
          </Link>

          <Link className="sidebar-link" href="/historico">
            <i>≡</i>
            Histórico
          </Link>

          <Link className="sidebar-link" href="/graficos">
            <i>◒</i>
            Gráficos
          </Link>

          <span className="sidebar-label">SaúdeDela</span>

          <Link className="sidebar-link" href="/dados">
            <i>◌</i>
            Dados públicos
          </Link>

          <Link className="sidebar-link active" href="/assistente">
            <i>?</i>
            Assistente
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">Voltar para início</Link>
          <Link href="/entrar">Sair da conta</Link>
        </div>
      </aside></div>

      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Assistente</span>

          <Link className="login-link" href="/entrar">
            Sair
          </Link>
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
              <div className="user-message">
                Como posso entender melhor as mudanças no meu ciclo?
              </div>

              <div className="bot-message">
                <span className="bot-avatar">◌</span>

                <div>
                  <p>
                    As mudanças podem acontecer por vários motivos. Registrar
                    seu ciclo, humor e sintomas por alguns meses pode ajudar a
                    identificar padrões para conversar com um profissional.
                  </p>

                  <small>Resposta educativa, não diagnóstica.</small>

                  <div className="source-chips">
                    <span>Ministério da Saúde</span>
                    <span>FEBRASGO</span>
                  </div>
                </div>
              </div>

              {messages.map((msg, index) => (
                <div className="user-message" key={index}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma pergunta"
                aria-label="Digite uma pergunta"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                aria-label="Enviar mensagem"
              >
                Enviar
              </button>
            </div>
          </div>

          <div className="suggestion-row">
            <span>Experimente perguntar</span>

            <button
              type="button"
              onClick={() =>
                handleSuggestion("O que é um ciclo irregular?")
              }
            >
              O que é um ciclo irregular?
            </button>

            <button
              type="button"
              onClick={() =>
                handleSuggestion("Quando procurar ajuda?")
              }
            >
              Quando procurar ajuda?
            </button>

            <button
              type="button"
              onClick={() =>
                handleSuggestion("Como registrar sintomas?")
              }
            >
              Como registrar sintomas?
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

