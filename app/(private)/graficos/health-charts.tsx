"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import styles from "./charts.module.css";

const colors = {
  wine: "#8f1d2c",
  petrol: "#2b4c4a",
  gold: "#c9973f",
  coral: "#f6a27f",
  ink: "#3a3a3a",
  muted: "#817b77",
  line: "rgba(58, 58, 58, 0.12)",
  mineral: "#f6efe9",
};

const base = {
  animationDuration: 700,
  textStyle: {
    fontFamily: "DM Sans, sans-serif",
    color: colors.ink,
  },
  tooltip: {
    backgroundColor: colors.ink,
    borderWidth: 0,
    textStyle: {
      color: "#fff",
    },
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
  Leve: "#d68e94",
  Moderado: "#c0525e",
  Intenso: colors.wine,
};

type DashboardData = {
  referenceMonth: string;
  totalRegistros: number;
  moodTimeline: { day: string; mood: string }[];
  topSymptoms: { label: string; days: number }[];
  indicators: { label: string; value: number; max: number }[];
  flowLevels: { label: string; value: number }[];
  calendarData: [string, number, number?][];
};

function monthLabel(ref: string) {
  const [year, month] = ref.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function HealthCharts() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        console.log("📊 DASHBOARD DATA:", json); // temporário, pra depurar — remove depois
        if (json.error) {
          throw new Error(json.error);
        }
        setData(json);
      })
      .catch((err) => {
        console.error("ERRO DASHBOARD (frontend):", err);
        setErrorMessage(err.message ?? "Erro ao carregar os gráficos.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className={styles.echartsGrid}>
        <p className={styles.message}>Carregando gráficos...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.echartsGrid}>
        <p className={styles.message}>{errorMessage}</p>
      </div>
    );
  }

  if (!data || data.totalRegistros === 0) {
    return (
      <div className={styles.echartsGrid}>
        <p className={styles.message}>
          Ainda não há registros suficientes neste mês para gerar os gráficos.
        </p>
      </div>
    );
  }

  const periodLabel = monthLabel(data.referenceMonth);

  // ---------- 1. Humor ao longo da semana ----------
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
      formatter: (p: any) => `${p.value[0]}: ${p.value[1]}`,
    },
  };

  // ---------- 2. Sintomas registrados ----------
  const symptomOption = {
    ...base,
    grid: { left: 110, right: 30, top: 18, bottom: 20 },
    xAxis: { type: "value", splitLine: { show: false }, axisLabel: { show: false } },
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

  // ---------- 3. Indicadores do período: 4 mini-gauges ----------
  const gaugeCenters: [string, string][] = [
    ["25%", "30%"],
    ["75%", "30%"],
    ["25%", "72%"],
    ["75%", "72%"],
  ];

  const indicatorColors = [colors.petrol, colors.coral, colors.gold, colors.wine];

  const indicatorsOption = {
    ...base,
    series: data.indicators.slice(0, 4).map((indicator, idx) => ({
      type: "gauge",
      center: gaugeCenters[idx] ?? ["50%", "50%"],
      radius: "38%",
      min: 0,
      max: indicator.max,
      startAngle: 210,
      endAngle: -30,
      progress: { show: true, width: 11, itemStyle: { color: indicatorColors[idx % 4] } },
      axisLine: { lineStyle: { width: 11, color: [[1, colors.line]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      anchor: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        fontWeight: 700,
        color: colors.ink,
        offsetCenter: [0, "0%"],
        formatter: () => `${indicator.value}`,
      },
      title: {
        show: true,
        offsetCenter: [0, "75%"],
        fontSize: 10,
        fontWeight: 500,
        color: colors.muted,
      },
      data: [{ value: indicator.value, name: indicator.label }],
    })),
  };

  // ---------- 4. Fluxo menstrual: donut ----------
  const flowTotal = data.flowLevels.reduce((sum, f) => sum + f.value, 0);

  const flowOption = {
    ...base,
    tooltip: {
      ...base.tooltip,
      trigger: "item",
      formatter: (p: any) => `${p.name}: ${p.value} dias (${p.percent}%)`,
    },
    legend: {
      bottom: 0,
      left: "center",
      textStyle: { color: colors.muted, fontSize: 10 },
      icon: "circle",
    },
    series: [
      {
        type: "pie",
        radius: ["48%", "72%"],
        center: ["50%", "42%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#fff", borderWidth: 3 },
        label: { show: false },
        data: data.flowLevels.map((f) => ({
          value: f.value,
          name: f.label,
          itemStyle: { color: flowColorByLabel[f.label] ?? colors.wine },
        })),
      },
    ],
    graphic: {
      type: "text",
      left: "center",
      top: "38%",
      style: {
        text: `${flowTotal}\ndias`,
        textAlign: "center",
        fill: colors.ink,
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 20,
      },
    },
  };

  // ---------- 5. Intensidade dos registros ----------
  const maxIntensity = Math.max(1, ...data.calendarData.map(([, value]) => value));

  const calendarOption = {
    ...base,
    tooltip: {
      ...base.tooltip,
      formatter: (params: { value: (string | number)[] }) => {
        const date = params.value[0];
        const value = params.value[1] ?? 0;
        return `${date}: ${value} registro(s) de sintoma`;
      },
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

  return (
    <div className={styles.echartsGrid}>
      {charts.map(([title, period, option, size], index) => (
        <article className={`${styles.echartCard} ${styles[size]}`} key={title}>
          <header>
            <div>
              <span className={styles.cardIndex}>0{index + 1}</span>
              <h2>{title}</h2>
            </div>
            <span>{period}</span>
          </header>
          <ReactECharts
            option={option}
            style={{ height: size === "compact" ? 270 : 285, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </article>
      ))}
    </div>
  );
}