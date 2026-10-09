"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";

import { History } from "@/components/ui/loaders/loader-history";

type HeadlinePart = {
  text: string;
  emphasis: boolean;
};

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

const INSIGHT_CACHE_KEY = "saudedela:insight";

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

const FILTER_OPTIONS: { value: string; label: string; param?: string }[] = [
  { value: "all", label: "Todos" },
  { value: "flow", label: "Fluxo" },
  { value: "mood", label: "Humor" },
  { value: "pain", label: "Dor" },
  { value: "energy", label: "Energia" },
  { value: "sleep", label: "Sono" },
];

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

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export default function HistoricoPage() {
  const { logout } = useAuth();

  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);

  const [insight, setInsight] = useState<Insight | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"normal" | "newest" | "oldest">("normal");
  const [searchTerm, setSearchTerm] = useState("");

  const visibleEntries = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
    const filtered = normalizedSearch
      ? entries.filter((entry) =>
          [
            formatDate(entry.date),
            entry.flow,
            entry.mood,
            ...entry.symptoms,
            entry.notes,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("pt-BR")
            .includes(normalizedSearch),
        )
      : entries;

    if (sortOrder === "normal") return filtered;

    return [...filtered].sort((a, b) => {
      const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "newest" ? -difference : difference;
    });
  }, [entries, searchTerm, sortOrder]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const debouncedSearch = useDebouncedValue(search, 400);

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
    setPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    setIsLoading(true);

    const params = new URLSearchParams({ page: String(page) });

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    fetch(`/api/acompanhe-se?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setPagination(data.pagination ?? null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, debouncedSearch, filter]);

  const hasFetchedInsight = useRef(false);

  useEffect(() => {
    if (hasFetchedInsight.current) return;

    hasFetchedInsight.current = true;

    const cachedRaw = sessionStorage.getItem(INSIGHT_CACHE_KEY);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached) {
          setInsight(cached);
          return;
        }
        sessionStorage.removeItem(INSIGHT_CACHE_KEY);
      } catch {
        sessionStorage.removeItem(INSIGHT_CACHE_KEY);
      }
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
                Um registro simples das suas observações ao longo do tempo.
                Use esse espaço para reconhecer ritmos e preparar conversas
                mais claras.
              </p>
            </div>

            {insight && (
              <aside
                className="insight-card history-insight"
                aria-label="Insight do seu histórico"
              >
                <div className="insight-top">
                  <span className="card-index">INSIGHT</span>

                  <span className="insight-status">
                    {insight.status === "attention" ? "Atenção" : "Seu ritmo"}
                  </span>
                </div>

                <h2>
                  {insight.headlineParts.map((part, index) => (
                    <span
                      key={`${part.text}-${index}`}
                      className={part.emphasis ? "insight-emphasis" : undefined}
                    >
                      {part.text}{" "}
                    </span>
                  ))}
                </h2>

                <p>{insight.description}</p>
              </aside>
            )}
          </div>

          {/* BARRA DE PESQUISA E FILTRO */}

          <div className="history-toolbar">
            <label className="history-search">
              <span className="history-search-label">Pesquisar por</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Pesquisar no histórico"
                aria-label="Pesquisar no histórico"
              />
            </label>
            <button className="period-button">
              Junho 2024 <span>⌄</span>
            </button>
            <label className="history-sort-control">
              <span>Filtrar por</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "normal" | "newest" | "oldest")
                }
                aria-label="Filtrar por ordem de data"
              >
                <option value="normal">Normal</option>
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </label>
            <button
              className="download-button"
              onClick={downloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? "Gerando..." : "Baixar relatório em PDF"}
            </button>
          </div>

          {/* TABELA */}

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
                    <th>Dor</th>
                    <th>Energia</th>
                    <th>Sono</th>
                    <th>Observações</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="table-empty">
                        Nenhum registro encontrado ainda.
                      </td>
                    </tr>
                  ) : (
                    visibleEntries.map((entry) => (
                      <tr className="table-row" key={entry.id}>
                        <td>
                          <strong className="date-text">{formatDate(entry.date)}</strong>
                        </td>
                        <td>{entry.flow ? flowLabels[entry.flow] ?? entry.flow : "—"}</td>
                        <td>{entry.mood ?? "—"}</td>
                        <td>{entry.symptoms.length > 0 ? entry.symptoms.join(", ") : "Nenhum sintoma"}</td>
                        <td>{entry.painIntensity ? painLabels[entry.painIntensity] ?? entry.painIntensity : "—"}</td>
                        <td>{entry.energy ? energyLabels[entry.energy] ?? entry.energy : "—"}</td>
                        <td>{entry.sleep ? sleepLabels[entry.sleep] ?? entry.sleep : "—"}</td>
                        <td>{entry.notes || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINAÇÃO */}

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
                  setPage((current) => Math.min(pagination.totalPages, current + 1))
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
