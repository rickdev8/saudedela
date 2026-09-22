"use client";

import "./history.module.css";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";
import { Loader } from "@/components/ui/loaders/loader-main";

type HeadlinePart = { text: string; emphasis: boolean };

type Insight = {
  status: "insufficient_data" | "normal" | "attention";
  headlineParts: HeadlinePart[];
  description: string;
};

type SymptomEntry = {
  id: string;
  date: string;
  flow: string | null;
  mood: string | null;
  painIntensity: string | null;
  energy: string | null;
  sleep: string | null;
  notes: string | null;
  symptoms: string[];
};

type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

const flowLabels: Record<string, string> = {
  none: "Sem fluxo",
  light: "Leve",
  medium: "Moderado",
  heavy: "Intenso",
};

const painLabels: Record<string, string> = {
  none: "Nenhuma",
  light: "Leve",
  moderate: "Moderada",
  strong: "Forte",
  very_strong: "Muito forte",
};

const energyLabels: Record<string, string> = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
};

const sleepLabels: Record<string, string> = {
  bad: "Ruim",
  regular: "Regular",
  good: "Bom",
};

function formatDate(isoDate: string) {
  return new Date(isoDate)
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(".", "");
}

const INSIGHT_CACHE_KEY = "saudedela:insight";

export default function HistoricoPage() {
  const { logout } = useAuth();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadReport() {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/report");
      if (!response.ok) return;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio-saudedela.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(`/api/acompanhe-se?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setPagination(data.pagination ?? null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const cached = sessionStorage.getItem(INSIGHT_CACHE_KEY);
    if (cached) {
      setInsight(JSON.parse(cached));
      return;
    }
    fetch("/api/insight")
      .then((res) => res.json())
      .then((data) => {
        setInsight(data);
        sessionStorage.setItem(INSIGHT_CACHE_KEY, JSON.stringify(data));
      })
      .catch(() => setInsight(null));
  }, []);

  function toggleExpanded(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

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
          <div className="history-heading-row">
            <div className="history-heading-copy">
              <h1>
                O que você
                <br />
                <em>tem percebido.</em>
              </h1>
              <p className="tracking-lead">
                Um registro simples das suas observações ao longo do tempo. Use
                esse espaço para reconhecer ritmos e preparar conversas mais
                claras.
              </p>
            </div>
            <aside className="insight-card history-insight">
              <div className="insight-top">
                <span>Observação do período</span>
                <span
                  className={`soft-dot ${insight?.status === "attention" ? "attention" : ""}`}
                />
              </div>

              <h2>
                {insight?.headlineParts?.map((part, index) =>
                  part.emphasis ? (
                    <em key={index}>{part.text}</em>
                  ) : (
                    <span key={index}>{part.text}</span>
                  ),
                ) ?? "Carregando observações..."}
              </h2>

              <p>{insight?.description ?? ""}</p>

              <a href="#fontes">Entenda a recomendação</a>
            </aside>
          </div>
          <div className="history-toolbar">
            <button className="period-button">
              Junho 2024 <span>⌄</span>
            </button>
            <button
              className="download-button"
              onClick={downloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? "Gerando..." : "Baixar relatório em PDF"}
            </button>
          </div>
          <div className="history-table full-table">
            <div className="table-row table-head">
              <span>Data</span>
              <span>Fluxo</span>
              <span>Humor</span>
              <span>Sintomas</span>
              <span />
            </div>

            {isLoading ? (
              <Loader show={isLoading} />
            ) : entries.length === 0 ? (
              <p className="table-empty">Nenhum registro encontrado ainda.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id}>
                  <div className="table-row">
                    <strong>{formatDate(entry.date)}</strong>

                    {/* Adicionada a classe flow-badge aqui */}
                    <span className="flow-badge">
                      {entry.flow
                        ? (flowLabels[entry.flow] ?? entry.flow)
                        : "—"}
                    </span>

                    <span>{entry.mood ?? "—"}</span>

                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {entry.symptoms.length > 0
                        ? entry.symptoms.join(", ")
                        : "Nenhum sintoma"}
                    </span>

                    <button
                      aria-label={`Mais opções para ${formatDate(entry.date)}`}
                      onClick={() => toggleExpanded(entry.id)}
                    >
                      {expandedId === entry.id ? "×" : "···"}
                    </button>
                  </div>

                  {expandedId === entry.id && (
                    <div className="table-row-detail">
                      <div>
                        <span>Intensidade da dor</span>
                        <strong>
                          {entry.painIntensity
                            ? (painLabels[entry.painIntensity] ??
                              entry.painIntensity)
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Energia</span>
                        <strong>
                          {entry.energy
                            ? (energyLabels[entry.energy] ?? entry.energy)
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Sono</span>
                        <strong>
                          {entry.sleep
                            ? (sleepLabels[entry.sleep] ?? entry.sleep)
                            : "—"}
                        </strong>
                      </div>
                      {entry.notes && (
                        <div className="table-row-detail-note">
                          <span>Observação</span>
                          <p>{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination-row">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1),
                  )
                }
                disabled={page === pagination.totalPages}
              >
                Próxima
              </button>
            </div>
          )}

          <p className="medical-note">
            Se os sintomas forem intensos, persistentes ou preocupantes, procure
            orientação de um profissional de saúde.
          </p>
        </section>
      </div>
    </main>
  );
}
