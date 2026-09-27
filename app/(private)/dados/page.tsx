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
        <header className="tracking-header">
          <span className="mobile-page-title">Dados públicos</span>
          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>
        <section className="content-page section-wrap">
          <div className="data-intro">
            <div>
              <p className="tracking-context">Dados públicos</p>
              <h1>
                Informação para
                <br />
                <em>cuidar melhor.</em>
              </h1>
              <p className="tracking-lead">
                Uma leitura clara de temas que atravessam a saúde feminina no Brasil — com contexto, fontes e caminhos para saber mais.
              </p>
            </div>
            <div className="data-intro-note">
              <span>01</span>
              <p>Dados públicos precisam ser compreensíveis para também serem úteis.</p>
            </div>
          </div>
          <section className="dignidade-banner" aria-labelledby="dignidade-title">
            <div className="dignidade-content">
              <p className="card-index">Programa Dignidade Menstrual</p>
              <h2 id="dignidade-title">Absorvente gratuito é acesso à saúde.</h2>
              <p>
                O programa do Governo Federal oferece absorventes gratuitos para pessoas que menstruam em situação de vulnerabilidade. A retirada acontece em farmácias credenciadas, com autorização emitida pelo Meu SUS Digital.
              </p>
              <a className="dignidade-link" href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dignidade-menstrual" target="_blank" rel="noreferrer">
                Conheça o programa no portal do Governo Federal
              </a>
            </div>
            <div className="dignidade-side" aria-hidden="true">
              <span>Direito</span>
              <strong>cuidado</strong>
              <span>e dignidade</span>
            </div>
          </section>
          <section className="data-section-block" aria-labelledby="panorama-title">
            <div className="section-heading-line">
              <div>
                <p className="card-index">Panorama</p>
                <h2 id="panorama-title">O que os dados ajudam a enxergar.</h2>
              </div>
              <p>Indicadores selecionados para abrir conversas sobre acesso, prevenção e cuidado.</p>
            </div>
            <div className="public-stat-grid">
              <article>
                <span>Consultas</span>
                <strong>42,8%</strong>
                <p>das consultas na atenção básica em 2024 foram de mulheres.</p>
                <small>Fonte: SISAB, 2024</small>
              </article>
              <article>
                <span>Atendimentos</span>
                <strong>8,4 mi</strong>
                <p>registros relacionados à saúde da mulher no período.</p>
                <small>Fonte: DATASUS, 2023</small>
              </article>
              <article>
                <span>Prevenção</span>
                <strong>+18%</strong>
                <p>de crescimento em acompanhamentos preventivos.</p>
                <small>Fonte: Ministério da Saúde</small>
              </article>
            </div>
          </section>
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
