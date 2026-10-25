"use client";

import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { useState } from "react";

const avatarOptions = [
  { id: "amarelo", label: "Pele amarela", skin: "f2d3b1", hair: "2c1b18" },
  { id: "claro", label: "Pele clara", skin: "ffdbac", hair: "724133" },
  { id: "medio", label: "Pele média", skin: "d08b5b", hair: "2c1b18" },
  { id: "oliva", label: "Pele oliva", skin: "ae5d29", hair: "1c1c1c" },
  { id: "escuro", label: "Pele escura", skin: "614335", hair: "090806" },
  { id: "profundo", label: "Pele retinta", skin: "4a312c", hair: "17120f" },
] as const;

const avatarUrl = (seed: string, skin: string) =>
  `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=f1f5ee&skinColor=${skin}`;

const items = [
  ["/ciclo", "◷", "Meu ciclo"],
  ["/acompanhe-se", "＋", "Registro diário"],
  ["/avaliacao", "✦", "Avaliação de saúde"],
  ["/historico", "≡", "Histórico"],
  ["/graficos", "◒", "Gráficos"],
  ["/dados", "◌", "Dados públicos"],
  ["/assistente", "?", "Assistente"],
] as const;

export function AppSidebar({ active }: { active: string }) {
  const { user, logout } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  return (
    <aside className="tracking-sidebar">
      <Link className="brand sidebar-brand" href="/">
        <img src="/saudedela_fundo_claro.png" alt="SaúdeDela" />
       
      </Link>
      <div className="sidebar-user">
        <button
          className="avatar-trigger"
          type="button"
          aria-label="Escolher avatar do perfil"
          aria-expanded={isAvatarMenuOpen}
          onClick={() => setIsAvatarMenuOpen((open) => !open)}
        >
          <img
            className="avatar avatar-image"
            src={avatarUrl(selectedAvatar.id, selectedAvatar.skin)}
            alt={`Avatar selecionado: ${selectedAvatar.label}`}
          />
        </button>
        <div className="sidebar-user-copy">
          <strong>Olá, {user?.name}</strong>
          <small>Seu espaço pessoal</small>
        </div>
        {isAvatarMenuOpen && (
          <div className="avatar-picker" role="dialog" aria-label="Escolha seu avatar">
            <div className="avatar-picker-header">
              <strong>Escolha seu avatar</strong>
              <button type="button" aria-label="Fechar escolha de avatar" onClick={() => setIsAvatarMenuOpen(false)}>×</button>
            </div>
            <div className="avatar-options">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`avatar-option ${selectedAvatar.id === option.id ? "selected" : ""}`}
                  aria-label={option.label}
                  aria-pressed={selectedAvatar.id === option.id}
                  onClick={() => {
                    setSelectedAvatar(option);
                    setIsAvatarMenuOpen(false);
                  }}
                >
                  <img src={avatarUrl(option.id, option.skin)} alt="" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
        <button className="sidebar-link sidebar-logout" type="button" onClick={logout}>
          <i aria-hidden="true">↪</i>
          Sair
        </button>
      </nav>
    </aside>
  );
}
