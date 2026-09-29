# Guia de classes HTML — SaúdeDela

Documento de referência para reconstruir o site usando o `app/globals.css` e as páginas atuais. Todas as classes abaixo aparecem em `className` nos componentes React/Next.js.

## Convenções

- As classes são globais, não CSS Modules.
- Os arquivos usam Next.js App Router.
- `section-wrap` centraliza o conteúdo das seções.
- `tracking-page` é a estrutura principal das páginas autenticadas.
- `tracking-sidebar` é o menu lateral; `tracking-main` é a área de conteúdo.
- Classes condicionais aparecem com combinações, por exemplo `sidebar-link active`, `table-row table-head` e `echart-card compact`.

---

## 1. Layout global

### Arquivos
- `app/layout.tsx`
- `app/(private)/layout.tsx`
- `app/(private)/sidebar/app-sidebar.tsx`

| Classe | Onde aparece | Função |
|---|---|---|
| `bg-background` | `html` | Classe utilitária de fundo global. |
| `antialiased` | `body` | Suaviza a renderização da fonte. |
| `tracking-page` | `main` das páginas privadas | Container geral da aplicação autenticada. |
| `tracking-main` | Conteúdo privado | Coluna principal ao lado do menu. |
| `tracking-header` | Cabeçalho privado | Barra superior das páginas internas. |
| `mobile-page-title` | Cabeçalho privado | Título exibido especialmente em telas menores. |
| `tracking-sidebar` | `app-sidebar.tsx` | Menu lateral fixo da aplicação. |
| `brand` | Logo na sidebar e na home | Identidade textual/visual do SaúdeDela. |
| `sidebar-brand` | Link da sidebar | Ajusta a marca dentro do menu. |
| `sidebar-user` | Perfil no menu | Bloco com avatar e nome da usuária. |
| `avatar` | Perfil no menu | Círculo com a inicial da usuária. |
| `sidebar-nav` | Navegação lateral | Agrupa os links da aplicação. |
| `sidebar-label` | Sidebar | Rótulo de agrupamento dos links. |
| `sidebar-link` | Links da sidebar | Link individual do menu. |
| `active` | Com `sidebar-link` | Indica a página atualmente selecionada. |
| `sidebar-bottom` | Rodapé da sidebar | Agrupa ações inferiores, como sair. |
| `login-link` | Ação de sair/login | Link ou botão textual de acesso/autenticação. |
| `section-wrap` | Seções públicas e privadas | Limita largura e centraliza conteúdo. |

### Links da sidebar

Atualmente definidos em `app/(private)/sidebar/app-sidebar.tsx`:

- `/acompanhe-se`: `Hoje`
- `/historico`: `Histórico`
- `/graficos`: `Gráficos`
- `/ciclo`: `Meu ciclo`
- `/avaliacao`: `Avaliação`
- `/dados`: `Dados públicos`
- `/assistente`: `Assistente`

---

## 2. Home pública — `/`

### Arquivo
`app/page.tsx`

### Cabeçalho e hero

| Classe | Função |
|---|---|
| `site-header` | Cabeçalho público com marca, navegação e entrada. |
| `hero` | Primeira seção de apresentação. |
| `hero-copy` | Coluna textual do hero. |
| `hero-description` | Texto explicativo do hero. |
| `hero-actions` | Grupo de chamadas principais. |
| `button-primary` | Botão principal da identidade visual. |
| `text-link` | Link textual secundário. |
| `trust-row` | Linha de confiança abaixo das ações. |
| `trust-line` | Linha decorativa da área de confiança. |
| `pulse-mark` | Marca/ícone circular do SaúdeDela. |

### Card de evidência e gráfico informativo

