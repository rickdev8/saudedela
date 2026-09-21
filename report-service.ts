import PDFDocument from "pdfkit"

import { db } from "../prisma/db"

const flowLabels: Record<string, string> = {
  none: "Sem fluxo",
  light: "Leve",
  medium: "Moderado",
  heavy: "Intenso",
}

const painLabels: Record<string, string> = {
  none: "Nenhuma",
  light: "Leve",
  moderate: "Moderada",
  strong: "Forte",
  very_strong: "Muito forte",
}

const energyLabels: Record<string, string> = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
}

const sleepLabels: Record<string, string> = {
  bad: "Ruim",
  regular: "Regular",
  good: "Bom",
}

/* =========================================================
   PALETA PROFISSIONAL E CLÍNICA
========================================================= */

const PRIMARY = "#8f1d2c"
const PRIMARY_LIGHT = "#fdf5f6"
const SECONDARY = "#2b4c4a"
const SECONDARY_LIGHT = "#f0f5f4"
const TEXT_DARK = "#1a202c"
const TEXT_MUTED = "#718096"
const BORDER = "#e2e8f0"
const ROW_BG = "#f8fafc"
const WHITE = "#ffffff"

/* =========================================================
   CONFIGURAÇÕES DE LAYOUT
========================================================= */

const PAGE_MARGIN = 40
const FOOTER_HEIGHT = 40

function toJSDate(value: unknown): Date {
  if (value instanceof Date) {
    return value
  }

  if (
    value &&
    typeof value === "object" &&
    "epochMilliseconds" in value
  ) {
    return new Date(
      Number((value as { epochMilliseconds: number }).epochMilliseconds)
    )
  }

  const date = new Date(String(value))

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida recebida no relatório: ${String(value)}`)
  }

  return date
}

function formatDate(value: unknown) {
  return toJSDate(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

function formatDateTime(value: unknown) {
  const date = toJSDate(value)

  return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`
}

function collectAssessmentTags(a: any): string[] {
  return [
    ...(a.physicalSymptoms ?? []),
    ...(a.digestionSymptoms ?? []),
    ...(a.urinarySymptoms ?? []),
    ...(a.gynecologicalSymptoms ?? []),
    ...(a.moodChanges ?? []),
    ...(a.skinHairChanges ?? []),
  ]
}

/* =========================================================
   GERAÇÃO DO PDF
========================================================= */

