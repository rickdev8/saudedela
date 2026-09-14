"use client";

import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { use, useEffect } from "react";

const items = [
  ["/ciclo", "◷", "Meu ciclo"],
  ["/acompanhe-se", "＋", "Registro diário"],
  ["/historico", "≡", "Histórico"],
  ["/graficos", "◒", "Gráficos"],
  ["/dados", "◌", "Dados públicos"],
  ["/assistente", "?", "Assistente"],
] as const;

export function AppSidebar({ active }: { active: string }) {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <aside className="tracking-sidebar">
      <Link className="brand sidebar-brand" href="/">
        <span className="pulse-mark">◌</span>
        <span>
          Saúde<span>Dela</span>
        </span>
      </Link>
      <div className="sidebar-user">
        <span className="avatar">{user?.name.charAt(0).toUpperCase()}</span>
        <div>
          <strong>Olá, {user?.name}</strong>
          <small>Seu espaço pessoal</small>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        <span className="sidebar-label">Acompanhe-se</span>
        {items.slice(0, 4).map(([href, icon, label]) => (
          <Link
            key={href}
            className={`sidebar-link ${active === href ? "active" : ""}`}
            href={href}
          >
            <i>{icon}</i>
            {label}
          </Link>
        ))}
        <span className="sidebar-label">SaúdeDela</span>
        {items.slice(4).map(([href, icon, label]) => (
          <Link
            key={href}
            className={`sidebar-link ${active === href ? "active" : ""}`}
            href={href}
          >
            <i>{icon}</i>
            {label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <Link href="/">Voltar para início</Link>
        <button onClick={logout} className="login-link">
            Sair
          </button>
      </div>
    </aside>
  );
}
