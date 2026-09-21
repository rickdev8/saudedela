"use client";

import { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/app/(private)/sidebar/app-sidebar";
import { useAuth } from "@/app/context/auth";

const STEPS = ["Sintomas físicos e dor", "Energia e sono", "Digestão e urinário", "Ginecológico e humor", "Pele, cabelo e observações"];
const physicalOptions = ["Dor de cabeça", "Dor muscular", "Dor nas articulações", "Fadiga geral", "Febre"];
const painOptions = ["Nenhuma", "Leve", "Moderada", "Forte", "Muito forte"];
const energyOptions = ["Baixa", "Normal", "Alta"];
const sleepOptions = ["Ruim", "Regular", "Bom"];
const digestionOptions = ["Inchaço", "Azia", "Constipação", "Diarreia", "Náusea"];
const urinaryOptions = ["Ardor ao urinar", "Urgência urinária", "Aumento da frequência", "Retenção"];
const gynecologicalOptions = ["Corrimento diferente", "Coceira", "Odor diferente", "Dor pélvica", "Sangramento fora do ciclo"];
const moodOptions = ["Ansiedade", "Tristeza", "Irritabilidade", "Oscilações de humor", "Dificuldade de concentração"];
const skinHairOptions = ["Acne", "Pele ressecada", "Queda de cabelo", "Oleosidade excessiva"];

function MultiChoice({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <div className="symptom-row choices">{options.map((item) => <button key={item} type="button" className={selected.includes(item) ? "symptom selected" : "symptom"} onClick={() => onToggle(item)}>{item}{selected.includes(item) && <span>×</span>}</button>)}</div>;
}

export default function AvaliacaoPage() {
  const { logout } = useAuth();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({ physical: [], digestion: [], urinary: [], gynecological: [], mood: [], skin: [] });
  const [pain, setPain] = useState("Nenhuma");
  const [energy, setEnergy] = useState("Normal");
  const [sleep, setSleep] = useState("Regular");
  const [notes, setNotes] = useState({ body: "", medications: "", other: "" });
  const toggle = (group: string, value: string) => setSelected((current) => ({ ...current, [group]: current[group].includes(value) ? current[group].filter((item) => item !== value) : [...current[group], value] }));
  const updateNote = (key: keyof typeof notes, value: string) => setNotes((current) => ({ ...current, [key]: value }));

  return <main className="tracking-page evaluation-page"><AppSidebar active="/avaliacao" /><div className="tracking-main"><header className="tracking-header"><span className="mobile-page-title">Avaliação de saúde</span><button onClick={logout} className="login-link">Sair</button></header>
    <section className="tracking-hero section-wrap evaluation-hero"><div><p className="tracking-context">Um retrato mais amplo</p><h1>Avaliação geral<br /><em>de saúde.</em></h1><p className="tracking-lead">Vá além do ciclo — registre como seu corpo está de forma geral. Cada avaliação é comparada com o seu próprio histórico.</p></div><div className="period-summary"><span>Etapa</span><strong>{Math.min(step + 1, STEPS.length)} de {STEPS.length}</strong><small>{STEPS[Math.min(step, STEPS.length - 1)]}</small></div></section>
    <section className="tracking-content section-wrap evaluation-content"><div className="entry-card evaluation-card">
      {step === 0 && <><div className="card-heading"><div><span className="card-index">01</span><h2>Sintomas físicos e dor</h2></div></div><div className="field-group"><label>Sintomas físicos gerais</label><MultiChoice options={physicalOptions} selected={selected.physical} onToggle={(value) => toggle("physical", value)} /></div><div className="field-group"><label>Intensidade da dor</label><div className="choice-row">{painOptions.map((item) => <button type="button" key={item} className={pain === item ? "choice selected" : "choice"} onClick={() => setPain(item)}>{item}</button>)}</div></div></>}
      {step === 1 && <><div className="card-heading"><div><span className="card-index">02</span><h2>Energia e sono</h2></div></div><div className="field-group"><label>Como está sua energia?</label><div className="choice-row">{energyOptions.map((item) => <button type="button" key={item} className={energy === item ? "choice selected" : "choice"} onClick={() => setEnergy(item)}>{item}</button>)}</div></div><div className="field-group"><label>Como foi seu sono?</label><div className="choice-row">{sleepOptions.map((item) => <button type="button" key={item} className={sleep === item ? "choice selected" : "choice"} onClick={() => setSleep(item)}>{item}</button>)}</div></div></>}
      {step === 2 && <><div className="card-heading"><div><span className="card-index">03</span><h2>Digestão e urinário</h2></div></div><div className="field-group"><label>Sintomas digestivos</label><MultiChoice options={digestionOptions} selected={selected.digestion} onToggle={(value) => toggle("digestion", value)} /></div><div className="field-group"><label>Sintomas urinários</label><MultiChoice options={urinaryOptions} selected={selected.urinary} onToggle={(value) => toggle("urinary", value)} /></div></>}
      {step === 3 && <><div className="card-heading"><div><span className="card-index">04</span><h2>Ginecológico e humor</h2></div></div><div className="field-group"><label>Sintomas ginecológicos</label><MultiChoice options={gynecologicalOptions} selected={selected.gynecological} onToggle={(value) => toggle("gynecological", value)} /></div><div className="field-group"><label>Alterações de humor</label><MultiChoice options={moodOptions} selected={selected.mood} onToggle={(value) => toggle("mood", value)} /></div></>}
      {step === 4 && <><div className="card-heading"><div><span className="card-index">05</span><h2>Pele, cabelo e observações</h2></div></div><div className="field-group"><label>Pele e cabelo</label><MultiChoice options={skinHairOptions} selected={selected.skin} onToggle={(value) => toggle("skin", value)} /></div>{([["body", "Alterações recentes no corpo", "Algo que você notou recentemente..."], ["medications", "Medicamentos em uso", "Liste medicamentos, se estiver usando algum..."], ["other", "Outras informações", "Qualquer outra observação relevante..."]] as const).map(([key, label, placeholder]) => <div className="field-group notes-field" key={key}><label htmlFor={key}>{label}</label><textarea id={key} maxLength={500} value={notes[key]} onChange={(event) => updateNote(key, event.target.value)} placeholder={placeholder} /></div>)}</>}
      {saved && <div className="evaluation-success"><strong>Avaliação salva.</strong><span>Seu registro foi adicionado ao histórico.</span></div>}
      <div className="save-row">{step > 0 && <button type="button" className="button-outline" onClick={() => setStep((value) => value - 1)}>Voltar</button>}{step < STEPS.length - 1 ? <button type="button" className="button-primary save-button" onClick={() => setStep((value) => value + 1)}>Próxima etapa</button> : <button type="button" className="button-primary save-button" onClick={() => setSaved(true)}>{saved ? "Registro salvo" : "Concluir avaliação"}</button>}</div>
    </div><aside className="evaluation-aside"><div className="evaluation-progress"><span>Seu percurso</span>{STEPS.map((item, index) => <button type="button" key={item} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)}><b>{String(index + 1).padStart(2, "0")}</b>{item}</button>)}</div><div className="evaluation-note"><span>SaúdeDela</span><p>Não existe resposta certa. Este é um espaço para observar seu corpo com mais calma.</p></div></aside></section>
    <footer className="tracking-footer section-wrap"><span>Seus registros são privados e pertencem a você.</span><span>SaúdeDela · 2026</span></footer></div></main>;
}
