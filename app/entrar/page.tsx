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

export default function EntrarPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-form-column">
          <Brand />
          <div className="auth-heading">
            <p className="auth-context">Sua saúde, com mais clareza</p>
            <h1>Continue de onde<br /><em>você parou.</em></h1>
            <p>Entre para acompanhar suas informações e conversar com o assistente SaúdeDela.</p>
          </div>
          <form className="auth-form">
            <label htmlFor="email">E-mail<input id="email" name="email" type="email" placeholder="voce@email.com" /></label>
            <label htmlFor="password">Senha<div className="password-field"><input id="password" name="password" type="password" placeholder="Digite sua senha" /><button type="button" aria-label="Mostrar senha">Mostrar</button></div></label>
            <div className="auth-row"><span /><Link href="#recuperar">Esqueci minha senha</Link></div>
            <button className="button-primary auth-submit" type="submit">Entrar</button>
          </form>
          <p className="auth-switch">Não tem conta? <Link href="/criar-conta">Criar conta</Link></p>
        </div>
        <aside className="auth-panel" aria-label="Mensagem de confiança">
          <div className="auth-panel-mark"><PulseMark /></div>
          <p>Informação para você</p>
          <h2>Seu cuidado começa quando você consegue <em>entender.</em></h2>
          <div className="auth-panel-note"><span>SaúdeDela</span><strong>Baseada em evidências<br />Feita para mulheres</strong></div>
        </aside>
      </div>
    </main>
  )
}
