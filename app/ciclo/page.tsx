"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function PulseMark() { return <span className="pulse-mark" aria-hidden="true"><i /><i /><i /></span> }

export default function CicloPage() {
  const [month, setMonth] = useState(8)
  const [selected, setSelected] = useState<number[]>([3, 4, 5, 6, 7])
  const [saved, setSaved] = useState(false)
  const [duration, setDuration] = useState("5 dias")
  const [regularity, setRegularity] = useState("Regular")
  const year = 2024
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const days = useMemo(() => Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1), [firstDay, daysInMonth])
  const toggleDay = (day: number) => { setSaved(false); setSelected(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day].sort((a, b) => a - b)) }
  const moveMonth = (direction: number) => setMonth(current => Math.min(11, Math.max(0, current + direction)))

  return <main className="tracking-page cycle-page">
    <aside className="tracking-sidebar">
      <Link className="brand sidebar-brand" href="/"><PulseMark /><span>Saúde<span>Dela</span></span></Link>
      <div className="sidebar-user"><span className="avatar">M</span><div><strong>Olá, Marina</strong><small>Seu espaço pessoal</small></div></div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        <span className="sidebar-label">Acompanhe-se</span>
        <Link className="sidebar-link active" href="/ciclo"><i>◷</i>Meu ciclo</Link>
        <Link className="sidebar-link" href="/acompanhe-se"><i>＋</i>Registro diário</Link>
        <Link className="sidebar-link" href="/historico"><i>≡</i>Histórico</Link>
        <Link className="sidebar-link" href="/graficos"><i>◒</i>Gráficos</Link>
        <span className="sidebar-label">SaúdeDela</span><Link className="sidebar-link" href="/dados"><i>◌</i>Dados públicos</Link><Link className="sidebar-link" href="/assistente"><i>?</i>Assistente</Link>
      </nav><div className="sidebar-bottom"><Link href="/">Voltar para início</Link><Link href="/entrar">Sair da conta</Link></div>
    </aside>
    <div className="tracking-main"><header className="tracking-header"><span className="mobile-page-title">Meu ciclo</span><Link className="login-link" href="/entrar">Sair</Link></header>
      <section className="content-page section-wrap cycle-content">
        <div className="cycle-hero"><div><p className="tracking-context">Seu calendário pessoal</p><h1>Conhecer o seu<br /><em>ritmo.</em></h1><p className="tracking-lead">Marque os dias em que você geralmente menstrua. Assim, você começa a visualizar seu padrão de um jeito simples e sem julgamentos.</p></div><div className="cycle-status"><span>Seu padrão registrado</span><strong>{selected.length} dias</strong><small>por ciclo, em média</small></div></div>
        <div className="cycle-layout"><section className="calendar-card" aria-label="Calendário menstrual"><div className="calendar-heading"><div><span className="card-index">01 / SELECIONE OS DIAS</span><h2>Quando costuma<br /><em>começar?</em></h2></div><div className="month-controls"><button onClick={() => moveMonth(-1)} aria-label="Mês anterior">←</button><strong>{monthNames[month]} {year}</strong><button onClick={() => moveMonth(1)} aria-label="Próximo mês">→</button></div></div><div className="calendar-grid weekdays">{weekDays.map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map((day, index) => day ? <button key={index} className={selected.includes(day) ? "day selected" : "day"} onClick={() => toggleDay(day)} aria-pressed={selected.includes(day)}>{day}</button> : <span key={index} />)}</div><div className="calendar-legend"><span><i className="legend-period" /> Dias de menstruação</span><span><i /> Clique para selecionar</span></div></section>
          <aside className="cycle-side"><section className="cycle-form-card"><span className="card-index">02 / SOBRE O SEU CICLO</span><h2>Algumas informações<br /><em>para contextualizar.</em></h2><label>Duração média da menstruação<select value={duration} onChange={event => setDuration(event.target.value)}><option>3 dias</option><option>4 dias</option><option>5 dias</option><option>6 dias</option><option>7 dias</option></select></label><label>Como costuma ser o seu ciclo?<select value={regularity} onChange={event => setRegularity(event.target.value)}><option>Regular</option><option>Um pouco irregular</option><option>Irregular</option><option>Não sei dizer</option></select></label><button className="button-primary save-cycle" onClick={() => setSaved(true)}>{saved ? "Ciclo atualizado" : "Salvar meu padrão"}</button></section><section className="cycle-note"><span>i</span><p>Seu ciclo não precisa ser igual todos os meses. Registrar é uma forma de observar, não de criar uma regra.</p></section></aside></div>
        <section className="cycle-summary"><div><span>Próximo passo</span><h2>Continue registrando<br /><em>como você se sente.</em></h2></div><Link className="button-outline" href="/acompanhe-se">Ir para registro diário</Link></section>
      </section>
    </div>
  </main>
}
