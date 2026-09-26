"use client";



import { useEffect, useState } from "react";

import ReactECharts from "echarts-for-react";

const colors = {
  wine: "#8f1d2c",
  petrol: "#2b4c4a",
  gold: "#c9973f",
  coral: "#f6a27f",
  ink: "#3a3a3a",
  muted: "#817b77",
  line: "rgba(58,58,58,.12)",
  mineral: "#f6efe9",
};

const base = {
  animationDuration: 700,
  textStyle: { fontFamily: "DM Sans, sans-serif", color: colors.ink },
  tooltip: {
    backgroundColor: colors.ink,
    borderWidth: 0,
    textStyle: { color: "#fff" },
  },
};

const moodCategories = ["Feliz", "Normal", "Ansiosa", "Cansada", "Irritada", "Triste"];
const moodColorByCategory: Record<string, string> = {
  Feliz: colors.gold,
  Normal: colors.petrol,
  Ansiosa: colors.coral,
  Cansada: "#b08968",
  Irritada: colors.wine,
  Triste: "#5c6b73",
};

const flowColorByLabel: Record<string, string> = {
  "Sem fluxo": "#e8c5c6",
  "Leve": "#d68e94",
  "Moderado": "#c0525e",
  "Intenso": colors.wine,
};

type DashboardData = {
  referenceMonth: string;
  totalRegistros: number;
  moodTimeline: { day: string; mood: string }[];
  topSymptoms: { label: string; days: number }[];
  indicators: { label: string; value: number; max: number }[];
  flowLevels: { label: string; value: number }[];
  calendarData: [string, number][];
};

function monthLabel(ref: string) {
  const [year, month] = ref.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function HealthCharts() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => console.error("ERRO DASHBOARD (frontend):", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="echarts-grid"><p>Carregando gráficos...</p></div>;
  }

  if (!data || data.totalRegistros === 0) {
    return (
      <div className="echarts-grid">
        <p>Ainda não há registros suficientes neste mês para gerar os gráficos.</p>
      </div>
    );
  }

  const periodLabel = monthLabel(data.referenceMonth);

  // ---------- Humor ao longo da semana ----------
  const moodOption = {
    ...base,
    grid: { left: 90, right: 24, top: 18, bottom: 28 },
    xAxis: {
      type: "category",
      data: data.moodTimeline.map((m) => m.day),
      axisLine: { lineStyle: { color: colors.line } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "category",
      data: moodCategories,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.line } },
    },
    series: [
      {
        type: "scatter",
        symbolSize: 16,
        data: data.moodTimeline.map((m) => ({
          value: [m.day, m.mood],
          itemStyle: { color: moodColorByCategory[m.mood] ?? colors.muted },
        })),
      },
    ],
    tooltip: {
      ...base.tooltip,
      formatter: (p: any) => `Dia ${p.value[0]}: ${p.value[1]}`,
    },
  };

  // ---------- Sintomas registrados ----------
  const symptomOption = {
    ...base,
    grid: { left: 110, right: 30, top: 18, bottom: 20 },
    xAxis: {
      type: "value",
      splitLine: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "category",
      data: data.topSymptoms.map((s) => s.label).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: data.topSymptoms.map((s) => s.days).reverse(),
        barWidth: 14,
        itemStyle: { borderRadius: [0, 8, 8, 0], color: colors.coral },
        label: {
          show: true,
          position: "right",
          formatter: "{c} dias",
          color: colors.muted,
          fontSize: 11,
        },
      },
    ],
  };

  // ---------- Indicadores do período ----------
  const indicatorsOption = {
    ...base,
    grid: { left: 130, right: 40, top: 10, bottom: 10 },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: data.indicators.map((i) => i.label),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        barWidth: 12,
        data: data.indicators.map((i, idx) => ({
          value: i.value,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: [colors.gold, colors.petrol, colors.coral, colors.wine][idx % 4],
          },
        })),
        label: {
          show: true,
          position: "right",
          formatter: (p: any) => `${p.value}/${data.indicators[p.dataIndex].max}`,
          color: colors.muted,
          fontSize: 10,
        },
      },
    ],
  };

  // ---------- Fluxo menstrual ----------
  const flowOption = {
    ...base,
    grid: { left: 90, right: 40, top: 10, bottom: 10 },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: data.flowLevels.map((f) => f.label),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        barWidth: 14,
        data: data.flowLevels.map((f) => ({
          value: f.value,
          itemStyle: { borderRadius: [0, 6, 6, 0], color: flowColorByLabel[f.label] ?? colors.wine },
        })),
        label: {
          show: true,
          position: "right",
          formatter: "{c} dias",
          color: colors.muted,
          fontSize: 10,
        },
      },
    ],
  };

  // ---------- Intensidade dos registros ----------
  const maxIntensity = Math.max(1, ...data.calendarData.map(([, v]) => v));

  const calendarOption = {
    ...base,
    tooltip: {
      ...base.tooltip,
      formatter: (params: { value: number[] }) =>
        `${params.value[1]}: ${params.value[2]} registro(s) de sintoma`,
    },
    visualMap: {
      min: 0,
      max: maxIntensity,
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      text: ["Mais registros", "Menos registros"],
      textStyle: { color: colors.muted, fontSize: 10 },
      inRange: { color: ["#f6efe9", "#e8c5c6", "#c87583", colors.wine] },
    },
    calendar: {
      top: 18,
      left: 34,
      right: 18,
      cellSize: ["auto", 28],
      range: data.referenceMonth,
      splitLine: { lineStyle: { color: colors.line } },
      itemStyle: { borderWidth: 1, borderColor: "#fff" },
      yearLabel: { show: false },
      monthLabel: { show: false },
      dayLabel: {
        firstDay: 0,
        color: colors.muted,
        nameMap: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 0,
        data: data.calendarData,
      },
    ],
  };

  const charts = [
    ["Humor ao longo da semana", "Últimos 7 dias", moodOption, "compact"],
    ["Sintomas registrados", periodLabel, symptomOption, "compact"],
    ["Indicadores do período", "Média das anotações", indicatorsOption, "compact"],
    ["Fluxo menstrual", periodLabel, flowOption, "compact"],
    ["Intensidade dos registros", periodLabel, calendarOption, "wide"],
  ] as const;

  return <div className="echarts-grid">{charts.map(([title, period, option, size], index) => <article className={`echart-card ${size}`} key={title}><header><div><span className="card-index">0{index + 1}</span><h2>{title}</h2></div><span>{period}</span></header><ReactECharts option={option} style={{ height: size === "compact" ? 270 : 285, width: "100%" }} opts={{ renderer: "svg" }} /></article>)}</div>;
}
