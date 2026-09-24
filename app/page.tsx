import Link from "next/link";

const bars = [58, 72, 64, 86, 77, 94, 82];
const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL"];

function PulseMark() {
  return (
    <span className={"pulseMark"} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 17h5l2.1-6 3.4 11 2.2-5H25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface AssistantHomeSectionProps {
  pulseMarkIcon?: React.ReactNode;
}

function MiniLineChart() {
  return (
    <svg
      className="mini-line"
      viewBox="0 0 480 180"
      role="img"
      aria-label="Tendência de consultas preventivas entre janeiro e julho"
    >
      <path
        d="M8 145H472M8 102H472M8 59H472M8 16H472"
        stroke="currentColor"
        strokeOpacity=".16"
        strokeWidth="1"
      />
      <path
        d="M8 128C45 119 56 125 83 108S125 87 151 99s36 3 59-20 39-25 63-6 36 32 63 17 45-45 67-38 40 29 69 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="472"
        cy="59"
        r="5"
        fill="var(--coral)"
        stroke="var(--mineral)"
        strokeWidth="3"
      />
    </svg>
  );
}

function Header() {
  return (
    <header className={"siteHeader"}>
      <a className="brand" href="/inicio" aria-label="SaúdeDela, início">
        <PulseMark />
        <span>
          Saúde<span>Dela</span>
        </span>
      </a>
      <nav aria-label="Navegação principal">
        <a href="/dados">Dados</a>
        <a href="/assistente">Assistente</a>
        <a href="/acompanhe-se">Acompanhe-se</a>
      </nav>
      <a className={"loginLink"} href="/entrar">
        Entrar
      </a>
    </header>
  );
}

function EvidenceCard() {
  return (
    <div className={"evidenceCard"}>
      <div className="evidence-top">
        <span className="live-dot">
          <i /> atualizado hoje
        </span>
      </div>
      <div className="evidence-question">
        A prevenção está
        <br />
        <em>chegando</em> a mais mulheres?
      </div>
      <div className="evidence-chart">
        <MiniLineChart />
        <div className="chart-labels">
          <span>JAN</span>
          <span>JUL</span>
        </div>
      </div>
      <div className="evidence-foot">
        <span>
          Consultas preventivas
          <br />
          <strong>+18,4%</strong> no período
        </span>
        <span className="source-tag">DATASUS / SISAB</span>
      </div>
    </div>
  );
}

export default function Page({ pulseMarkIcon }: AssistantHomeSectionProps) {
  return (
    <main id="inicio">
      <Header />
      <section className="hero section-wrap">
        <div className="hero-copy">
          <h1>
            O que os dados dizem sobre <em>a sua saúde?</em>
          </h1>
          <p className="hero-description">
            Informação confiável para você entender seu corpo, conversar melhor
            com profissionais e tomar decisões com mais clareza.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/dados">
              Explorar os dados
            </a>
            <a className={"textLink"} href="#assistente">
              Conheça o assistente
            </a>
          </div>
          <div className="trust-row">
            <span>Feito para mulheres</span>
            <span className="trust-line" />
            <span>Baseado em evidências</span>
          </div>
        </div>
        <EvidenceCard />
      </section>

      <section className="data-section section-wrap" id="dados">
        <div className="section-heading">
          <div>
            <h2>
              Quando a informação
              <br />
              <em>fica visível.</em>
            </h2>
          </div>
          <p className="section-intro">
            Transformamos bases públicas de saúde em respostas que fazem sentido
            para a sua vida — e não só para uma planilha.
          </p>
        </div>
        <div className="data-board">
          <div className="stat-column">
            <div className="stat">
              <span>01</span>
              <strong>
                42,8<span>%</span>
              </strong>
              <p>
                das mulheres realizaram
                <br />o exame preventivo em 2024
              </p>
            </div>
            <div className="stat">
              <span>02</span>
              <strong>
                +18,4<span>%</span>
              </strong>
              <p>
                na busca por atendimento
                <br />
                de saúde mental
              </p>
            </div>
            <div className="stat">
              <span>03</span>
              <strong>
                7<span> em 10</span>
              </strong>
              <p>
                querem entender mais
                <br />
                sobre o próprio ciclo
              </p>
            </div>
          </div>
          <div className="bar-chart">
            <div className="chart-title">
              <span>Procura por cuidado preventivo</span>
              <span className="chart-legend">
                <i /> mulheres atendidas
              </span>
            </div>
            <div className="bars">
              {bars.map((height, index) => (
                <div className="bar-wrap" key={months[index]}>
                  <div className="bar" style={{ height: `${height}%` }}>
                    <b>{index === 6 ? "+18" : ""}</b>
                  </div>
                  <span>{months[index]}</span>
                </div>
              ))}
            </div>
            <p className="chart-caption">
              Crescimento percentual de consultas na atenção básica
              <br />
              <strong>Fonte: SISAB, 2024</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="assistant-section section-wrap" id="assistente">
        <div className="assistant-copy">
          <span className="kicker light">
            <span /> Inteligência com evidência
          </span>

          <h2>
            Uma dúvida sua.
            <br />
            <em>Fontes de verdade.</em>
          </h2>

          <p>
            O assistente SaúdeDela responde perguntas sobre corpo, ciclo e saúde
            emocional — sempre mostrando de onde veio cada informação oficial.
          </p>

          <Link className="light-link" href="/assistente">
            Fazer uma pergunta <span>→</span>
          </Link>
        </div>

        <div className="chat-window">
          <div className="chat-header">
            <span>
              <i /> assistente SaúdeDela
            </span>
            <span>baseado em fontes públicas</span>
          </div>

          <div className="chat-messages">
            <div className="user-message">
              O que pode afetar a duração do meu ciclo?
            </div>

            <div className="bot-message">
              <span className="bot-avatar">
                {pulseMarkIcon ?? <span className={"pulseMark"}>◌</span>}
              </span>

              <div>
                <p>
                  O ciclo pode variar por vários motivos — estresse, mudanças no
                  sono, alimentação e alterações hormonais estão entre os mais
                  comuns. Variações ocasionais são normais, mas vale conversar
                  com um profissional se forem persistentes.
                </p>

                <small>Fontes consultadas</small>
                <div className="source-chips">
                  <span>WHO</span>
                  <span>FEBRASGO</span>
                  <span>PUBMED</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/assistente"
            className="chat-input"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <span>Digite uma pergunta...</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="track-section section-wrap" id="acompanhe">
        <div className="track-intro">
          <h2>
            Acompanhar-se também
            <br />
            <em>é se conhecer.</em>
          </h2>
          <p>
            Registre sintomas, humor e hábitos ao longo do tempo. Pequenos
            sinais podem revelar padrões importantes para você — e para a sua
            próxima consulta.
          </p>
          <a className="button-primary" href="#comecar">
            Começar meu acompanhamento
          </a>
        </div>
        <div className="calendar-card">
          <div className="calendar-top">
            <span>Meu ciclo</span>
            <strong>
              Junho 2024 <span>⌄</span>
            </strong>
          </div>
          <div className="weekdays">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
              <span key={`${day}-${i}`}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 35 }, (_, i) => (
              <span
                key={i}
                className={`${i === 17 ? "today" : ""} ${[5, 6, 12, 13, 19, 20, 26, 27].includes(i) ? "period" : ""}`}
              >
                {i < 3 ? "" : i - 2}
              </span>
            ))}
          </div>
          <div className="symptom-row">
            <span>
              <i className="yellow-dot" /> sintomas registrados
            </span>
            <strong>4 anotações</strong>
          </div>
        </div>
      </section>

      <footer className="site-footer section-wrap">
        <div className="footer-brand">
          <a className="brand" href="#inicio">
            <PulseMark />
            <span>
              Saúde<span>Dela</span>
            </span>
          </a>
          <p>Mais clareza para cuidar de você.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Explorar</span>
            <a href="/dados">Dados públicos</a>
            <a href="#assistente">Assistente</a>
            <a href="/acompanhe-se">Acompanhe-se</a>
          </div>
          <div>
            <span>Transparência</span>
            <a href="#fontes">Nossas fontes</a>
            <a href="#metodo">Como funciona</a>
            <a href="#privacidade">Privacidade</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SaúdeDela</span>
          <span>Informação não substitui orientação médica.</span>
        </div>
      </footer>
    </main>
  );
}
