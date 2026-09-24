"use client";


import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Loader } from "@/components/ui/loaders/loader-main";

const symptoms = [
  "Cólicas",
  "Cansaço",
  "Inchaço",
  "Dor de cabeça",
  "Sensibilidade nos seios",
  "Náusea",
  "Dor lombar",
  "Acne",
  "Alteração de apetite",
  "Alteração do sono",
];
const flowOptions = ["Sem fluxo", "Leve", "Moderado", "Intenso"];
const painOptions = ["Nenhuma", "Leve", "Moderada", "Forte", "Muito forte"];
const energyOptions = ["Baixa", "Normal", "Alta"];
const sleepOptions = ["Ruim", "Regular", "Bom"];
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

type HeadlinePart = { text: string; emphasis: boolean };

type Insight = {
  status: "insufficient_data" | "normal" | "attention";
  headlineParts: HeadlinePart[];
  description: string;
};

const INSIGHT_CACHE_KEY = "saudedela:insight";

export default function AcompanheSePage() {
  const { logout } = useAuth();
  const today = new Date();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [flow, setFlow] = useState("Moderado");
  const moodOptions = ["Feliz", "Bem", "Normal", "Cansada", "Sensível"];
  const [mood, setMood] = useState("Normal");
  const [painIntensity, setPainIntensity] = useState("Nenhuma");
  const [energy, setEnergy] = useState(2);
  const [sleep, setSleep] = useState("Regular");
  const [notes, setNotes] = useState("");
  const [showMoreSymptoms, setShowMoreSymptoms] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "Cólicas",
    "Cansaço",
    "Inchaço",
  ]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function toggleSymptom(item: string) {
    setSelectedSymptoms((current) =>
      current.includes(item)
        ? current.filter((symptom) => symptom !== item)
        : [...current, item],
    );
    setSaved(false);
  }

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

  async function saveEntry() {
    setSaved(false);
    setApiError("");
    setLoading(true);
    setIsSaving(true);
    try {
      const response = await fetch("/api/acompanhe-se", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          flow,
          mood,
          symptoms: selectedSymptoms,
          painIntensity,
          energy: ["Baixa", "Abaixo do normal", "Normal", "Boa", "Alta"][energy - 1],
          sleep,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok)
        throw new Error("Não foi possível salvar seu registro.");

      sessionStorage.removeItem("saudedela:insight");
      setSaved(true);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar seu registro.",
      );
    } finally {
      setLoading(false);
      setIsSaving(false);
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
              Como você está
              <br />
              <em>hoje?</em>
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
          <div className="entry-card daily-checkin-card">
            <div className="card-heading">
              <div>
                <span className="card-index">01</span>
                <h2>Como você está hoje?</h2>
              </div>
              <span className="date-label">
                Hoje, {today.getDate()} de{" "}
                {today.toLocaleDateString("pt-BR", { month: "long" })}
              </span>
            </div>
            <div className="field-group">
              <label>Como está seu humor?</label>
              <div className="mood-row">
                {moodOptions.map((item, index) => (
                  <button
                    type="button"
                    className={mood === item ? "mood selected" : "mood"}
                    onClick={() => { setMood(item); setSaved(false); }}
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
                {symptoms
                  .slice(0, showMoreSymptoms ? symptoms.length : 5)
                  .map((item) => (
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
                      {selectedSymptoms.includes(item) && <span aria-hidden="true">✓</span>}
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
                      {selectedSymptoms.includes(item) && <span aria-hidden="true">✓</span>}
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
            <div className="field-group">
              <label>Intensidade da dor</label>
              <div className="choice-row">
                {painOptions.map((item) => (
                  <button
                    type="button"
                    className={
                      painIntensity === item ? "choice selected" : "choice"
                    }
                    onClick={() => setPainIntensity(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group energy-field">
              <div className="field-label-row"><label htmlFor="energy">Como está sua energia?</label><strong>{["Baixa", "Abaixo do normal", "Normal", "Boa", "Alta"][energy - 1]}</strong></div>
              <input id="energy" type="range" min="1" max="5" step="1" value={energy} onChange={(event) => { setEnergy(Number(event.target.value)); setSaved(false); }} aria-label="Nível de energia" />
              <div className="range-labels"><span>Baixa</span><span>Alta</span></div>
            </div>
            <div className="field-group">
              <label>Como foi seu sono?</label>
              <div className="choice-row">
                {sleepOptions.map((item) => (
                  <button
                    type="button"
                    className={sleep === item ? "choice selected" : "choice"}
                    onClick={() => setSleep(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group notes-field">
              <label htmlFor="notes">Alguma observação?</label>
              <textarea
                id="notes"
                maxLength={500}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Escreva algo que queira lembrar..."
              />
              <small>{notes.length}/500</small>
            </div>
            <div className="save-row">
              <button
                type="button"
                className="button-primary save-button"
                onClick={saveEntry}
                disabled={isSaving}
              >
                {loading ? (
                  <Loader show={loading} />
                ) : saved ? (
                  "Registro salvo"
                ) : (
                  "Salvar registro"
                )}
              </button>
            </div>
          </div>
          <aside className="insight-card">
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

          <section className="daily-history-preview" aria-labelledby="recent-days-title">
            <h2 id="recent-days-title">Últimos registros</h2>
            <div className="daily-history-list">
              {history.map((item) => (
                <article className="daily-history-item" key={item.date}>
                  <strong>{item.date}</strong>
                  <span>{item.mood} · {item.flow}</span>
                  <small>{item.symptoms}</small>
                </article>
              ))}
            </div>
          </section>
        </section>
        <footer className="tracking-footer section-wrap">
          <span>Seus registros são privados e pertencem a você.</span>
          <span>SaúdeDela · 2026</span>
        </footer>
      </div>
    </main>
  );
}
