"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";
import { HealthCharts } from "./health-charts";

export default function GraficosPage() {
    const { logout } = useAuth()

  return (
    <main className="tracking-page">
      <AppSidebar active="/graficos" />
      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Gráficos</span>
          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>
        <section className="content-page section-wrap">
          <p className="tracking-context">Acompanhe-se</p>
          <h1>
            Seus padrões,
            <br />
            <em>em perspectiva.</em>
          </h1>
          <p className="tracking-lead">
            Visualizações simples para ajudar você a perceber recorrências nas
            suas anotações. Elas não substituem uma avaliação profissional.
          </p>
          <HealthCharts />

        </section>
      </div>
    </main>
  );
}