| Classe | Função |
|---|---|
| `evidence-card` | Card principal com uma evidência de saúde. |
| `evidence-top` | Linha superior do card. |
| `live-dot` | Indicador visual de dado ativo/atualizado. |
| `evidence-question` | Pergunta ou título da evidência. |
| `evidence-chart` | Área do gráfico visual do card. |
| `mini-line` | Linha gráfica decorativa. |
| `chart-labels` | Rótulos do gráfico. |
| `evidence-foot` | Rodapé com valor e fonte. |
| `source-tag` | Tag da fonte, como DATASUS/SISAB. |
| `data-board` | Quadro que agrupa indicadores da home. |
| `data-section` | Seção pública de dados. |
| `section-heading` | Cabeçalho de seção. |
| `section-intro` | Texto introdutório de seção. |
| `stat-column` | Coluna de estatísticas. |
| `stat` | Item individual de estatística. |
| `bar-chart` | Gráfico de barras da home. |
| `chart-title` | Título do gráfico. |
| `chart-legend` | Legenda do gráfico. |
| `bars` | Agrupamento das barras. |
| `bar-wrap` | Coluna/label de cada barra. |
| `bar` | Barra individual. |
| `chart-caption` | Legenda explicativa inferior. |

### Assistente na home

| Classe | Função |
|---|---|
| `assistant-section` | Seção de apresentação do assistente. |
| `assistant-copy` | Coluna textual do assistente. |
| `kicker` | Pequeno rótulo editorial. |
| `light` | Variação clara do kicker. |
| `light-link` | Link claro em fundo escuro. |
| `chat-window` | Janela ilustrativa de conversa. |
| `chat-header` | Cabeçalho da conversa. |
| `chat-messages` | Lista de mensagens. |
| `user-message` | Mensagem da usuária. |
| `bot-message` | Mensagem do assistente. |
| `bot-avatar` | Avatar do assistente. |
| `source-chips` | Tags com fontes da resposta. |
| `chat-input` | Campo visual de entrada da conversa. |

### Seção de acompanhamento e rodapé

| Classe | Função |
|---|---|
| `track-section` | Seção de chamada para registro diário. |
| `track-intro` | Coluna de texto do acompanhamento. |
| `calendar-card` | Card de calendário ilustrativo. |
| `calendar-top` | Cabeçalho do calendário. |
| `weekdays` | Linha dos dias da semana. |
| `calendar-grid` | Grade de dias. |
| `today` | Dia atual destacado. |
| `period` | Dias marcados como período. |
| `symptom-row` | Legenda de sintomas. |
| `yellow-dot` | Indicador amarelo da legenda. |
| `site-footer` | Rodapé público. |
| `footer-brand` | Marca e descrição no rodapé. |
| `footer-links` | Grupos de links. |
| `footer-bottom` | Linha final do rodapé. |

---

## 3. Autenticação — `/entrar` e `/criar-conta`

### Arquivos
- `app/entrar/page.tsx`
- `app/criar-conta/page.tsx`

| Classe | Função |
|---|---|
| `auth-brand` | Marca no topo das telas de autenticação. |
| `auth-page` | Fundo e estrutura geral da autenticação. |
| `auth-shell` | Layout de duas colunas. |
| `auth-form-column` | Coluna do formulário. |
| `auth-heading` | Título e contexto da tela. |
| `auth-context` | Texto editorial auxiliar. |
| `auth-form` | Formulário de entrada/cadastro. |
| `password-field` | Campo de senha com ações auxiliares. |
| `auth-row` | Linha de opções do login. |
| `privacy-note` | Aviso de privacidade do cadastro. |
| `auth-submit` | Botão de envio do formulário. |
| `auth-switch` | Link para alternar login/cadastro. |
| `auth-panel` | Painel lateral de confiança. |
| `auth-panel-mark` | Marca/ícone do painel. |
| `auth-panel-note` | Texto complementar do painel. |

---

## 4. Registro diário — `/acompanhe-se`

### Arquivo
`app/(private)/acompanhe-se/page.tsx`

