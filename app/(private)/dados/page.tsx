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
          <section className="public-services" aria-labelledby="services-title">
            <div className="section-heading-line services-heading">
              <div>
                <h2 id="services-title">Programas e serviços que podem ajudar.</h2>
              </div>
              <p>Links oficiais para acessar direitos, orientação, proteção e atendimento em saúde.</p>
            </div>
            <div className="public-services-grid">
              <article className="public-service-card featured">
                <span className="service-kicker">Saúde menstrual</span>
                <h3>Programa Dignidade Menstrual</h3>
                <p>Absorventes gratuitos para pessoas em situação de vulnerabilidade, com retirada em farmácias credenciadas.</p>
                <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dignidade-menstrual" target="_blank" rel="noreferrer">Acessar programa <span aria-hidden="true">↗</span></a>
              </article>
              <article className="public-service-card">
                <span className="service-kicker">Atenção integral</span>
                <h3>Política Nacional de Atenção Integral à Saúde da Mulher</h3>
                <p>Diretrizes e ações do SUS para promover cuidado integral, prevenção e equidade.</p>
                <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher" target="_blank" rel="noreferrer">Conhecer no Ministério da Saúde <span aria-hidden="true">↗</span></a>
              </article>
              <article className="public-service-card">
                <span className="service-kicker">Acesso a medicamentos</span>
                <h3>Farmácia Popular</h3>
                <p>Medicamentos e itens de saúde gratuitos ou subsidiados em farmácias credenciadas.</p>
                <a href="https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular" target="_blank" rel="noreferrer">Encontrar atendimento <span aria-hidden="true">↗</span></a>
              </article>
              <article className="public-service-card safety-card">
                <span className="service-kicker">Proteção e segurança</span>
                <h3>Ligue 180 — Central de Atendimento à Mulher</h3>
                <p>Orientação, acolhimento e encaminhamento para serviços da rede de atendimento à violência contra a mulher.</p>
                <a href="https://www.gov.br/mulheres/pt-br/ligue180" target="_blank" rel="noreferrer">Saiba como buscar ajuda <span aria-hidden="true">↗</span></a>
              </article>
              <article className="public-service-card safety-card">
                <span className="service-kicker">Emergência</span>
                <h3>190 — Polícia Militar</h3>
                <p>Em uma situação de risco imediato, ligue para o serviço de emergência da sua região.</p>
                <a href="https://www.gov.br/pt-br/servicos/solicitar-atendimento-de-emergencia" target="_blank" rel="noreferrer">Orientações oficiais <span aria-hidden="true">↗</span></a>
              </article>
              <article className="public-service-card safety-card">
                <span className="service-kicker">Rede de proteção</span>
                <h3>Casa da Mulher Brasileira</h3>
                <p>Atendimento integrado e gratuito para mulheres em situação de violência.</p>
                <a href="https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira" target="_blank" rel="noreferrer">Conhecer a rede <span aria-hidden="true">↗</span></a>
              </article>
            </div>
            <p className="services-note">Em perigo imediato, procure um local seguro e acione o serviço de emergência da sua região. Os canais oficiais podem orientar o próximo passo.</p>
          </section>

          <section className="data-section-block" aria-labelledby="panorama-title">
            <div className="section-heading-line">
              <div>
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
