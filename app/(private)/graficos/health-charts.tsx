"use client";

import styles from "./charts.module.css";


import ReactECharts from "echarts-for-react";

const colors = { wine: "#8f1d2c", petrol: "#2b4c4a", gold: "#c9973f", coral: "#f6a27f", ink: "#3a3a3a", muted: "#817b77", line: "rgba(58,58,58,.12)", mineral: "#f6efe9" };
const base = { animationDuration: 700, textStyle: { fontFamily: "DM Sans, sans-serif", color: colors.ink }, tooltip: { backgroundColor: colors.ink, borderWidth: 0, textStyle: { color: "#fff" } } };

export function HealthCharts() {
  const moodOption = { ...base, grid: { left: 38, right: 20, top: 28, bottom: 30 }, xAxis: { type: "category", data: ["16", "17", "18", "19", "20", "21", "22"], axisLine: { lineStyle: { color: colors.line } }, axisTick: { show: false } }, yAxis: { type: "value", max: 5, splitLine: { lineStyle: { color: colors.line } }, axisLabel: { show: false } }, series: [{ type: "line", smooth: true, data: [3, 4, 2, 2, 3, 4, 3], symbolSize: 8, lineStyle: { width: 3, color: colors.wine }, itemStyle: { color: colors.gold }, areaStyle: { color: "rgba(143,29,44,.10)" } }] };
  const symptomOption = { ...base, grid: { left: 100, right: 22, top: 18, bottom: 20 }, xAxis: { type: "value", max: 7, splitLine: { show: false }, axisLabel: { show: false } }, yAxis: { type: "category", data: ["Inchaço", "Cólicas", "Cansaço", "Dor de cabeça"], axisLine: { show: false }, axisTick: { show: false } }, series: [{ type: "bar", data: [2, 4, 6, 3], barWidth: 14, itemStyle: { borderRadius: [0, 8, 8, 0], color: colors.coral }, label: { show: true, position: "right", formatter: "{c} dias", color: colors.muted, fontSize: 11 } }] };
  const moodShareOption = { ...base, series: [{ type: "pie", radius: ["55%", "78%"], avoidLabelOverlap: true, itemStyle: { borderColor: "#fff", borderWidth: 3 }, label: { show: false }, data: [{ value: 3, name: "Normal", itemStyle: { color: colors.petrol } }, { value: 2, name: "Feliz", itemStyle: { color: colors.gold } }, { value: 1, name: "Cansada", itemStyle: { color: colors.coral } }, { value: 1, name: "Ansiosa", itemStyle: { color: colors.wine } }] }], tooltip: { ...base.tooltip, trigger: "item" }, graphic: { type: "text", left: "center", top: "center", style: { text: "7\ndias", textAlign: "center", fill: colors.ink, fontSize: 16, fontWeight: 700, lineHeight: 22 } } };
  const wellbeingOption = { ...base, radar: { indicator: [{ name: "Energia", max: 5 }, { name: "Sono", max: 5 }, { name: "Humor", max: 5 }, { name: "Dor", max: 5 }, { name: "Fluxo", max: 5 }], splitNumber: 4, axisName: { color: colors.muted, fontSize: 10 }, splitLine: { lineStyle: { color: [colors.line] } }, splitArea: { areaStyle: { color: ["rgba(246,239,233,.35)", "rgba(255,255,255,.7)"] } }, axisLine: { lineStyle: { color: colors.line } } }, series: [{ type: "radar", data: [{ value: [4, 3, 4, 2, 3], name: "Este período", lineStyle: { color: colors.wine, width: 2 }, itemStyle: { color: colors.wine }, areaStyle: { color: "rgba(143,29,44,.18)" } }] }] };
  const calendarOption = { ...base, tooltip: { ...base.tooltip, formatter: (params: { value: number[] }) => `${params.value[1]}: ${params.value[2]} registro(s)` }, visualMap: { min: 0, max: 4, calculable: false, orient: "horizontal", left: "center", bottom: 0, inRange: { color: ["#f6efe9", "#e8c5c6", "#c87583", colors.wine] }, textStyle: { color: colors.muted, fontSize: 10 } }, calendar: { top: 18, left: 34, right: 18, cellSize: ["auto", 28], range: "2024-06", splitLine: { lineStyle: { color: colors.line } }, itemStyle: { borderWidth: 1, borderColor: "#fff" }, yearLabel: { show: false }, monthLabel: { show: false }, dayLabel: { firstDay: 1, color: colors.muted, nameMap: "en" } }, series: [{ type: "heatmap", coordinateSystem: "calendar", calendarIndex: 0, data: [["2024-06-03", 2], ["2024-06-04", 4], ["2024-06-05", 3], ["2024-06-10", 1], ["2024-06-11", 3], ["2024-06-18", 2], ["2024-06-21", 4], ["2024-06-22", 2]] }] };

  const charts = [
    ["Humor ao longo da semana", "Últimos 7 dias", moodOption, "wide"],
    ["Sintomas registrados", "Junho de 2024", symptomOption, "wide"],
    ["Distribuição do humor", "Período atual", moodShareOption, "compact"],
    ["Panorama de bem-estar", "Média das anotações", wellbeingOption, "compact"],
    ["Intensidade dos registros", "Junho de 2024", calendarOption, "wide"],
  ] as const;

  return <div className={styles.echartsGrid} >{charts.map(([title, period, option, size], index) => <article className={`${styles.echartCard} ${styles[size]}`} key={title}><header><div><span className="card-index">0{index + 1}</span><h2>{title}</h2></div><span>{period}</span></header><ReactECharts option={option} style={{ height: size === "compact" ? 270 : 285, width: "100%" }} opts={{ renderer: "svg" }} /></article>)}</div>;
}
