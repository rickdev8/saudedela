"use client";

import React, { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";
import { Loader } from "@/components/ui/loaders/loader-main";
import { History } from "@/components/ui/loaders/loader-history";

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



export default function HistoricoPage() {
  const { logout } = useAuth();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "flow" | "mood" | "symptoms">("all");

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

  const hasFetchedInsight = useRef(false);

  useEffect(() => {
    if (hasFetchedInsight.current) return;
    hasFetchedInsight.current = true;

    const cached = sessionStorage.getItem(INSIGHT_CACHE_KEY);
    if (cached) {
      setInsight(JSON.parse(cached));
      return;
    }
  
    fetch("/api/insight")
      .then(async (res) => {
        const data = await res.json();
  
        if (!res.ok) {
          console.error("ERRO INSIGHT (backend):", data);
          setInsight(null);
          return;
        }
  
        setInsight(data);
        sessionStorage.setItem(INSIGHT_CACHE_KEY, JSON.stringify(data));
      })
      .catch((err) => {
        console.error("ERRO INSIGHT (fetch falhou):", err);
        setInsight(null);
      });
  }, []);
  
  function toggleExpanded(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  const visibleEntries = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedSearch && filterBy === "all") return entries;

    return entries.filter((entry) => {
      const value = filterBy === "flow"
        ? flowLabels[entry.flow ?? ""] ?? entry.flow ?? ""
        : filterBy === "mood"
          ? entry.mood ?? ""
          : filterBy === "symptoms"
            ? entry.symptoms.join(" ")
            : [formatDate(entry.date), flowLabels[entry.flow ?? ""] ?? entry.flow ?? "", entry.mood ?? "", entry.symptoms.join(" "), entry.notes ?? ""].join(" ");
      return value.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    });
  }, [entries, filterBy, searchTerm]);

  return (
    <main className="tracking-page">
      <AppSidebar active="/historico" />
      <div className="tracking-main">
       
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
            {insight && (
              <aside className="insight-card history-insight" aria-label="Insight do seu histórico">
                <div className="insight-top">
                  <span className="card-index">INSIGHT</span>
                  <span className="insight-status">{insight.status === "attention" ? "Atenção" : "Seu ritmo"}</span>
                </div>
                <h2>
                  {(Array.isArray(insight.headlineParts) ? insight.headlineParts : [{ text: "Seu histórico começa a mostrar padrões.", emphasis: false }]).map((part, index) => (
                    <span key={`${part.text}-${index}`} className={part.emphasis ? "insight-emphasis" : undefined}>
                      {part.text}{" "}
                    </span>
                  ))}
                </h2>
                <p>{insight.description}</p>
              </aside>
            )}
          </div>
          <div className="history-toolbar">
            <div className="history-filters" role="search">
              <label className="history-search">
                <span className="sr-only">Pesquisar no histórico</span>
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Pesquisar no histórico"
                />
              </label>
              <label className="history-filter-select">
                <span className="sr-only">Filtrar por</span>
                <select value={filterBy} onChange={(event) => setFilterBy(event.target.value as typeof filterBy)}>
                  <option value="all">Filtrar por</option>
                  <option value="flow">Fluxo</option>
                  <option value="mood">Humor</option>
                  <option value="symptoms">Sintomas</option>
                </select>
              </label>
            </div>
            <button className="download-button"
              onClick={downloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? "Gerando..." : "Baixar relatório em PDF"}
            </button>
          </div>

          {isLoading ? (
            <History show={isLoading} />
          ) : (
            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Fluxo</th>
                    <th>Humor</th>
                    <th>Sintomas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="table-empty">
                        {entries.length === 0 ? "Nenhum registro encontrado ainda." : "Nenhum registro corresponde à sua busca."}
                      </td>
                    </tr>
                  ) : (
                    visibleEntries.map((entry) => (
                      <Fragment key={entry.id}>
                        <tr
                          className={`table-row ${
                            expandedId === entry.id ? "expanded" : ""
                          }`}
                        >
                          <td>
                            <strong className="date-text">
                              {formatDate(entry.date)}
                            </strong>
                          </td>
                          <td>
                            {entry.flow
                              ? flowLabels[entry.flow] ?? entry.flow
                              : "—"}
                          </td>
                          <td>{entry.mood ?? "—"}</td>
                          <td>
                            {entry.symptoms.length > 0
                              ? entry.symptoms.join(", ")
                              : "Nenhum sintoma"}
                          </td>
                          <td className="action-cell">
                            <button
                              className="action-button"
                              aria-label={`Mais opções para ${formatDate(
                                entry.date
                              )}`}
                              onClick={() => toggleExpanded(entry.id)}
                            >
                              {expandedId === entry.id ? "×" : "···"}
                            </button>
                          </td>
                        </tr>

                        {expandedId === entry.id && (
                          <tr className="table-row-expanded">
                            <td colSpan={5}>
                              <div className="table-row-detail">
                                <div>
                                  <span>Intensidade da dor</span>
                                  <strong>
                                    {entry.painIntensity
                                      ? painLabels[entry.painIntensity] ??
                                        entry.painIntensity
                                      : "—"}
                                  </strong>
                                </div>
                                <div>
                                  <span>Energia</span>
                                  <strong>
                                    {entry.energy
                                      ? energyLabels[entry.energy] ??
                                        entry.energy
                                      : "—"}
                                  </strong>
                                </div>
                                <div>
                                  <span>Sono</span>
                                  <strong>
                                    {entry.sleep
                                      ? sleepLabels[entry.sleep] ?? entry.sleep
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
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

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
                    Math.min(pagination.totalPages, current + 1)
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
