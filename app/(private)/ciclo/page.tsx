"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";
import { Loader } from "@/components/ui/loaders/loader-main";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;

const dayQuantity = new Date(year, month, 0).getDate();

const days = Array.from({ length: dayQuantity }, (_, index) => index + 1);

type FertileWindow = {
  ovulationDay: number | null;
  fertileDays: number[];
  estimated?: boolean;
};

// "YYYY-MM-DD" -> dia do mês, só se pertencer ao mês exibido
function toDayOfMonth(dateStr?: string | null) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return y === year && m === month ? d : null;
}

// converte a resposta do back (ovulation / fertilePeriod) para dias do mês
function buildFertileWindow(data: any): FertileWindow | null {
  const period = data?.fertilePeriod;
  if (!period?.startDate || !period?.endDate) return null;

  const fertileDays: number[] = [];
  const cursor = new Date(`${period.startDate}T00:00:00Z`);
  const end = new Date(`${period.endDate}T00:00:00Z`);

  while (cursor <= end) {
    const day = toDayOfMonth(cursor.toISOString().slice(0, 10));
    if (day) fertileDays.push(day);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return {
    ovulationDay: toDayOfMonth(data.ovulation?.date),
    fertileDays,
    estimated: true,
  };
}

export default function CicloPage() {
  const { logout } = useAuth();

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([3, 4, 5, 6, 7]);
  const [regularity, setRegularity] = useState("Regular");
  const [cycleLength, setCycleLength] = useState(28);
  const [cycleSaved, setCycleSaved] = useState(false);

  const duration = selected.length;

  const [fertileWindow, setFertileWindow] = useState<FertileWindow | null>(
    null,
  );

  const today = new Date();
  const todayDay = today.getDate();

  useEffect(() => {
    fetch("/api/ciclo")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.daysSelected) {
          setSelected(data.daysSelected);
          setRegularity(data.regularity);

          if (data.cycleLengthDays) setCycleLength(data.cycleLengthDays);

          const window = buildFertileWindow(data);
          if (window) setFertileWindow(window);

          setCycleSaved(true);
        }
      })
      .catch(() =>
        setApiError("Não foi possível carregar seu padrão salvo"),
      )
      .finally(() => setIsFetching(false));
  }, []);

  const toggleDay = (day: number) => {
    setApiError(null);

    setSelected((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  };

  async function handleSubmit() {
    setApiError(null);
    setIsSaving(true);

    try {
      // primeiro dia marcado no mês = início da última menstruação
      const firstDay = String(selected[0]).padStart(2, "0");
      const lastPeriodStart = `${year}-${String(month).padStart(
        2,
        "0",
      )}-${firstDay}`;

      const response = await fetch("/api/ciclo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daysSelected: selected,
          regularity,
          cycleLengthDays: cycleLength,
          lastPeriodStart,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(
          result.error ?? "Não foi possível salvar seu registro",
        );
        return;
      }

      const window = buildFertileWindow(result);
      if (window) setFertileWindow(window);

      setCycleSaved(true);
    } catch {
      setApiError("Não foi possível conectar ao servidor");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="tracking-page cycle-page">
      <AppSidebar active="/ciclo" />

      <div className="tracking-main">
        <section className="content-page section-wrap cycle-content">
          <div className="cycle-hero">
            <div>
              <p className="tracking-context">Seu calendário pessoal</p>

              <h1>
                Conhecer o seu
                <br />
                <em>ritmo.</em>
              </h1>

              <p className="tracking-lead">
                Marque os dias em que você geralmente menstrua. Assim,
                você começa a visualizar seu padrão de um jeito simples
                e sem julgamentos.
              </p>
            </div>

            <div className="cycle-status">
              <span>Seu padrão registrado</span>
              <strong>{duration} dias</strong>
              <small>por menstruação, em média</small>
            </div>
          </div>

          {isFetching ? (
            <div className="table-loading">
              <Loader show={isFetching} />
            </div>
          ) : (
            <>
              <div className="cycle-layout">
                <section
                  className="calendar-card"
                  aria-label="Calendário menstrual"
                >
                  <div className="calendar-heading">
                    <div>
                      <span className="card-index">
                        01 /{" "}
                        {cycleSaved ? "SEU CALENDÁRIO" : "SELECIONE OS DIAS"}
                      </span>

                      <h2>
                        {cycleSaved ? (
                          <>
                            Seu ciclo
                            <br />
                            <em>previsto.</em>
                          </>
                        ) : (
                          <>
                            Quando costuma
                            <br />
                            <em>começar?</em>
                          </>
                        )}
                      </h2>
                    </div>
                  </div>

                  <div className="calendar-grid weekdays">
                    {weekDays.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  <div className="calendar-grid">
                    {days.map((day) => {
                      const isFertile =
                        fertileWindow?.fertileDays.includes(day) ?? false;
                      const isOvulation = fertileWindow?.ovulationDay === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          className={`day ${
                            selected.includes(day) ? "selected" : ""
                          } ${isFertile ? "fertile" : ""} ${
                            isOvulation ? "ovulation" : ""
                          } ${day === todayDay ? "today" : ""}`}
                          onClick={() => !cycleSaved && toggleDay(day)}
                          aria-pressed={selected.includes(day)}
                          aria-label={`${
                            day === todayDay ? `${day}, hoje` : `Dia ${day}`
                          }${isFertile ? ", período fértil" : ""}${
                            isOvulation ? ", ovulação estimada" : ""
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="calendar-legend">
                    <span>
                      <i className="legend-period" />{" "}
                      {cycleSaved ? "Seu padrão" : "Dias de menstruação"}
                    </span>

                    <span>
                      <i className="legend-today" /> Hoje
                    </span>

                    {fertileWindow && (
                      <>
                        <span>
                          <i className="legend-fertile" /> Período fértil
                        </span>

                        <span>
                          <i className="legend-ovulation" /> Ovulação
                          estimada
                        </span>
                      </>
                    )}
                  </div>
                </section>

                <aside className="cycle-side">
                  <section
                    className={`cycle-form-card ${
                      cycleSaved ? "cycle-form-saved" : ""
                    }`}
                  >
                    {cycleSaved && (
                      <div className="cycle-saved-message" role="status">
                        Seu padrão foi adicionado. O calendário agora
                        mostra uma previsão baseada no seu registro.
                      </div>
                    )}

                    <span className="card-index">02 / SOBRE O SEU CICLO</span>

                    <h2>
                      Algumas informações
                      <br />
                      <em>para contextualizar.</em>
                    </h2>

                    <label>
                      Duração média da menstruação
                      <select value={duration} disabled>
                        <option value={duration}>
                          {duration} {duration === 1 ? "dia" : "dias"}
                        </option>
                      </select>

                      <small>
                        Calculada automaticamente pela quantidade de dias
                        selecionados no calendário.
                      </small>
                    </label>

                    <label>
                      Quantos dias dura o seu ciclo?
                      <select
                        value={cycleLength}
                        disabled={cycleSaved}
                        onChange={(event) =>
                          setCycleLength(Number(event.target.value))
                        }
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 21).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n} dias
                            </option>
                          ),
                        )}
                      </select>

                      <small>
                        Do primeiro dia de uma menstruação até o dia
                        anterior à próxima.
                      </small>
                    </label>

                    <label>
                      Como costuma ser o seu ciclo?
                      <select
                        value={regularity}
                        disabled={cycleSaved}
                        onChange={(event) =>
                          setRegularity(event.target.value)
                        }
                      >
                        <option>Regular</option>
                        <option>Um pouco irregular</option>
                        <option>Irregular</option>
                        <option>Não sei dizer</option>
                      </select>
                    </label>

                    {apiError && <p className="chat-error">{apiError}</p>}

                    {cycleSaved && (
                      <button
                        type="button"
                        className="button-outline edit-cycle"
                        onClick={() => setCycleSaved(false)}
                      >
                        Editar meu padrão
                      </button>
                    )}

                    <button
                      className="button-primary save-cycle"
                      onClick={handleSubmit}
                      disabled={isSaving || selected.length === 0}
                    >
                      {isSaving ? (
                        <Loader show={isSaving} />
                      ) : (
                        "Salvar meu padrão"
                      )}
                    </button>
                  </section>

                  <section className="cycle-note">
                    <span>i</span>
                    <p>
                      Seu ciclo não precisa ser igual todos os meses.
                      Registrar é uma forma de observar, não de criar uma
                      regra.
                    </p>
                  </section>
                </aside>
              </div>

              <section className="cycle-summary">
                <div>
                  <span>Próximo passo</span>
                  <h2>
                    Continue registrando
                    <br />
                    <em>como você se sente.</em>
                  </h2>
                </div>

                <Link className="button-outline" href="/acompanhe-se">
                  Ir para registro diário
                </Link>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