| Classe | Função |
|---|---|
| `tracking-hero` | Hero da tela de registro diário. |
| `tracking-context` | Contexto editorial da página. |
| `tracking-lead` | Texto de introdução. |
| `daily-checkin-card` | Card principal do formulário diário. |
| `card-heading` | Cabeçalho do card. |
| `date-label` | Data do registro. |
| `field-group` | Grupo de um campo do formulário. |
| `field-label-row` | Linha com label e informação auxiliar. |
| `mood-row` | Opções de humor. |
| `mood` | Opção individual de humor. |
| `selected` | Estado selecionado de humor/sintoma/opção. |
| `symptom-row` | Grupo de sintomas. |
| `symptom` | Chip individual de sintoma. |
| `choices` | Variação de grupo de opções. |
| `choice-row` | Grupo de opções de resposta. |
| `choice` | Opção individual de dor/sono/outro dado. |
| `notes-field` | Campo de observações. |
| `custom-symptom-field` | Campo para sintoma personalizado. |
| `more-symptoms` | Ação para exibir mais sintomas. |
| `cancel-custom-symptom` | Cancelamento do sintoma personalizado. |
| `save-row` | Linha do botão salvar. |
| `save-button` | Botão de salvar registro. |
| `save-feedback` | Mensagem de sucesso. |
| `save-error` | Mensagem de erro. |
| `insight-card` | Card de insight gerado pelos registros. |
| `insight-top` | Cabeçalho do insight. |
| `insight-disclaimer` | Aviso de que o insight não é diagnóstico. |
| `thinking-dots` | Indicador de processamento do assistente. |

---

## 5. Histórico — `/historico`

### Arquivo
`app/(private)/historico/page.tsx`

| Classe | Função |
|---|---|
| `history-heading-row` | Cabeçalho com título e insight. |
| `history-heading-copy` | Coluna textual do cabeçalho. |
| `history-insight` | Insight contextual do histórico. |
| `history-toolbar` | Barra de período e download. |
| `period-button` | Botão de filtro/período. |
| `download-button` | Botão de exportação. |
| `history-table` | Container da tabela. |
| `full-table` | Variação de tabela em largura total. |
| `table-row` | Linha de registro. |
| `table-head` | Linha de cabeçalho. |
| `table-row-detail` | Área expandida de detalhes. |

---

## 6. Gráficos — `/graficos`

### Arquivos
- `app/(private)/graficos/page.tsx`
- `app/(private)/graficos/health-charts.tsx`

| Classe | Função |
|---|---|
| `content-page` | Container textual da página de gráficos. |
| `echarts-grid` | Grid geral dos gráficos. |
| `echart-card` | Card individual de gráfico. |
| `compact` | Card que ocupa uma coluna. |
| `wide` | Card que pode ocupar duas colunas. |
| `card-index` | Número/rótulo do gráfico. |
| `message` | Estado de carregamento/erro dos gráficos. |

Observação importante: a versão atual ainda contém alguns usos antigos de `styles.echartsGrid`, `styles.echartCard`, `styles.cardIndex` e `styles.message` em estados do componente. Como o projeto usa `globals.css`, esses usos devem ser convertidos para classes string normais: `className="echarts-grid"`, `className="echart-card"`, `className="card-index"` e `className="message"`.

---

## 7. Ciclo — `/ciclo`

### Arquivo
`app/(private)/ciclo/page.tsx`

| Classe | Função |
|---|---|
| `cycle-page` | Variação de layout da página de ciclo. |
| `cycle-intro` | Introdução da página. |
| `cycle-form-card` | Formulário de configuração do ciclo. |
| `cycle-form` | Estrutura do formulário. |
| `cycle-form-grid` | Grid dos campos do ciclo. |
| `cycle-field` | Campo individual. |
| `cycle-actions` | Ações do formulário. |
| `cycle-summary` | Resumo calculado do ciclo. |
| `cycle-summary-item` | Item do resumo. |
| `cycle-calendar` | Calendário do ciclo. |
| `month-controls` | Controles de navegação mensal. |
| `month-grid` | Grade mensal. |
| `period-day` | Dia marcado como período. |
| `fertile-day` | Dia marcado como janela fértil. |
| `ovulation-day` | Dia estimado de ovulação. |
| `cycle-legend` | Legenda do calendário. |

