import Link from 'next/link'

function PulseMark() {
  return (
    <span className="pulse-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" /><path d="M7 17h5l2.1-6 3.4 11 2.2-5H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  )
}

function Brand() {
  return <Link className="brand auth-brand" href="/"><PulseMark /><span>Saúde<span>Dela</span></span></Link>
}

export default function CriarContaPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-form-column">
          <Brand />
          <div className="auth-heading">
            <p className="auth-context">Um espaço só seu</p>
            <h1>Comece a cuidar<br /><em>de você.</em></h1>
            <p>Crie sua conta para registrar sinais, acompanhar padrões e encontrar informação confiável.</p>
          </div>
          <form className="auth-form">
            <label htmlFor="name">Nome<input id="name" name="name" type="text" placeholder="Como você gostaria de ser chamada?" /></label>
            <label htmlFor="email">E-mail<input id="email" name="email" type="email" placeholder="voce@email.com" /></label>
            <label htmlFor="password">Senha<input id="password" name="password" type="password" placeholder="Crie uma senha" /></label>
            <label htmlFor="confirm-password">Confirme sua senha<input id="confirm-password" name="confirm-password" type="password" placeholder="Repita sua senha" /></label>
            <p className="privacy-note"><span aria-hidden="true">+</span> Seus dados de saúde ficam protegidos e pertencem somente a você.</p>
            <button className="button-primary auth-submit" type="submit">Criar conta</button>
          </form>
          <p className="auth-switch">Já tem conta? <Link href="/entrar">Entrar</Link></p>
        </div>
        <aside className="auth-panel" aria-label="Mensagem de confiança">
          <div className="auth-panel-mark"><PulseMark /></div>
          <p>Um acompanhamento mais atento</p>
          <h2>Pequenos registros podem revelar <em>grandes padrões.</em></h2>
          <div className="auth-panel-note"><span>SaúdeDela</span><strong>Privacidade em primeiro lugar<br />Cuidado no seu ritmo</strong></div>
        </aside>
      </div>
    </main>
  )
}
