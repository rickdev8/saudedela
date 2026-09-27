"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";

export default function DadosPage() {
    const { logout } = useAuth()

  return (
    <main className="tracking-page">
      <AppSidebar active="/dados" />
      <div className="tracking-main">
       
        <section className="content-page section-wrap">
          <p className="tracking-context">SaúdeDela</p>
          <h1>
            Informação que
            <br />
            <em>faz diferença.</em>
          </h1>
          <p className="tracking-lead">
            Explore dados públicos sobre saúde feminina no Brasil, apresentados
            com contexto e fontes para que você possa fazer perguntas melhores.
          </p>
          <section className="dignidade-banner" aria-labelledby="dignidade-title">
            <div className="dignidade-badge">DIREITO E CUIDADO</div>
            <div className="dignidade-content">
              <p className="card-index">Programa Dignidade Menstrual</p>
              <h2 id="dignidade-title">Absorvente gratuito também é política de saúde.</h2>
              <p>
                O programa do Governo Federal oferece absorventes gratuitos para pessoas que menstruam em situação de vulnerabilidade. A retirada é feita em farmácias credenciadas, com autorização emitida pelo Meu SUS Digital.
              </p>
              <a className="dignidade-link" href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dignidade-menstrual" target="_blank" rel="noreferrer">
                Entenda o programa no portal do Governo Federal <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
          <div className="public-stat-grid">
            <article>
              <span>01</span>
              <strong>42,8%</strong>
              <p>das consultas na atenção básica em 2024 foram de mulheres.</p>
              <small>Fonte: SISAB, 2024</small>
            </article>
            <article>
              <span>02</span>
              <strong>8,4 mi</strong>
              <p>atendimentos relacionados à saúde da mulher registrados.</p>
              <small>Fonte: DATASUS, 2023</small>
            </article>
            <article>
              <span>03</span>
              <strong>+18%</strong>
              <p>crescimento de acompanhamentos preventivos no período.</p>
              <small>Fonte: Ministério da Saúde</small>
            </article>
          </div>
          <section className="data-topic-grid" aria-label="Temas de saúde feminina">
            <article>
              <span className="topic-number">01</span>
              <h2>Saúde menstrual</h2>
              <p>Acesso a produtos, educação e acolhimento faz parte do cuidado integral.</p>
            </article>
            <article>
              <span className="topic-number">02</span>
              <h2>Prevenção</h2>
              <p>Informação ajuda a reconhecer sinais e buscar atendimento no momento certo.</p>
            </article>
            <article>
              <span className="topic-number">03</span>
              <h2>Equidade</h2>
              <p>Políticas públicas reduzem barreiras e aproximam direitos de quem precisa.</p>
            </article>
          </section>
          <div className="source-panel">
            <div>
              <span className="card-index">Nossas fontes</span>
              <h2>
                Transparência antes
                <br />
                <em>de tudo.</em>
              </h2>
            </div>
            <p>
              Os dados são públicos e podem mudar conforme novas atualizações
              oficiais. Consulte a fonte original para conhecer a metodologia
              completa.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
