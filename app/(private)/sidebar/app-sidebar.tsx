"use client";

import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { useState } from "react";

type Avatar = { id: string; name: string; url: string };

type HairStyle = "long" | "bob" | "bun" | "curly" | "braids" | "short";

type Look = {
  id: string;
  name: string;
  bg: string;
  skin: string;
  hair: string;
  top: string;
  style: HairStyle;
};

const hairBack = (style: HairStyle, c: string) => {
  switch (style) {
    case "long":
      return `<path d="M23 50 Q22 16 50 16 Q78 16 77 50 L80 92 L20 92 Z" fill="${c}"/>`;
    case "bob":
      return `<path d="M24 48 Q24 16 50 16 Q76 16 76 48 L78 68 Q50 76 22 68 Z" fill="${c}"/>`;
    case "bun":
      return `<circle cx="50" cy="14" r="10" fill="${c}"/><path d="M26 48 Q26 18 50 18 Q74 18 74 48 Z" fill="${c}"/>`;
    case "curly":
      return [
        [27, 42, 13],
        [73, 42, 13],
        [34, 25, 14],
        [50, 19, 15],
        [66, 25, 14],
        [25, 60, 10],
        [75, 60, 10],
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`)
        .join("");
    case "braids":
      return `<path d="M26 48 Q26 18 50 18 Q74 18 74 48 Z" fill="${c}"/><rect x="22" y="46" width="10" height="38" rx="5" fill="${c}"/><rect x="68" y="46" width="10" height="38" rx="5" fill="${c}"/>`;
    case "short":
      return `<path d="M26 46 Q26 17 50 17 Q74 17 74 46 Z" fill="${c}"/>`;
  }
};

const hairFront = (style: HairStyle, c: string) => {
  const centerFringe = `<path d="M28 48 Q28 20 50 20 Q72 20 72 48 Q66 32 54 30 Q40 34 28 48 Z" fill="${c}"/>`;
  const sideFringe = `<path d="M28 46 Q30 20 52 20 Q72 22 72 46 Q60 38 44 30 Q36 38 28 46 Z" fill="${c}"/>`;
  switch (style) {
    case "long":
    case "bun":
      return centerFringe;
    case "curly":
      return [
        [38, 29, 8],
        [50, 26, 9],
        [62, 29, 8],
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`)
        .join("");
    default:
      return sideFringe;
  }
};

const makeAvatar = ({ id, name, bg, skin, hair, top, style }: Look): Avatar => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${bg}"/>
    ${hairBack(style, hair)}
    <rect x="44" y="60" width="12" height="16" rx="5" fill="${skin}"/>
    <path d="M44 66 Q50 72 56 66 L56 62 L44 62 Z" fill="#000" opacity=".08"/>
    <path d="M16 100 Q18 74 50 72 Q82 74 84 100 Z" fill="${top}"/>
    <path d="M41 73 Q50 85 59 73 Z" fill="${skin}"/>
    <ellipse cx="50" cy="48" rx="20" ry="23" fill="${skin}"/>
    ${hairFront(style, hair)}
    <path d="M37 44 Q42 41 47 44" stroke="#3a2a22" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M53 44 Q58 41 63 44" stroke="#3a2a22" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="51" r="2.6" fill="#2b2b2b"/>
    <circle cx="58" cy="51" r="2.6" fill="#2b2b2b"/>
    <circle cx="43" cy="50" r=".9" fill="#fff"/>
    <circle cx="59" cy="50" r=".9" fill="#fff"/>
    <circle cx="35" cy="57" r="4" fill="#f9a8b8" opacity=".45"/>
    <circle cx="65" cy="57" r="4" fill="#f9a8b8" opacity=".45"/>
    <path d="M44 59 Q50 64 56 59" stroke="#b4565a" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;

  return {
    id,
    name,
    url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
  };
};

const looks: Look[] = [
  { id: "a1", name: "Rosa", bg: "#fbcfe8", skin: "#f5d0b0", hair: "#5b3a29", top: "#ec4899", style: "long" },
  { id: "a2", name: "Lilás", bg: "#ddd6fe", skin: "#e8b98f", hair: "#1f1b24", top: "#7c3aed", style: "bun" },
  { id: "a3", name: "Azul", bg: "#bfdbfe", skin: "#c68e63", hair: "#2b1b12", top: "#2563eb", style: "curly" },
  { id: "a4", name: "Verde", bg: "#bbf7d0", skin: "#8d5a3b", hair: "#111111", top: "#16a34a", style: "braids" },
  { id: "a5", name: "Amarelo", bg: "#fef08a", skin: "#f1c9a5", hair: "#d9a441", top: "#f59e0b", style: "bob" },
  { id: "a6", name: "Laranja", bg: "#fed7aa", skin: "#5e3a26", hair: "#1a1210", top: "#ea580c", style: "short" },
];

export const femaleAvatars: Avatar[] = looks.map(makeAvatar);

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



  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(femaleAvatars[0]);

  const { user, logout } = useAuth();
  

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
            src={selectedAvatar.url}
            alt={`Avatar feminino ${selectedAvatar.name}`}
          />
        </button>

        <div className="sidebar-user-copy">
          <strong>Olá, {user?.name}</strong>
          <small>Seu espaço pessoal</small>
        </div>

        {isAvatarMenuOpen && (
          <div
            className="avatar-picker"
            role="dialog"
            aria-label="Escolha seu avatar"
          >
            <div className="avatar-picker-header">
              <strong>Escolha seu avatar</strong>

              <button
                type="button"
                aria-label="Fechar escolha de avatar"
                onClick={() => setIsAvatarMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="avatar-options">
              {femaleAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-option ${
                    selectedAvatar.id === avatar.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setIsAvatarMenuOpen(false);
                  }}
                >
                  <img src={avatar.url} alt={avatar.name} />
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