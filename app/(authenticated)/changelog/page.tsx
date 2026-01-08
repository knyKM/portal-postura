"use client";

import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Bug,
  History,
  ListChecks,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Palette,
  Layers,
  CalendarDays,
  Send,
  Workflow,
  ClipboardCheck,
  Blocks,
} from "lucide-react";

const releases = [
  {
    version: "1.5",
    codename: "Topologia Viva",
    releasedAt: "Dezembro/2025",
    summary:
      "Nova rota de topologia com diagrama interativo, persistência no banco e dashboards personalizados.",
    highlights: [
      {
        icon: Layers,
        title: "Topologia com drag & drop",
        description:
          "Canvas visual para montar diagramas de rede, adicionar máquinas e conectar nós.",
        bullets: [
          "Sidebar com acesso rápido à rota de topologia.",
          "Arrastar dispositivos, reposicionar e criar links entre nós.",
          "Zoom e grid para alinhar elementos com precisão.",
        ],
      },
      {
        icon: Palette,
        title: "Dispositivos personalizados",
        description:
          "Criação de novos tipos de dispositivo com ícone e edição de metadados.",
        bullets: [
          "Tipos personalizados com ícone próprio e renomeação inline.",
          "Campos extras por dispositivo (IP e descrição).",
          "Tipos e diagramas salvos no banco de dados.",
        ],
      },
      {
        icon: Blocks,
        title: "Templates de dashboard",
        description:
          "Seleção de dashboards personalizados em insights e editor com widgets.",
        bullets: [
          "Select de dashboards com opção de criar novo template.",
          "Editor com drag & drop, redimensionamento e grade de alinhamento.",
          "Salvar layout por template via banco.",
        ],
      },
    ],
  },
  {
    version: "1.4",
    codename: "Orquestrações Jira",
    releasedAt: "Dezembro/2025",
    summary:
      "Fila de aprovações e centro de ações receberam o fluxo “Subir issue”, permitir múltiplos templates e exportação em massa.",
    highlights: [
      {
        icon: Workflow,
        title: "Nova ação Subir Issue",
        description:
          "Usuários solicitam criação em lote apenas escolhendo o projeto e os campos que desejam mapear, sem precisar digitar IDs.",
        bullets: [
          "Seletor de projeto com ASSETN, CPE e OPENCVE.",
          "Campos dinâmicos reutilizam o padrão de “Atualizar campos”, permitindo múltiplos customfields.",
          "Template CSV disponível diretamente no formulário para orientar o preenchimento correto.",
        ],
      },
      {
        icon: ClipboardCheck,
        title: "Aprovação com download de CSV",
        description:
          "A fila de aprovações mostra os campos enviados e disponibiliza o CSV anexado para que o administrador revise antes de executar.",
        bullets: [
          "Cards destacam projeto destino, campos preenchidos manualmente e link para baixar o template preenchido.",
          "Histórico também grava o arquivo para consulta posterior.",
          "Resumo contextual do pedido inclui informações de escalonamento.",
        ],
      },
      {
        icon: Blocks,
        title: "Sidebar e navegação atualizadas",
        description:
          "Rota de relatórios foi removida e a sidebar passou a exibir a versão 1.4 na assinatura do Postura SM.",
        bullets: [
          "Lateral mais objetiva, voltada apenas para os módulos ativos.",
          "Changelog atualizado no mesmo padrão visual das versões anteriores.",
        ],
      },
    ],
  },
  {
    version: "1.3",
    codename: "MFA Portal",
    releasedAt: "Dezembro/2025",
    summary:
      "Login e MFA ganharam nova experiência premium, abrindo espaço para auditorias em tempo real e alertas no Postura SM.",
    highlights: [
      {
        icon: Sparkles,
        title: "Portal de Segurança Centralizada",
        description:
          "Interface de login redesenhada com layout duas colunas inspirado no visual React + Vite utilizado no restante da plataforma.",
        bullets: [
          "Narrativa atualizada destacando monitoramento de automações, ferramentas de apoio e indicadores de postura.",
          "Hero com CTA claro para acesso e plano de fundo gradiente alinhado à identidade Postura.",
          "Mensagens contextualizadas para primeiros acessos e erros de autenticação.",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Fluxo completo de MFA",
        description:
          "Passo a passo para configuração obrigatória no primeiro login, incluindo telas de setup e verificação estilizadas.",
        bullets: [
          "Sessão identifica usuários sem MFA e envia token seguro para /login/mfa-setup.",
          "API routes dedicadas para iniciar configuração, registrar segredo e validar códigos TOTP.",
          "Feedback visual claro para códigos inválidos e confirmação antes de liberar o dashboard.",
        ],
      },
      {
        icon: History,
        title: "Auditoria pronta para operar",
        description:
          "Sidebar ganhou item exclusivo de auditoria em tempo real das automações Jira, conectando com counters e status cards.",
        bullets: [
          "Cards exibem filas, SLAs e logs recentes com cores consistentes ao restante da aplicação.",
          "Estrutura preparada para alertas quando jobs falharem ou ficarem pendentes.",
          "Base para monitoramento contínuo junto das ferramentas e insights de vulnerabilidades.",
        ],
      },
    ],
  },
  {
    version: "1.2",
    codename: "Vuln Widgets",
    releasedAt: "Dezembro/2025",
    summary:
      "Introdução do criador de widgets JQL e melhoria no fluxo de insights de vulnerabilidades.",
    highlights: [
      {
        icon: Palette,
        title: "Modal de widgets e visual refinado",
        description:
          "O botão Criar widget abre uma modal com templates (pizza, barras, aging) e campo para nome + JQL.",
        bullets: [
          "Modal central com `createPortal`, evitando conflitos de stacking.",
          "Templates descrevem visual e comportamento esperado antes de conectar ao Jira.",
          "Campos nome + JQL validados antes de confirmar inclusão.",
        ],
      },
      {
        icon: Layers,
        title: "Orgânico com insights",
        description:
          "Widgets personalizados saíram do layout para evitar ruído visual, deixando a tela pronta para dados reais.",
        bullets: [
          "Hero de vulnerabilidades com CTA direto para inserir widgets.",
          "Fluxo focado em preparar as consultas antes de renderizar o componente final.",
          "Suporte a abrir e fechar modal sem recarregar a página.",
        ],
      },
    ],
  },
  {
    version: "1.1",
    codename: "Aurora UX",
    releasedAt: "Dezembro/2025",
    summary:
      "Refino completo do front-end com novos heróis, cards responsivos e fluxo visual consistente entre rotas.",
    highlights: [
      {
        icon: Palette,
        title: "Visual premium em /usuarios e /configuracoes",
        description:
          "As telas administrativas ganharam gradientes, métricas e hero cards alinhados ao design Postura SM.",
        bullets: [
          "Hero de identidades com métricas em /usuarios cobrindo a largura total da página.",
          "Configurações com narrativa de plataforma e integração Jira destacada.",
          "Perfis exibidos com contadores em tempo real e feedback visual aprimorado.",
        ],
      },
      {
        icon: Layers,
        title: "Experiência unificada",
        description:
          "Componentes reutilizados para tornar formulários, tabelas e integrações visualmente consistentes.",
        bullets: [
          "Cartões com cantos arredondados, bordas suaves e badges informativas.",
          "Stacks responsivas otimizadas para desktop e tablets.",
          "Feedback contextual (sucesso/erro) com cores acessíveis.",
        ],
      },
    ],
  },
  {
    version: "1.0.1",
    codename: "Atlas Patch 1",
    releasedAt: "Dezembro/2025",
    summary: "Atualização focada em correções de bugs e maior estabilidade.",
    highlights: [
      {
        icon: Bug,
        title: "Correções de bugs críticos",
        description:
          "Resolvemos regressões identificadas após o lançamento inicial do Postura SM.",
        bullets: [
          "Fila de aprovações e página de insights mantêm a sessão do administrador sem redirecionamentos indevidos.",
          "Sistema de notificações evita duplicidades e direciona decisões apenas para o solicitante correto.",
          "Fluxo de inativação de usuários impede bloqueios acidentais do próprio administrador conectado.",
        ],
      },
    ],
  },
  {
    version: "1.0.0",
    codename: "Atlas",
    releasedAt: "Dezembro/2025",
    summary:
      "Primeira versão pública do Postura SM com módulos de autenticação, centro de ações Jira, fila de aprovação e notificações persistentes.",
    highlights: [
      {
        icon: ShieldCheck,
        title: "Fluxo seguro de autenticação",
        description:
          "Login centralizado com tokens e bloqueio automático para contas inativas.",
        bullets: [
          "Persistência em SQLite com hashing de senha e seed administrativo.",
          "Gerenciamento de perfis (admin, analista e leitor) respeitando permissões.",
          "Expiração automática do cookie de sessão e logout remoto.",
        ],
      },
      {
        icon: NotebookPen,
        title: "Centro de ações Jira",
        description:
          "Interface rica para solicitar alterações em massa com filtros por JQL e IDs.",
        bullets: [
          "Todos os comandos passam por fila de aprovação com auditoria completa.",
          "Histórico detalhado de decisões e comentários obrigatórios para aprovação ou recusa.",
          "Notificações em tempo real e registradas em banco para admins e solicitantes.",
        ],
      },
      {
        icon: ListChecks,
        title: "Fila de aprovações e auditoria",
        description:
          "Painel específico para administradores aprovarem, declinarem e justificarem ações.",
        bullets: [
          "Registro permanente das decisões, com motivos visíveis para quem solicitou.",
          "Pendências e históricos exibidos em blocos colapsáveis por padrão.",
          "Links cruzados com notificações para abrir diretamente a solicitação correta.",
        ],
      },
      {
        icon: Sparkles,
        title: "Experiência Postura SM 1.0",
        description:
          "Nova identidade visual Postura Security Management com dashboards e insights de vulnerabilidades.",
        bullets: [
          "Charts interativos com componentes shadcn/ui.",
          "Aplicação responsiva com tema escuro predominante e gradientes personalizados.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const totalReleases = releases.length;
  const latestRelease = releases[0];
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionFeedback, setSuggestionFeedback] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  async function handleSuggestionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuggestionFeedback(null);
    setSuggestionError(null);

    const trimmed = suggestion.trim();
    if (!trimmed) {
      setSuggestionFeedback("Descreva rapidamente sua ideia antes de enviar.");
      return;
    }

    if (trimmed.length > 2000) {
      setSuggestionError("Resuma a sugestão em até 2000 caracteres.");
      return;
    }

    setIsSubmittingSuggestion(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmed }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível registrar a sugestão.");
      }

      setSuggestion("");
      setSuggestionFeedback(
        "Recebido! Vamos analisar internamente e retornaremos."
      );
    } catch (error) {
      setSuggestionError(
        error instanceof Error
          ? error.message
          : "Falha ao enviar sugestão. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsSubmittingSuggestion(false);
    }
  }

  const statCards = [
    {
      label: "Versões entregues",
      value: totalReleases,
      helper: "Do lançamento 1.0 até agora",
    },
    {
      label: "Versão atual",
      value: latestRelease.version,
      helper: latestRelease.codename,
    },
    {
      label: "Foco recente",
      value: "UX & estabilidade",
      helper: "Melhorias contínuas no front-end",
    },
  ];

  return (
    <DashboardShell
      pageTitle="Changelog"
      pageSubtitle="Evolução contínua do Postura Security Management"
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#090f1f] via-[#050816] to-[#05060f] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="absolute inset-y-0 right-6 hidden w-40 rounded-full bg-gradient-to-b from-sky-500/30 via-purple-500/30 to-amber-400/20 blur-3xl md:block" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-xl">
                  <Layers className="h-6 w-6" />
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white shadow-xl">
                  <CalendarDays className="h-6 w-6" />
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Histórico da plataforma
                </p>
                <h2 className="text-2xl font-semibold">Notas de versão Postura SM</h2>
                <p className="text-sm text-zinc-400">
                  Acompanhe os refinamentos de segurança, experiência e integrações de cada release.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-xs",
                isDark
                  ? "border-purple-500/30 bg-purple-500/5 text-purple-200"
                  : "border-purple-200 bg-purple-50 text-purple-700"
              )}
            >
              Último update • {latestRelease.releasedAt}
            </div>
          </div>

          <div
            className={cn(
              "mt-6 space-y-4 rounded-2xl border p-5 backdrop-blur md:flex md:items-center md:justify-between md:space-y-0 md:space-x-6 lg:p-6",
              isDark
                ? "border-white/5 bg-black/20"
                : "border-slate-200 bg-gradient-to-r from-white via-slate-50 to-purple-50"
            )}
          >
            <div>
              <p
                className={cn(
                  "text-sm uppercase tracking-[0.3em]",
                  isDark ? "text-purple-300" : "text-purple-500"
                )}
              >
                Ideias
              </p>
              <h3
                className={cn(
                  "text-xl font-semibold",
                  isDark ? "text-white" : "text-slate-800"
                )}
              >
                Tem alguma automação, ferramenta ou métrica que gostaria de ver?
              </h3>
              <p
                className={cn(
                  "text-sm",
                  isDark ? "text-zinc-400" : "text-slate-500"
                )}
              >
                Compartilhe seu pensamento e ajudaremos a priorizar os próximos ciclos do Postura SM.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSuggesting((prev) => !prev);
                setSuggestionFeedback(null);
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]",
                isDark
                  ? "bg-gradient-to-r from-pink-500 to-purple-500"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500"
              )}
            >
              {isSuggesting ? "Fechar formulário" : "Propor nova ideia"}
            </button>
          </div>

          {isSuggesting && (
            <form
              onSubmit={handleSuggestionSubmit}
              className={cn(
                "mt-4 rounded-3xl border px-5 py-4",
                isDark
                  ? "border-white/5 bg-white/5 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              )}
            >
              <label className="text-sm font-medium text-purple-300">
                Descreva a automação, ferramenta ou indicador que gostaria de ver
              </label>
              <textarea
                value={suggestion}
                onChange={(event) => setSuggestion(event.target.value)}
                disabled={isSubmittingSuggestion}
                className={cn(
                  "mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                  isDark
                    ? "border-white/10 bg-black/40 text-white placeholder:text-white/40 focus:border-purple-500"
                    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-500"
                )}
                rows={4}
                placeholder="Ex: Quero um widget que faça ping em uma lista de IPs e alerte quando algum estiver fora..."
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-[13px] text-zinc-400">
                  Você pode colar links ou anexar uma JQL para contextualizar.
                </p>
                <button
                  type="submit"
                  disabled={isSubmittingSuggestion}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" />
                  {isSubmittingSuggestion ? "Enviando..." : "Enviar sugestão"}
                </button>
              </div>

              {suggestionFeedback && (
                <p className="mt-3 text-sm text-emerald-400">{suggestionFeedback}</p>
              )}
              {suggestionError && (
                <p className="mt-2 text-sm text-rose-400">{suggestionError}</p>
              )}
            </form>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={cn(
                "rounded-2xl border px-4 py-4",
                isDark
                  ? "border-zinc-800 bg-[#050816]/80 text-zinc-200"
                  : "border-slate-200 bg-white text-slate-600"
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              <p className="text-xs text-zinc-400">{card.helper}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {releases.map((release) => (
            <Card
              key={release.version}
              className={cn(
                "rounded-3xl border text-sm",
                isDark
                  ? "border-zinc-800 bg-[#050816]/85 text-zinc-200"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <Badge
                    className={cn(
                      "w-fit rounded-full text-xs font-semibold",
                      isDark
                        ? "bg-purple-600/10 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                    )}
                  >
                    {release.version} • {release.codename}
                  </Badge>
                  <CardTitle
                    className={cn(
                      "text-xl font-semibold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    Versão {release.version}
                  </CardTitle>
                  <p className="text-sm text-zinc-400">{release.summary}</p>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-right text-xs",
                    isDark
                      ? "border-zinc-800 bg-black/20 text-zinc-400"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  <p>Lançamento</p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isDark ? "text-zinc-100" : "text-slate-800"
                    )}
                  >
                    {release.releasedAt}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                {release.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={cn(
                        "rounded-2xl border p-5",
                        isDark
                          ? "border-zinc-800/70 bg-[#070b1c]"
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl",
                            isDark
                              ? "bg-purple-600/10 text-purple-300"
                              : "bg-purple-100 text-purple-600"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p
                            className={cn(
                              "text-base font-semibold",
                              isDark ? "text-white" : "text-slate-900"
                            )}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Separator className={cn("my-4", isDark ? "bg-zinc-800" : "bg-slate-200")} />
                      <ul
                        className={cn(
                          "space-y-2 text-sm",
                          isDark ? "text-zinc-300" : "text-slate-600"
                        )}
                      >
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <History className="mt-0.5 h-3.5 w-3.5 text-purple-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
