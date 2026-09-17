"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";
import { useState, type KeyboardEvent } from "react";
import { Loader } from "@/components/ui/loaders/loader-main";

const symptoms = ["Cólicas", "Cansaço", "Inchaço"];
const history = [
  {
    date: "18 JUN 2024",
    flow: "Moderado",
    mood: "Normal",
    symptoms: "Cólicas, cansaço",
  },
  { date: "17 JUN 2024", flow: "Leve", mood: "Ansiosa", symptoms: "Inchaço" },
  {
    date: "16 JUN 2024",
    flow: "Sem fluxo",
    mood: "Feliz",
    symptoms: "Nenhum sintoma",
  },
];

function PulseMark() {
  return (
    <span className="pulse-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 17h5l2.1-6 3.4 11 2.2-5H25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const MIN_LOADING_TIME = 3000;

export default function AcompanheSePage() {
  const { logout } = useAuth();
  const [flow, setFlow] = useState("Moderado");
  const [mood, setMood] = useState("Normal");
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "Cólicas",
    "Cansaço",
    "Inchaço",
  ]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const date = new Date();

  function toggleSymptom(item: string) {
    setSelectedSymptoms((current) =>
      current.includes(item)
        ? current.filter((symptom) => symptom !== item)
        : [...current, item],
    );
    setSaved(false);
  }

  async function saveEntry() {
    setApiError(null);
    setIsSaving(true);
    setLoading(true);

    const startedAt = Date.now();

    try {
      const response = await fetch("/api/acompanhe-se", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          flow,
          mood,
          symptoms: selectedSymptoms,
          notes: null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error ?? "Não foi possível salvar seu registro");
        return;
      }

      setSaved(true);
    } catch {
      setApiError("Não foi possível conectar ao servidor");
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = MIN_LOADING_TIME - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setIsSaving(false);
      setLoading(false);
    }
  }

  function addCustomSymptom() {
    const symptom = customSymptom.trim();
    if (!symptom) return;
    setSelectedSymptoms((current) =>
      current.includes(symptom) ? current : [...current, symptom],
    );
    setCustomSymptom("");
    setIsAddingSymptom(false);
    setSaved(false);
  }

  function handleCustomSymptomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      event.keyCode !== 229
    ) {
      event.preventDefault();
      addCustomSymptom();
    }
  }

  return (
    <main className="tracking-page">
      <AppSidebar active="/acompanhe-se" />
      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Meu acompanhamento</span>
          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>

        <section className="tracking-hero section-wrap">
          <div>
            <p className="tracking-context">Seu espaço pessoal</p>
            <h1>
              Conhecer seus padrões
              <br />
              <em>é cuidar de você.</em>
            </h1>
            <p className="tracking-lead">
              Registre como você está se sentindo. Com o tempo, pequenas
              anotações podem ajudar a levar mais clareza para a sua próxima
              conversa de saúde.
            </p>
          </div>
          <div className="period-summary">
            <span>Período acompanhado</span>
            <strong>12 — 18 JUN</strong>
            <small>7 dias registrados neste ciclo</small>
          </div>
        </section>

        <section className="tracking-content section-wrap">
          <div className="entry-card">
            <div className="card-heading">
              <div>
                <span className="card-index">01</span>
                <h2>Como você está hoje?</h2>
              </div>
              <span className="date-label">
                Hoje, {date.getDate()} de{" "}
                {date.toLocaleDateString("pt-BR", {
                  month: "long",
                })}
              </span>
            </div>
            <div className="field-group">
              <label>Fluxo menstrual</label>
              <div className="choice-row">
                {["Sem fluxo", "Leve", "Moderado", "Intenso"].map((item) => (
                  <button
                    className={flow === item ? "choice selected" : "choice"}
                    onClick={() => {
                      setFlow(item);
                      setSaved(false);
                    }}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label>Como está seu humor?</label>
              <div className="mood-row">
                {[
                  "Feliz",
                  "Normal",
                  "Ansiosa",
                  "Triste",
                  "Irritada",
                  "Cansada",
                ].map((item, index) => (
                  <button
                    className={mood === item ? "mood selected" : "mood"}
                    onClick={() => {
                      setMood(item);
                      setSaved(false);
                    }}
                    key={item}
                  >
                    <i className={`mood-dot mood-${index}`} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label>O que você sentiu?</label>
              <div className="symptom-row choices">
                {symptoms.map((item) => (
                  <button
                    className={
                      selectedSymptoms.includes(item)
                        ? "symptom selected"
                        : "symptom"
                    }
                    onClick={() => toggleSymptom(item)}
                    key={item}
                  >
                    {item}
                    <span>×</span>
                  </button>
                ))}
                {selectedSymptoms
                  .filter((item) => !symptoms.includes(item))
                  .map((item) => (
                    <button
                      className="symptom selected"
                      onClick={() => toggleSymptom(item)}
                      key={item}
                    >
                      {item}
                      <span>×</span>
                    </button>
                  ))}
                {isAddingSymptom ? (
                  <div className="custom-symptom-field">
                    <input
                      autoFocus
                      aria-label="Digite outro sintoma"
                      value={customSymptom}
                      onChange={(event) => setCustomSymptom(event.target.value)}
                      onKeyDown={handleCustomSymptomKeyDown}
                      placeholder="Digite um sintoma"
                    />
                    <button type="button" onClick={addCustomSymptom}>
                      Adicionar
                    </button>
                    <button
                      type="button"
                      className="cancel-custom-symptom"
                      onClick={() => {
                        setIsAddingSymptom(false);
                        setCustomSymptom("");
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="symptom add-symptom"
                    type="button"
                    onClick={() => setIsAddingSymptom(true)}
                  >
                    + Outro sintoma
                  </button>
                )}
              </div>
            </div>
            <div className="save-row">
              <button
                className="button-primary save-button"
                onClick={saveEntry}
                disabled={isSaving}
              >
                {loading ? <Loader /> : saved ? "Registro salvo" : "Salvar registro"}
              </button>
              {saved && !loading && (
                <span className="save-feedback" role="status">
                  Anotação adicionada ao seu histórico.
                </span>
              )}
            </div>
          </div>

          <aside className="insight-card">
            <div className="insight-top">
              <span>Observação do período</span>
              <span className="soft-dot" />
            </div>
            <h2>
              Você registrou
              <br />
              <em>cansaço</em> em 3 dias.
            </h2>
            <p>
              Isso é apenas uma observação baseada nas suas anotações — não
              representa um diagnóstico. Acompanhar por mais tempo pode ajudar a
              entender se esse padrão continua.
            </p>
            <a href="#fontes">Entenda a recomendação</a>
          </aside>
        </section>

        <section className="history-section section-wrap">
          <div className="history-heading">
            <div>
              <span className="card-index">02</span>
              <h2>Seu histórico</h2>
            </div>
            <div className="history-actions">
              <button className="period-button" onClick={() => setSaved(false)}>
                Junho 2024 <span>⌄</span>
              </button>
              <button
                className="download-button"
                onClick={() => window.print()}
              >
                Baixar relatório em PDF
              </button>
            </div>
          </div>
          <div className="history-table">
            <div className="table-row table-head">
              <span>Data</span>
              <span>Fluxo</span>
              <span>Humor</span>
              <span>Sintomas</span>
              <span />
            </div>
            {history.map((row) => (
              <div className="table-row" key={row.date}>
                <strong>{row.date}</strong>
                <span>{row.flow}</span>
                <span>{row.mood}</span>
                <span>{row.symptoms}</span>
                <button aria-label={`Mais opções para ${row.date}`}>···</button>
              </div>
            ))}
          </div>
          <p className="medical-note">
            Se os sintomas forem intensos, persistentes ou preocupantes, procure
            orientação de um profissional de saúde.
          </p>
        </section>

        <footer className="tracking-footer section-wrap">
          <span>Seus registros são privados e pertencem a você.</span>
          <span>SaúdeDela · 2024</span>
        </footer>
      </div>
    </main>
  );
}
