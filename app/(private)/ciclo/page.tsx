"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { use, useState } from "react";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loaders/loader-main";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const date = new Date();

const dayQuantity = new Date(
  date.getFullYear(),
  date.getMonth() + 1,
  0,
).getDate();

const days = Array.from({ length: dayQuantity }, (_, index) => index + 1);

export default function CicloPage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([3, 4, 5, 6, 7]);
  const [duration, setDuration] = useState(3);
  const [regularity, setRegularity] = useState("Regular");
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
    setLoading(true);

    try {
      const response = await fetch("/api/ciclo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationDays: duration,
          daysSelected: selected,
          regularity: regularity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error ?? "Não foi possível salvar seu registro");
        return;
      }
    } catch {
      setApiError("Não foi possível conectar ao servidor");
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  }

  return (
    <main className="tracking-page cycle-page">
      <AppSidebar active="/ciclo" />
      <div className="tracking-main">
        <header className="tracking-header">
          <span className="mobile-page-title">Meu ciclo</span>
          <button onClick={logout} className="login-link">
            Sair
          </button>
        </header>
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
                Marque os dias em que você geralmente menstrua. Assim, você
                começa a visualizar seu padrão de um jeito simples e sem
                julgamentos.
              </p>
            </div>
            <div className="cycle-status">
              <span>Seu padrão registrado</span>
              <strong>{selected.length} dias</strong>
              <small>por ciclo, em média</small>
            </div>
          </div>
          <div className="cycle-layout">
            <section
              className="calendar-card"
              aria-label="Calendário menstrual"
            >
              <div className="calendar-heading">
                <div>
                  <span className="card-index">01 / SELECIONE OS DIAS</span>
                  <h2>
                    Quando costuma
                    <br />
                    <em>começar?</em>
                  </h2>
                </div>
              </div>
              <div className="calendar-grid weekdays">
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={selected.includes(day) ? "day selected" : "day"}
                    onClick={() => toggleDay(day)}
                    aria-pressed={selected.includes(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="calendar-legend">
                <span>
                  <i className="legend-period" /> Dias de menstruação
                </span>
                <span>
                  <i /> Clique para selecionar
                </span>
              </div>
            </section>
            <aside className="cycle-side">
              <section className="cycle-form-card">
                <span className="card-index">02 / SOBRE O SEU CICLO</span>
                <h2>
                  Algumas informações
                  <br />
                  <em>para contextualizar.</em>
                </h2>
                <label>
                  Duração média da menstruação
                  <select
                    value={duration}
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                  >
                    <option value={3}>3 dias</option>
                    <option value={4}>4 dias</option>
                    <option value={5}>5 dias</option>
                    <option value={6}>6 dias</option>
                    <option value={7}>7 dias</option>
                    <option value={8}>8 dias</option>
                    <option value={9}>9 dias</option>
                    <option value={10}>10 dias</option>
                  </select>
                </label>
                <label>
                  Como costuma ser o seu ciclo?
                  <select
                    value={regularity}
                    onChange={(event) => setRegularity(event.target.value)}
                  >
                    <option>Regular</option>
                    <option>Um pouco irregular</option>
                    <option>Irregular</option>
                    <option>Não sei dizer</option>
                  </select>
                </label>
                <button
                  className="button-primary save-cycle"
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {loading ? <Loader show={loading} /> : "Salvar meu padrão"}
                </button>
              </section>
              <section className="cycle-note">
                <span>i</span>
                <p>
                  Seu ciclo não precisa ser igual todos os meses. Registrar é
                  uma forma de observar, não de criar uma regra.
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
        </section>
      </div>
    </main>
  );
}
