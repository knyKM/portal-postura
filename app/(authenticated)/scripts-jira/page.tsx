"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export default function ScriptsJiraPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardClass = cn(
    "border rounded-3xl",
    isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-slate-50"
  );

  const inputClass = cn(
    "font-mono text-xs",
    isDark
      ? "bg-[#020617] border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
  );

  return (
    <DashboardShell
      pageTitle="Scripts Jira"
      pageSubtitle="Automação e gestão de tickets"
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* BLOCO PRINCIPAL */}
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Execução de Scripts
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-500">
                Configure os filtros para rodar ações automatizadas no Jira.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* JQL */}
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  JQL
                </p>
                <Input
                  placeholder='Ex: project = "POSTURA" AND status != Done'
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Utilize a sintaxe oficial do Jira. A consulta será aplicada
                  antes de qualquer ação.
                </p>
              </div>

              {/* AÇÕES DISPONÍVEIS */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Ações disponíveis
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    Alterar status
                  </Button>
                  <Button size="sm" variant="outline">
                    Mudar responsável
                  </Button>
                  <Button size="sm" variant="outline">
                    Adicionar comentário
                  </Button>
                  <Button size="sm" variant="outline">
                    Atualizar prioridade
                  </Button>
                  <Button size="sm" variant="outline">
                    Mover para outro projeto
                  </Button>
                  <Button size="sm" variant="outline">
                    Criar subtarefa padrão
                  </Button>
                  <Button size="sm" variant="outline">
                    Linkar a incidente
                  </Button>
                </div>

                <p className="text-[11px] text-zinc-500">
                  No futuro essas ações serão mapeadas para scripts reais
                  (transições, comentários, atualizações em massa, etc).
                </p>
              </div>

              {/* BOTÕES PRINCIPAIS */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Simular script</Button>
                <Button>Executar</Button>
                <Button variant="secondary">Salvar preset</Button>
                <Button variant="outline">Limpar parâmetros</Button>
              </div>
            </CardContent>
          </Card>

          {/* LATERAL – FILTROS PRONTOS */}
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Filtros prontos
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-500">
                Modelos comuns para uso rápido. Copie e ajuste conforme
                necessário.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
              <div>
                <p className="font-semibold">Vulnerabilidades críticas</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  project = &quot;POSTURA&quot; AND severity = Critical AND
                  status != Done
                </p>
              </div>

              <div>
                <p className="font-semibold">Tickets sem responsável</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  project = &quot;POSTURA&quot; AND assignee IS EMPTY
                </p>
              </div>

              <div>
                <p className="font-semibold">Pendentes de validação</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  project = &quot;POSTURA&quot; AND status = &quot;Em
                  Validação&quot;
                </p>
              </div>

              <div>
                <p className="font-semibold">Itens com SLA estourando</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  project = &quot;POSTURA&quot; AND &quot;Tempo restante de
                  SLA&quot; &lt; 4h AND status NOT IN (Done, Cancelado)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