---

## 8. Avaliação — `/avaliacao`

### Arquivo
`app/(private)/avaliacao/page.tsx`

| Classe | Função |
|---|---|
| `evaluation-page` | Container da avaliação. |
| `evaluation-intro` | Introdução e orientação. |
| `evaluation-progress` | Progresso do questionário. |
| `evaluation-question` | Bloco de pergunta. |
| `evaluation-options` | Lista de respostas. |
| `evaluation-option` | Resposta individual. |
| `evaluation-option selected` | Resposta selecionada. |
| `evaluation-navigation` | Navegação entre perguntas. |
| `evaluation-result` | Resultado final. |
| `save-row` | Linha de ação/salvamento. |

---

## 9. Dados públicos — `/dados`

### Arquivo
`app/(private)/dados/page.tsx`

| Classe | Função |
|---|---|
| `content-page` | Container da página informativa. |
| `data-intro` | Hero editorial da página. |
| `data-intro-note` | Nota lateral sobre dados públicos. |
| `dignidade-banner` | Destaque do Programa Dignidade Menstrual. |
| `dignidade-content` | Conteúdo textual do destaque. |
| `dignidade-side` | Tratamento visual lateral do banner. |
| `dignidade-link` | Link oficial para o Governo Federal. |
| `data-section-block` | Seção de panorama. |
| `section-heading-line` | Cabeçalho do panorama. |
| `public-stat-grid` | Grid de estatísticas. |
| `data-topic-grid` | Grid de temas de saúde. |
| `topic-number` | Número/rótulo do tema. |
| `source-panel` | Painel com fontes dos dados. |
| `source-list` | Lista de referências. |

Link oficial usado no destaque:
`https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dignidade-menstrual`

---

## 10. Assistente — `/assistente`

### Arquivo
`app/(private)/assistente/page.tsx`

| Classe | Função |
|---|---|
| `assistant-page` | Container da página do assistente. |
| `assistant-intro` | Introdução do assistente. |
| `conversation-card` | Card completo da conversa. |
| `conversation-body` | Corpo rolável da conversa. |
| `user-message` | Mensagem enviada pela usuária. |
| `bot-message` | Mensagem recebida do assistente. |
| `bot-avatar` | Avatar do assistente. |
| `source-chips` | Fontes associadas à resposta. |
| `chat-input` | Área de entrada da conversa. |
| `suggestion-row` | Sugestões de perguntas. |

---

## 11. Classes de estado compartilhadas

| Classe | Uso |
|---|---|
| `active` | Item ativo em navegação ou controle. |
| `selected` | Opção selecionada em formulário. |
| `today` | Dia atual no calendário. |
| `period` | Dia pertencente ao período menstrual. |
| `wide` | Composição larga, normalmente duas colunas. |
| `compact` | Composição compacta, normalmente uma coluna. |
| `light` | Variante clara para fundo escuro. |
| `disabled` | Controle visualmente desabilitado. |

## Arquivos principais de estilo

- `app/globals.css`: estilos globais de todas as páginas.
- Não criar novamente `*.module.css` para as páginas atuais.
- Ao reconstruir uma página, preservar os nomes de classe acima para manter compatibilidade com o CSS.
- Priorizar a estrutura semântica: `header`, `main`, `nav`, `section`, `article`, `aside`, `footer`.
- Preservar estados `active`, `selected`, `today`, `period`, `wide` e `compact`, pois eles controlam comportamento visual e não apenas decoração.

## Rotas resumidas

- `/`: Home pública
- `/entrar`: Login
- `/criar-conta`: Cadastro
- `/acompanhe-se`: Registro diário
- `/historico`: Histórico
- `/graficos`: Gráficos
- `/ciclo`: Ciclo menstrual
- `/avaliacao`: Avaliação
- `/dados`: Dados públicos
- `/assistente`: Assistente

Este documento deve ser enviado junto com `app/globals.css` para a outra IA reconstruir a interface mantendo a estrutura visual e os estados atuais.
