"use client";

import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";

const rows = [
  ["18 JUN 2024", "Moderado", "Normal", "Cólicas, cansaço"],
  ["17 JUN 2024", "Leve", "Ansiosa", "Inchaço"],
  ["16 JUN 2024", "Sem fluxo", "Feliz", "Nenhum sintoma"],
  ["15 JUN 2024", "Sem fluxo", "Normal", "Cansaço"],
  ["14 JUN 2024", "Sem fluxo", "Cansada", "Cólicas"],
];

export default function HistoricoPage() {
  const { logout } = useAuth()

  return (
    <main className="tracking-page">
      <AppSidebar active="/historico" />
      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Histórico</span>
          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>
        <section className="content-page section-wrap">
          <p className="tracking-context">Acompanhe-se</p>
          <h1>
            O que você
            <br />
            <em>tem percebido.</em>
          </h1>
          <p className="tracking-lead">
            Um registro simples das suas observações ao longo do tempo. Use esse
            espaço para reconhecer ritmos e preparar conversas mais claras.
          </p>
          <div className="history-toolbar">
            <button className="period-button">
              Junho 2024 <span>⌄</span>
            </button>
            <button className="download-button">Baixar relatório em PDF</button>
          </div>
          <div className="history-table full-table">
            <div className="table-row table-head">
              <span>Data</span>
              <span>Fluxo</span>
              <span>Humor</span>
              <span>Sintomas</span>
              <span />
            </div>
            {rows.map((row) => (
              <div className="table-row" key={row[0]}>
                <strong>{row[0]}</strong>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
                <button aria-label={`Mais opções para ${row[0]}`}>···</button>
              </div>
            ))}
          </div>
          <p className="medical-note">
            Se os sintomas forem intensos, persistentes ou preocupantes, procure
            orientação de um profissional de saúde.
          </p>
        </section>
      </div>
    </main>
  );
}
