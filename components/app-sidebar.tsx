import Link from "next/link"

const items = [
  ["/ciclo", "◷", "Meu ciclo"],
  ["/acompanhe-se", "＋", "Registro diário"],
  ["/historico", "≡", "Histórico"],
  ["/graficos", "◒", "Gráficos"],
  ["/dados", "◌", "Dados públicos"],
  ["/assistente", "?", "Assistente"],
] as const

export function AppSidebar({ active }: { active: string }) {
  return <aside className="tracking-sidebar">
    <Link className="brand sidebar-brand" href="/"><span className="pulse-mark">◌</span><span>Saúde<span>Dela</span></span></Link>
    <div className="sidebar-user"><span className="avatar">M</span><div><strong>Olá, Marina</strong><small>Seu espaço pessoal</small></div></div>
    <nav className="sidebar-nav" aria-label="Navegação principal">
      <span className="sidebar-label">Acompanhe-se</span>
      {items.slice(0, 4).map(([href, icon, label]) => <Link key={href} className={`sidebar-link ${active === href ? "active" : ""}`} href={href}><i>{icon}</i>{label}</Link>)}
      <span className="sidebar-label">SaúdeDela</span>
      {items.slice(4).map(([href, icon, label]) => <Link key={href} className={`sidebar-link ${active === href ? "active" : ""}`} href={href}><i>{icon}</i>{label}</Link>)}
    </nav>
    <div className="sidebar-bottom"><Link href="/">Voltar para início</Link><Link href="/entrar">Sair da conta</Link></div>
  </aside>
}