export async function generateReportPdf(userId: string): Promise<Buffer> {
  const user = await db.orm.public.User.select("id", "name", "email").where({ id: userId }).first()

  const cycle = await db.orm.public.CyclePattern.where({ userId }).first()

  const entries = await db.orm.public.SymptomEntry
    .where({ userId })
    .orderBy((m) => m.date.desc())
    .limit(60)
    .all()

  const assessments = await db.orm.public.HealthAssessment
    .where({ userId })
    .orderBy((m) => m.createdAt.desc())
    .limit(20)
    .all()

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE_MARGIN,
      bufferPages: true,
      info: {
        Title: `Relatório Clínico - ${user?.name || "Paciente"}`,
        Author: "SaúdeDela",
      },
    })

    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    const pageWidth = doc.page.width - PAGE_MARGIN * 2
    const contentBottom =
      doc.page.height - PAGE_MARGIN - FOOTER_HEIGHT

    /* =====================================================
       HELPERS DE DESENHO
    ===================================================== */

    function drawRoundedBox(
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
      stroke?: string
    ) {
      doc.roundedRect(x, y, width, height, 6).fill(fill)

      if (stroke) {
        doc
          .roundedRect(x, y, width, height, 6)
          .lineWidth(0.5)
          .strokeColor(stroke)
          .stroke()
      }
    }

    function drawLine(y: number) {
      doc
        .strokeColor(BORDER)
        .lineWidth(1)
        .moveTo(PAGE_MARGIN, y)
        .lineTo(PAGE_MARGIN + pageWidth, y)
        .stroke()
    }

    function drawSectionTitle(
      title: string,
      subtitle?: string
    ) {
      doc.x = PAGE_MARGIN

      doc
        .fillColor(SECONDARY)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(title, PAGE_MARGIN, doc.y)

      if (subtitle) {
        doc
          .moveDown(0.2)
          .fillColor(TEXT_MUTED)
          .font("Helvetica")
          .fontSize(8)
          .text(subtitle, PAGE_MARGIN, doc.y)
      }

      doc.moveDown(0.8)
    }

    function drawHeader() {
      const y = PAGE_MARGIN

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Saúde", PAGE_MARGIN, y, { continued: true })

      doc.fillColor(SECONDARY).text("Dela")

      doc
        .fillColor(TEXT_DARK)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(
          "RELATÓRIO CLÍNICO DE ACOMPANHAMENTO",
          PAGE_MARGIN,
          y + 2,
          {
            width: pageWidth,
            align: "right",
          }
        )

      doc
        .fillColor(TEXT_MUTED)
        .font("Helvetica")
        .fontSize(8)
        .text(
          `Gerado em ${formatDateTime(new Date())}`,
          PAGE_MARGIN,
          y + 14,
          {
            width: pageWidth,
            align: "right",
          }
        )

      drawLine(y + 32)

      doc.y = y + 50
    }

    function drawPageFooter(
      pageNumber: number,
      totalPages: number
    ) {
      const y = doc.page.height - PAGE_MARGIN - 10

      drawLine(y - 10)

      doc
        .fillColor(TEXT_MUTED)
        .font("Helvetica")
        .fontSize(7)
        .text(
          "As informações baseiam-se em auto-relato via app SaúdeDela e não substituem avaliação médica.",
          PAGE_MARGIN,
          y
        )

      doc.text(
        `Página ${pageNumber} de ${totalPages}`,
        PAGE_MARGIN,
        y,
        {
          width: pageWidth,
          align: "right",
        }
      )
    }

    function addNewPage() {
      doc.addPage()
      drawHeader()
    }

    /* =====================================================
       INÍCIO DO DOCUMENTO
    ===================================================== */

    drawHeader()

    /* =====================================================
       DADOS DA PACIENTE E CICLO
    ===================================================== */

    const boxWidth = (pageWidth - 15) / 2
    const topSectionY = doc.y

    drawRoundedBox(
      PAGE_MARGIN,
      topSectionY,
      boxWidth,
      60,
      WHITE,
      BORDER
    )

    doc
      .fillColor(SECONDARY)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        "Identificação da Paciente",
        PAGE_MARGIN + 12,
        topSectionY + 12
      )

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "NOME",
        PAGE_MARGIN + 12,
        topSectionY + 30
      )

    doc
      .fillColor(TEXT_DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        user?.name || "Não informado",
        PAGE_MARGIN + 12,
        topSectionY + 40
      )

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "E-MAIL",
        PAGE_MARGIN + boxWidth / 2 + 10,
        topSectionY + 30
      )

    doc
      .fillColor(TEXT_DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        user?.email || "Não informado",
        PAGE_MARGIN + boxWidth / 2 + 10,
        topSectionY + 40
      )

    const box2X = PAGE_MARGIN + boxWidth + 15

    drawRoundedBox(
      box2X,
      topSectionY,
      boxWidth,
      60,
      SECONDARY_LIGHT,
      BORDER
    )

    doc
      .fillColor(SECONDARY)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        "Padrão de Ciclo Relatado",
        box2X + 12,
        topSectionY + 12
      )

    const cycleX = box2X + 12

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "DURAÇÃO",
        cycleX,
        topSectionY + 30
      )

    doc
      .fillColor(TEXT_DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        cycle ? `${cycle.durationDays} dias` : "N/I",
        cycleX,
        topSectionY + 40
      )

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "REGULARIDADE",
        cycleX + 65,
        topSectionY + 30
      )

    doc
      .fillColor(TEXT_DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        cycle?.regularity || "N/I",
        cycleX + 65,
        topSectionY + 40
      )

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "DIAS TÍPICOS",
        cycleX + 155,
        topSectionY + 30
      )

    doc
      .fillColor(TEXT_DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        cycle?.daysSelected?.length
          ? `${cycle.daysSelected.length} dias`
          : "N/I",
        cycleX + 155,
        topSectionY + 40
      )

    doc.y = topSectionY + 85

    /* =====================================================
       RESUMO CLÍNICO
    ===================================================== */

    const painCounts: Record<string, number> = {}
    const symptomCounts: Record<string, number> = {}

    entries.forEach((entry: any) => {
      if (entry.painIntensity) {
        painCounts[entry.painIntensity] =
          (painCounts[entry.painIntensity] || 0) + 1
      }

      for (const symptom of entry.symptoms || []) {
        symptomCounts[symptom] =
          (symptomCounts[symptom] || 0) + 1
      }
    })

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const strongPainCount =
      (painCounts["strong"] || 0) +
      (painCounts["very_strong"] || 0)

    drawSectionTitle(
      "Visão Geral do Período",
      "Síntese rápida para auxílio diagnóstico."
    )

    const statWidth = (pageWidth - 20) / 3
    const statY = doc.y

    const stats = [
      {
        label: "Total de Registros",
        value: `${entries.length}`,
        color: SECONDARY,
        bg: SECONDARY_LIGHT,
      },
      {
        label: "Episódios de Dor Forte",
        value: `${strongPainCount}`,
        color: PRIMARY,
        bg: PRIMARY_LIGHT,
      },
      {
        label: "Sintoma Predominante",
        value: topSymptoms[0]
          ? topSymptoms[0][0]
          : "Nenhum",
        color: TEXT_DARK,
        bg: ROW_BG,
      },
    ]

    stats.forEach((stat, i) => {
      const x =
        PAGE_MARGIN + i * (statWidth + 10)

      drawRoundedBox(
        x,
        statY,
        statWidth,
        54,
        stat.bg
      )

      doc
        .fillColor(stat.color)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(
          stat.value,
          x + 12,
          statY + 12
        )

      doc
        .fillColor(TEXT_MUTED)
        .font("Helvetica")
        .fontSize(7.5)
        .text(
          stat.label.toUpperCase(),
          x + 12,
          statY + 34
        )
    })

    doc.y = statY + 75

    /* =====================================================
       TABELA DE HISTÓRICO DE CICLO/SINTOMAS
    ===================================================== */

    drawSectionTitle(
      "Histórico Detalhado (Ciclo e Sintomas)",
      "Registros mais recentes ordenados por data. Destaque para dor intensa."
    )

    const columns = [
      { label: "DATA", width: 60 },
      { label: "FLUXO", width: 60 },
      { label: "DOR", width: 70 },
      { label: "HUMOR", width: 60 },
      { label: "SONO / ENERGIA", width: 85 },
      {
        label: "SINTOMAS RELATADOS",
        width: pageWidth - 335,
      },
    ]

    function drawTableHeader(
      cols: { label: string; width: number }[],
      bg = SECONDARY
    ) {
      const y = doc.y
      const headerHeight = 22

      doc
        .rect(
          PAGE_MARGIN,
          y,
          pageWidth,
          headerHeight
        )
        .fill(bg)

      let x = PAGE_MARGIN

      cols.forEach((col) => {
        doc
          .fillColor(WHITE)
          .font("Helvetica-Bold")
          .fontSize(7)
          .text(
            col.label,
            x + 8,
            y + 7,
            {
              width: col.width - 16,
            }
          )

        x += col.width
      })

      doc.y = y + headerHeight
    }

    function calculateRowHeight(
      text: string,
      colWidth: number
    ) {
      doc.font("Helvetica").fontSize(7.5)

      const textHeight =
        doc.heightOfString(text, {
          width: colWidth - 16,
        })

      return Math.max(
        26,
        textHeight + 12
      )
    }

    drawTableHeader(columns)

    entries.forEach(
      (entry: any, index: number) => {
        const symptomsStr =
          entry.symptoms?.length
            ? entry.symptoms.join(", ")
            : "—"

        const rowHeight =
          calculateRowHeight(
            symptomsStr,
            columns[5].width
          )

        if (
          doc.y + rowHeight >
          contentBottom
        ) {
          addNewPage()
          drawTableHeader(columns)
        }

        const rowY = doc.y

        if (index % 2 === 0) {
          doc
            .rect(
              PAGE_MARGIN,
              rowY,
              pageWidth,
              rowHeight
            )
            .fill(ROW_BG)
        }

        doc
          .strokeColor(BORDER)
          .lineWidth(0.5)
          .moveTo(
            PAGE_MARGIN,
            rowY + rowHeight
          )
          .lineTo(
            PAGE_MARGIN + pageWidth,
            rowY + rowHeight
          )
          .stroke()

        const isPainAlert =
          entry.painIntensity === "strong" ||
          entry.painIntensity === "very_strong"

        const values = [
          formatDate(entry.date),
          entry.flow
            ? flowLabels[entry.flow]
            : "—",
          entry.painIntensity
            ? painLabels[entry.painIntensity]
            : "—",
          entry.mood || "—",
          `${entry.sleep ? sleepLabels[entry.sleep] : "—"} / ${
            entry.energy
              ? energyLabels[entry.energy]
              : "—"
          }`,
          symptomsStr,
        ]

        let x = PAGE_MARGIN

        values.forEach((value, i) => {
          const textY = rowY + 9

          if (i === 2 && isPainAlert) {
            doc
              .fillColor(PRIMARY)
              .font("Helvetica-Bold")

            doc
              .circle(
                x + 8,
                textY + 3.5,
                2.5
              )
              .fill(PRIMARY)

            doc.text(
              String(value),
              x + 16,
              textY,
              {
                width:
                  columns[i].width - 24,
              }
            )
          } else {
            doc
              .fillColor(TEXT_DARK)
              .font("Helvetica")

            doc.text(
              String(value),
              x + 8,
              textY,
              {
                width:
                  columns[i].width - 16,
                lineGap: 2,
              }
            )
          }

          x += columns[i].width
        })

        doc.y = rowY + rowHeight
      }
    )

    /* =====================================================
       TABELA DE AVALIAÇÕES GERAIS DE SAÚDE (NOVO)
    ===================================================== */

    if (assessments.length > 0) {
      if (doc.y + 60 > contentBottom) {
        addNewPage()
      } else {
        doc.moveDown(1.5)
      }

      drawSectionTitle(
        "Avaliações Gerais de Saúde",
        "Registros amplos além do ciclo: sintomas digestivos, urinários, ginecológicos, humor, pele e cabelo."
      )

      const assessColumns = [
        { label: "DATA", width: 55 },
        { label: "DOR", width: 65 },
        { label: "ENERGIA", width: 55 },
        { label: "SONO", width: 50 },
        {
          label: "SINTOMAS RELATADOS",
          width:
            pageWidth -
            55 -
            65 -
            55 -
            50 -
            90,
        },
        {
          label: "MEDICAMENTOS",
          width: 90,
        },
      ]

      drawTableHeader(
        assessColumns,
        PRIMARY
      )

      assessments.forEach(
        (
          assessment: any,
          index: number
        ) => {
          const tags =
            collectAssessmentTags(
              assessment
            )

          const symptomsStr =
            tags.length
              ? tags.join(", ")
              : "—"

          const medsStr =
            assessment.medications || "—"

          doc
            .font("Helvetica")
            .fontSize(7.5)

          const symptomsHeight =
            doc.heightOfString(
              symptomsStr,
              {
                width:
                  assessColumns[4].width -
                  16,
              }
            )

          const medsHeight =
            doc.heightOfString(
              medsStr,
              {
                width:
                  assessColumns[5].width -
                  16,
              }
            )

          const rowHeight = Math.max(
            26,
            symptomsHeight + 12,
            medsHeight + 12
          )

          if (
            doc.y + rowHeight >
            contentBottom
          ) {
            addNewPage()

            drawTableHeader(
              assessColumns,
              PRIMARY
            )
          }

          const rowY = doc.y

          if (index % 2 === 0) {
            doc
              .rect(
                PAGE_MARGIN,
                rowY,
                pageWidth,
                rowHeight
              )
              .fill(ROW_BG)
          }

          doc
            .strokeColor(BORDER)
            .lineWidth(0.5)
            .moveTo(
              PAGE_MARGIN,
              rowY + rowHeight
            )
            .lineTo(
              PAGE_MARGIN + pageWidth,
              rowY + rowHeight
            )
            .stroke()

          const isPainAlert =
            assessment.painLevel ===
              "strong" ||
            assessment.painLevel ===
              "very_strong"

          const values = [
            formatDate(
              assessment.createdAt
            ),
            assessment.painLevel
              ? painLabels[
                  assessment.painLevel
                ]
              : "—",
            assessment.energyLevel
              ? energyLabels[
                  assessment.energyLevel
                ]
              : "—",
            assessment.sleepQuality
              ? sleepLabels[
                  assessment.sleepQuality
                ]
              : "—",
            symptomsStr,
            medsStr,
          ]

          let x = PAGE_MARGIN

          values.forEach((value, i) => {
            const textY = rowY + 9

            if (
              i === 1 &&
              isPainAlert
            ) {
              doc
                .fillColor(PRIMARY)
                .font("Helvetica-Bold")

              doc
                .circle(
                  x + 8,
                  textY + 3.5,
                  2.5
                )
                .fill(PRIMARY)

              doc.text(
                String(value),
                x + 16,
                textY,
                {
                  width:
                    assessColumns[i]
                      .width - 24,
                }
              )
            } else {
              doc
                .fillColor(TEXT_DARK)
                .font("Helvetica")

              doc.text(
                String(value),
                x + 8,
                textY,
                {
                  width:
                    assessColumns[i]
                      .width - 16,
                  lineGap: 2,
                }
              )
            }

            x +=
              assessColumns[i].width
          })

          doc.y =
            rowY + rowHeight
        }
      )

      // Observações e alterações recentes relatadas (texto livre), se houver
      const recentNotes = assessments
        .filter(
          (a: any) =>
            a.recentBodyChanges ||
            a.otherNotes
        )
        .slice(0, 5)

      if (recentNotes.length > 0) {
        doc.moveDown(1)

        if (doc.y + 40 > contentBottom) {
          addNewPage()
        }

        doc
          .fillColor(SECONDARY)
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(
            "Observações registradas pela paciente",
            PAGE_MARGIN,
            doc.y
          )

        doc.moveDown(0.4)

        recentNotes.forEach(
          (a: any) => {
            const text = [
              a.recentBodyChanges,
              a.otherNotes,
            ]
              .filter(Boolean)
              .join(" — ")

            if (!text) return

            doc
              .font("Helvetica")
              .fontSize(7.5)

            const textHeight =
              doc.heightOfString(text, {
                width:
                  pageWidth - 70,
              })

            const boxHeight =
              textHeight + 16

            if (
              doc.y + boxHeight >
              contentBottom
            ) {
              addNewPage()
            }

            const noteY = doc.y

            drawRoundedBox(
              PAGE_MARGIN,
              noteY,
              pageWidth,
              boxHeight,
              WHITE,
              BORDER
            )

            doc
              .fillColor(TEXT_MUTED)
              .font("Helvetica-Bold")
              .fontSize(7)
              .text(
                formatDate(
                  a.createdAt
                ),
                PAGE_MARGIN + 10,
                noteY + 6
              )

            doc
              .fillColor(TEXT_DARK)
              .font("Helvetica")
              .fontSize(7.5)
              .text(
                text,
                PAGE_MARGIN + 10,
                noteY + 6,
                {
                  width:
                    pageWidth - 20,
                  indent: 55,
                }
              )

            doc.y =
              noteY + boxHeight + 6
          }
        )
      }
    }

    /* =====================================================
       ORIGEM DOS DADOS E BASE CIENTÍFICA
    ===================================================== */

    if (
      doc.y + 130 >
      contentBottom
    ) {
      addNewPage()
    } else {
      doc.moveDown(1.5)
    }

    drawSectionTitle(
      "Origem dos Dados e Base Científica",
      "Informações sobre a coleta e embasamento clínico deste relatório."
    )

    const sourceText =
      "Os dados deste relatório foram registrados de forma independente pela paciente através do aplicativo SaúdeDela, uma ferramenta digital para monitoramento do ciclo menstrual e saúde feminina. A estrutura de acompanhamento e os critérios do app foram desenvolvidos com base em diretrizes científicas consolidadas, apoiando-se em protocolos da FEBRASGO (Federação Brasileira das Associações de Ginecologia e Obstetrícia), da Organização Mundial da Saúde (OMS) e do Ministério da Saúde do Brasil."

    doc
      .font("Helvetica")
      .fontSize(7.5)

    const textOptions = {
      width: pageWidth - 24,
      lineGap: 2,
      align: "justify" as const,
    }

    const textHeight =
      doc.heightOfString(
        sourceText,
        textOptions
      )

    const boxHeight =
      26 + textHeight + 14

    const sourceY = doc.y

    drawRoundedBox(
      PAGE_MARGIN,
      sourceY,
      pageWidth,
      boxHeight,
      SECONDARY_LIGHT,
      BORDER
    )

    doc
      .fillColor(SECONDARY)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        "Sobre o Aplicativo SaúdeDela",
        PAGE_MARGIN + 12,
        sourceY + 12
      )

    doc
      .fillColor(TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7.5)
      .text(
        sourceText,
        PAGE_MARGIN + 12,
        sourceY + 26,
        textOptions
      )

    doc.y = sourceY + boxHeight

    /* =====================================================
       FINALIZAÇÃO COM PAGINAÇÃO
    ===================================================== */

    const range =
      doc.bufferedPageRange()

    for (
      let i = range.start;
      i < range.start + range.count;
      i++
    ) {
      doc.switchToPage(i)

      drawPageFooter(
        i - range.start + 1,
        range.count
      )
    }

    doc.end()
  })
}


