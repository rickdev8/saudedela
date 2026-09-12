import Link from 'next/link'

const symptoms = ['Cólicas', 'Cansaço', 'Inchaço']
const history = [
  { date: '18 JUN 2024', flow: 'Moderado', mood: 'Normal', symptoms: 'Cólicas, cansaço' },
  { date: '17 JUN 2024', flow: 'Leve', mood: 'Ansiosa', symptoms: 'Inchaço' },
  { date: '16 JUN 2024', flow: 'Sem fluxo', mood: 'Feliz', symptoms: 'Nenhum sintoma' },
]

function PulseMark() {
  return <span className="pulse-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" /><path d="M7 17h5l2.1-6 3.4 11 2.2-5H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
}

export default function AcompanheSePage() {
  return (
    <main className="tracking-page">
      <aside className="tracking-sidebar">
        <Link className="brand sidebar-brand" href="/"><PulseMark /><span>Saúde<span>Dela</span></span></Link>
        <div className="sidebar-user"><span className="avatar">M</span><div><strong>Olá, Marina</strong><small>Seu espaço pessoal</small></div></div>
        <nav className="sidebar-nav" aria-label="Navegação principal">
          <span className="sidebar-label">Acompanhe-se</span>
          <a className="sidebar-link active" href="#registro"><i>＋</i>Registro diário</a>
          <a className="sidebar-link" href="/historico"><i>≡</i>Histórico</a>
          <a className="sidebar-link" href="/graficos"><i>◒</i>Gráficos</a>
          <span className="sidebar-label">SaúdeDela</span>
          <Link className="sidebar-link" href="/dados"><i>◌</i>Dados públicos</Link>
          <Link className="sidebar-link" href="/assistente"><i>?</i>Assistente</Link>
        </nav>
        <div className="sidebar-bottom"><Link href="/">Voltar para início</Link><Link href="/entrar">Sair da conta</Link></div>
      </aside>
      <div className="tracking-main">
      <header className="tracking-header">
        <span className="mobile-page-title">Meu acompanhamento</span>
        <Link className="login-link" href="/entrar">Sair</Link>
      </header>

      <section className="tracking-hero section-wrap">
        <div><p className="tracking-context">Seu espaço pessoal</p><h1>Conhecer seus padrões<br /><em>é cuidar de você.</em></h1><p className="tracking-lead">Registre como você está se sentindo. Com o tempo, pequenas anotações podem ajudar a levar mais clareza para a sua próxima conversa de saúde.</p></div>
        <div className="period-summary"><span>Período acompanhado</span><strong>12 — 18 JUN</strong><small>7 dias registrados neste ciclo</small></div>
      </section>

      <section className="tracking-content section-wrap">
        <div className="entry-card"><div className="card-heading"><div><span className="card-index">01</span><h2>Como você está hoje?</h2></div><span className="date-label">Hoje, 18 jun</span></div><div className="field-group"><label>Fluxo menstrual</label><div className="choice-row">{['Sem fluxo', 'Leve', 'Moderado', 'Intenso'].map((item, index) => <button className={index === 2 ? 'choice selected' : 'choice'} key={item}>{item}</button>)}</div></div><div className="field-group"><label>Como está seu humor?</label><div className="mood-row">{['Feliz', 'Normal', 'Ansiosa', 'Triste', 'Irritada', 'Cansada'].map((item, index) => <button className={index === 1 ? 'mood selected' : 'mood'} key={item}><i className={`mood-dot mood-${index}`} />{item}</button>)}</div></div><div className="field-group"><label>O que você sentiu?</label><div className="symptom-row choices">{symptoms.map(item => <button className="symptom selected" key={item}>{item}<span>×</span></button>)}<button className="symptom">+ Outro sintoma</button></div></div><button className="button-primary save-button">Salvar registro</button></div>

        <aside className="insight-card"><div className="insight-top"><span>Observação do período</span><span className="soft-dot" /></div><h2>Você registrou<br /><em>cansaço</em> em 3 dias.</h2><p>Isso é apenas uma observação baseada nas suas anotações — não representa um diagnóstico. Acompanhar por mais tempo pode ajudar a entender se esse padrão continua.</p><a href="#fontes">Entenda a recomendação</a></aside>
      </section>

      <section className="history-section section-wrap"><div className="history-heading"><div><span className="card-index">02</span><h2>Seu histórico</h2></div><div className="history-actions"><button className="period-button">Junho 2024 <span>⌄</span></button><button className="download-button">Baixar relatório em PDF</button></div></div><div className="history-table"><div className="table-row table-head"><span>Data</span><span>Fluxo</span><span>Humor</span><span>Sintomas</span><span /></div>{history.map(row => <div className="table-row" key={row.date}><strong>{row.date}</strong><span>{row.flow}</span><span>{row.mood}</span><span>{row.symptoms}</span><button aria-label={`Mais opções para ${row.date}`}>···</button></div>)}</div><p className="medical-note">Se os sintomas forem intensos, persistentes ou preocupantes, procure orientação de um profissional de saúde.</p></section>

      <footer className="tracking-footer section-wrap"><span>Seus registros são privados e pertencem a você.</span><span>SaúdeDela · 2024</span></footer>
      </div>
    </main>
  )
}
