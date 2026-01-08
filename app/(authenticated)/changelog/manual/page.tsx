"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BookMarked, NotebookPen } from "lucide-react";

type ManualSection = {
  id: string;
  title: string;
  routes: string[];
  summary: string;
  description: string;
  steps: Array<{ title: string; detail: string }>;
  apis?: Array<{ method: string; path: string; detail: string }>;
  notes?: string[];
};

const manualSections: ManualSection[] = [
  {
    id: "acesso",
    title: "Acesso seguro e MFA obrigatório",
    routes: ["/login", "/login/mfa-setup", "/login/mfa-verify"],
    summary: "Fluxo de autenticação que libera todas as rotas dentro de (authenticated).",
    description:
      "O portal de login executa validações de credenciais, garante que o usuário esteja ativo e obriga a configuração de MFA antes de conceder cookies de sessão.",
    steps: [
      {
        title: "Validar credenciais em /login",
        detail:
          "O componente LoginForm normaliza o e-mail, envia POST /api/auth/login e retorna erros para contas inativas ou credenciais inválidas.",
      },
      {
        title: "Direcionar quem ainda não tem MFA",
        detail:
          "Quando o backend responde com mfaSetupRequired, /login redireciona para /login/mfa-setup levando o token emitido por createMfaToken.",
      },
      {
        title: "Gerar QR Code e confirmar segredo",
        detail:
          "/login/mfa-setup chama POST /api/auth/mfa/setup/start para buscar o QR (via QRCode.toDataURL) e depois POST /api/auth/mfa/setup/confirm para validar o TOTP, ativar o MFA e receber o cookie postura_auth.",
      },
      {
        title: "Verificar MFA nos próximos logins",
        detail:
          "Quando o usuário já tem MFA, /login encaminha para /login/mfa-verify, que chama POST /api/auth/mfa/verify, renova o cookie httpOnly e libera o Dashboard.",
      },
    ],
    apis: [
      {
        method: "POST",
        path: "/api/auth/login",
        detail:
          "Valida e-mails e senha, impede acesso de usuários inativos e indica se o fluxo deve seguir para setup ou verify.",
      },
      {
        method: "POST",
        path: "/api/auth/mfa/setup/start",
        detail:
          "Gera ou reutiliza o segredo TOTP do usuário, entrega a URL otpauth e o QR Code que o frontend exibe.",
      },
      {
        method: "POST",
        path: "/api/auth/mfa/setup/confirm",
        detail:
          "Checa o código informado, liga o MFA para o usuário e grava o cookie de sessão (postura_auth).",
      },
      {
        method: "POST",
        path: "/api/auth/mfa/verify",
        detail:
          "Fluxo para logins futuros: valida o code, gera o token JWT e atualiza o last_seen.",
      },
    ],
    notes: [
      "Depois de autenticado, o frontend salva um snapshot do usuário em localStorage (postura_user) que é lido pelos guards das páginas em (authenticated).",
      "O DashboardShell também se apoia no cookie postura_auth para chamar as APIs protegidas em nome do usuário.",
    ],
  },
  {
    id: "painel-vulnerabilidades",
    title: "Painéis de vulnerabilidades e insights",
    routes: ["/dashboard", "/vulnerabilidades", "/vulnerabilidades/insights"],
    summary: "Camada visual que apresenta métricas mockadas e conceitos de widgets JQL.",
    description:
      "O Dashboard principal (DashboardContent) e a rota /vulnerabilidades/insights entregam gráficos, templates de widgets e cards que guiam squads antes da integração real com o Jira.",
    steps: [
      {
        title: "Acessar /dashboard",
        detail:
          "A página faz guarda de localStorage, instancia DashboardShell e renderiza cards de criticidade, gráficos Recharts e o bloco de widget templates.",
      },
      {
        title: "Simular criação de widgets",
        detail:
          "O usuário escolhe um template (counter, severity, aging, table) e dispara handleCreateWidget, que confirma que o componente está pronto para receber uma JQL real.",
      },
      {
        title: "Usar /vulnerabilidades/insights",
        detail:
          "O componente VulnerabilityInsightsContent alterna superfícies (web/cloud), mostra timelines, radiais e ainda descreve template de widgets com exemplos de JQL.",
      },
      {
        title: "Planejar uso do hub /vulnerabilidades",
        detail:
          "A rota pai exibe o placeholder 'Em breve' para ancorar futuras telas consolidadas.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/auditoria",
        detail:
          "Os cards que mostram saúde de automações reaproveitam o hook useAutomationMonitor, que consulta este endpoint a cada 15 segundos.",
      },
    ],
    notes: [
      "DashboardShell contém o sino de notificações (GET/PATCH/DELETE /api/notifications) e o seletor de tema aplicável a todas as rotas autenticadas.",
    ],
  },
  {
    id: "changelog",
    title: "Histórico de releases",
    routes: ["/changelog"],
    summary: "Timeline oficial da plataforma, incluindo as versões 1.0.0 a 1.4 já cadastradas.",
    description:
      "A rota principal de /changelog percorre o array releases com cards que contam codinomes, resumos e highlights de cada entrega.",
    steps: [
      {
        title: "Selecionar a versão desejada",
        detail:
          "Cada objeto do array releases rende cards com versão, codinome, data e resumo do que mudou.",
      },
      {
        title: "Explorar highlights ilustrados",
        detail:
          "Os highlights combinam ícones do Lucide (Workflow, ShieldCheck etc.) com bullets detalhando cada melhoria.",
      },
      {
        title: "Comunicar status do produto",
        detail:
          "O herói destaca badges como 'Orquestração automática' e informa os pilares de cada release, útil para alinhar squads.",
      },
    ],
    notes: [
      "Esta página segue o mesmo layout premium das demais rotas e serve como referência visual para cards e badges reutilizados no manual.",
    ],
  },
  {
    id: "acoes",
    title: "Central de Ações em massa",
    routes: ["/acoes"],
    summary: "Interface para abertura de solicitações de alteração em lote dentro do Jira.",
    description:
      "A página /acoes combina cards de seleção de ação, filtros por JQL/IDs e o componente ActionForm, que aceita templates CSV e catálogo de campos do Jira.",
    steps: [
      {
        title: "Escolher o tipo de ação",
        detail:
          "Os cards permitem alterar status, reassinar, comentar, atualizar campos, escalar issues ou deletá-las; cada opção habilita campos diferentes no formulário.",
      },
      {
        title: "Definir o universo de issues",
        detail:
          "O usuário opta por filtrar via JQL ou IDs (a ação delete exige IDs) e pode importar um arquivo com identificadores para preencher automaticamente.",
      },
      {
        title: "Configurar o payload",
        detail:
          "Campos como novo responsável, comentário, lista de custom fields ou projeto de destino (escalar) são preenchidos; há validações para evitar envios vazios.",
      },
      {
        title: "Escalar usando template CSV",
        detail:
          "Para a ação 'Subir issue' há download do arquivo /templates/escalate-template.csv e leitura do conteúdo colado ou importado, com contagem de linhas e colunas.",
      },
      {
        title: "Acompanhar suas solicitações",
        detail:
          "A tabela 'Minhas solicitações' consome /api/actions/requests?scope=self&limit=25 e mostra status, payload e notas de auditoria.",
      },
    ],
    apis: [
      {
        method: "POST",
        path: "/api/actions/requests",
        detail:
          "Recebe a ação selecionada, o filtro (JQL/IDs), payload opcional e cria o registro com status pending.",
      },
      {
        method: "GET",
        path: "/api/actions/requests?scope=self&limit=25",
        detail:
          "Lista as solicitações do usuário autenticado para exibir na seção 'Minhas solicitações'.",
      },
    ],
    notes: [
      "ActionForm permite importar o JSON do endpoint /rest/api/3/field e filtrar campos por tipo, garantindo que os custom fields usados na automação existam.",
      "Cada criação dispara createNotification para todos os admins; o sino global lê essas mensagens via GET/PATCH/DELETE /api/notifications.",
    ],
  },
  {
    id: "fila-aprovacoes",
    title: "Fila de aprovações e auditoria",
    routes: ["/fila-aprovacoes"],
    summary: "Hub exclusivo para administradores avaliarem as ações abertas em /acoes.",
    description:
      "A rota protege o acesso verificando o role no localStorage, carrega métricas, lista solicitações pendentes/concluídas e mostra aprovadores online.",
    steps: [
      {
        title: "Garantir perfil admin",
        detail:
          "O useEffect lê postura_user; se o usuário não for admin ele é redirecionado para /dashboard.",
      },
      {
        title: "Conferir indicadores iniciais",
        detail:
          "Após o load em batch, os cards exibem pendentes, concluídas e quantidade de aprovadores online (via /api/users/online).",
      },
      {
        title: "Revisar cada solicitação",
        detail:
          "Card mostra filtro JQL ou lista de IDs (com resumo), payload (novos campos, CSV anexado, comentário) e dados do solicitante.",
      },
      {
        title: "Registrar parecer obrigatório",
        detail:
          "Para aprovar ou negar é preciso informar nota; o componente ApprovalQueue garante isso e envia PATCH /api/actions/requests com decision e notes.",
      },
      {
        title: "Consultar histórico",
        detail:
          "A lista de concluídos consome /api/actions/requests?status=completed para futuras auditorias.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/actions/requests?status=pending",
        detail: "Retorna os cards abertos que ainda esperam decisão.",
      },
      {
        method: "GET",
        path: "/api/actions/requests?status=completed",
        detail: "Alimenta o histórico que aparece na segunda aba.",
      },
      {
        method: "PATCH",
        path: "/api/actions/requests",
        detail:
          "Só admins podem aprovar ou declinar, e é obrigatório enviar notas que ficam registradas como audit_notes.",
      },
      {
        method: "GET",
        path: "/api/users/online",
        detail:
          "Lista admins com last_seen_recent, usado para formar o contador 'Aprovadores online'.",
      },
    ],
    notes: [
      "Se a URL tiver hash (#request-123), o componente foca automaticamente o card correspondente.",
      "notifyRequesterDecision envia notificações para o solicitante, permitindo que ele saiba o status via sino global.",
    ],
  },
  {
    id: "auditoria",
    title: "Auditoria de automações Jira",
    routes: ["/auditoria"],
    summary: "Streaming do status dos jobs responsáveis por sincronizar Jira e Postura SM.",
    description:
      "A tela consome o hook useAutomationMonitor, que a cada 15 segundos chama /api/auditoria para atualizar métricas, logs e cartões de job.",
    steps: [
      {
        title: "Ler o hero e badges operacionais",
        detail:
          "A parte superior mostra badges 'Orquestração automática' e 'Streaming 15s' para contextualizar o monitoramento.",
      },
      {
        title: "Acompanhar cards de saúde",
        detail:
          "Os cards sintetizam jobs saudáveis, fila média, observabilidade e quantidade total de jobs.",
      },
      {
        title: "Monitorar logs e jobs individuais",
        detail:
          "As listas exibem nome, owner, status (running/pending/failed/success), tempo em fila e últimos logs.",
      },
      {
        title: "Recarregar sob demanda",
        detail:
          "Há botão 'Forçar atualização' que chama a função refetch do hook e dispara o GET manualmente.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/auditoria",
        detail:
          "Retorna snapshot com jobs e logs usado tanto aqui quanto em /auditoria/jobs e nas métricas do dashboard.",
      },
    ],
    notes: [
      "O hook usa AbortController para evitar race conditions quando o componente desmonta.",
    ],
  },
  {
    id: "auditoria-jobs",
    title: "Cadastro de jobs monitorados",
    routes: ["/auditoria/jobs"],
    summary: "Painel administrativo para criar integrações e editar metadados dos jobs monitorados.",
    description:
      "Permite criar novos jobs, editar nome/owner/descrição/pendências e receber o endpoint de status a ser consumido pelo serviço externo.",
    steps: [
      {
        title: "Listar o snapshot atual",
        detail:
          "Logo ao carregar, a página chama GET /api/auditoria para exibir os jobs existentes com status e métricas recentes.",
      },
      {
        title: "Criar um job",
        detail:
          "O formulário exige name e owner; ao gravar via POST /api/auditoria/jobs, o backend devolve também o endpoint /api/auditoria/jobs/:id/status.",
      },
      {
        title: "Editar metadados",
        detail:
          "Ao clicar em editar, os campos são preenchidos e PATCH /api/auditoria/jobs/:id atualiza nome, owner, descrição e métricas padrão (queueSeconds/pendingIssues).",
      },
      {
        title: "Atualizar status via API externa",
        detail:
          "O serviço que executa o job deve chamar POST /api/auditoria/jobs/:id/status com status=0/1/2, tempos e logs para refletir em tempo real (0=falhou, 1=sucesso, 2=em execução).",
      },
    ],
    apis: [
      {
        method: "POST",
        path: "/api/auditoria/jobs",
        detail:
          "Registra um job e responde com instruções de como atualizar seu status posteriormente.",
      },
      {
        method: "PATCH",
        path: "/api/auditoria/jobs/:id",
        detail: "Atualiza metadados do job (nome, owner, descrição, limites).",
      },
      {
        method: "POST",
        path: "/api/auditoria/jobs/:id/status",
        detail:
          "Endpoint consumido pelos scripts reais para mudar status, fila, duração e logs.",
      },
    ],
    notes: [
      "Os inputs aceitam apenas valores numéricos e convertem strings vazias para zero antes de enviar.",
      "Status aceitos no POST /api/auditoria/jobs/:id/status: 0 (falhou), 1 (sucesso) e 2 (em execução).",
      "O status 'pending' é gerado internamente na criação do job e não é aceito no POST.",
    ],
  },
  {
    id: "playbooks",
    title: "Centro de playbooks e squads",
    routes: ["/playbooks", "/playbooks/[id]"],
    summary: "Cadastro e acompanhamento dos fluxos automatizados ligados a squads e scripts.",
    description:
      "A listagem mostra todos os playbooks com status, squads atendidas e automações; o detalhe permite atualizar etapas, status e script vinculado.",
    steps: [
      {
        title: "Obter visão geral",
        detail:
          "Ao carregar, a página chama GET /api/playbooks e monta métricas como 'Playbooks ativos', 'Esteiras prontas' e 'Automations conectadas'.",
      },
      {
        title: "Cadastrar playbook",
        detail:
          "O drawer de criação exige nome, squads e automations (separados por vírgula), aceita descrição, passos (um por linha) e caminho do script.",
      },
      {
        title: "Escolher scripts existentes",
        detail:
          "O ScriptPickerModal usa /api/scripts para mostrar diretórios/arquivos e permite selecionar o caminho que será salvo no campo scriptPath.",
      },
      {
        title: "Manter status e etapas",
        detail:
          "Na rota /playbooks/[id], é possível alterar status (pronto, em validação, em construção), editar passos, atualizar lastRun e scriptPath.",
      },
      {
        title: "Remover playbook (apenas admin)",
        detail:
          "Se o usuário logado for admin, o botão de exclusão executa DELETE /api/playbooks/:id e redireciona para /playbooks.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/playbooks",
        detail: "Lista todos os playbooks com squads, automations e status.",
      },
      {
        method: "POST",
        path: "/api/playbooks",
        detail: "Cria um novo registro validando nome, squads e automations.",
      },
      {
        method: "GET",
        path: "/api/playbooks/:id",
        detail: "Alimenta a rota de detalhes /playbooks/[id].",
      },
      {
        method: "PATCH/DELETE",
        path: "/api/playbooks/:id",
        detail:
          "Atualiza status/passos/scriptPath/lastRun ou remove um playbook (DELETE exige perfil admin).",
      },
    ],
    notes: [
      "Os passos são armazenados como array [{ title, detail }], permitindo que o frontend mantenha títulos curtos e descrições longas.",
    ],
  },
  {
    id: "scripts",
    title: "Scripts de automação e roteiros Jira",
    routes: ["/scripts", "/scripts-jira"],
    summary: "Exploração dos arquivos reais no servidor e prototipação de ações Jira.",
    description:
      "A rota /scripts usa /api/scripts para navegar no diretório definido por POSTURA_FILES_ROOT, enquanto /scripts-jira apresenta um fluxo fictício para configurar consultas JQL e ações pré-definidas.",
    steps: [
      {
        title: "Navegar pelo servidor em /scripts",
        detail:
          "O explorador lista diretórios e arquivos com nome, tamanho e data. É possível abrir subpastas, voltar níveis ou atualizar a listagem.",
      },
      {
        title: "Ler conteúdo de arquivos",
        detail:
          "Ao selecionar um arquivo, o painel da direita exibe o conteúdo inteiro em modo somente leitura, útil para revisar scripts bash/py utilizados pelos playbooks.",
      },
      {
        title: "Escolher scripts nos modais",
        detail:
          "O ScriptPickerModal (usado em Playbooks) compartilha o mesmo endpoint, garantindo que os caminhos selecionados existam no servidor.",
      },
      {
        title: "Simular execução em /scripts-jira",
        detail:
          "A tela oferece campo JQL, botões para ações (Alterar status, Mudar responsável, Atualizar prioridade etc.) e presets de filtros prontos para orientar futuras integrações.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/scripts",
        detail:
          "Recebe um parâmetro path opcional, valida se o caminho é filho de POSTURA_FILES_ROOT e devolve diretórios/arquivos ou o conteúdo de um arquivo.",
      },
    ],
    notes: [
      "O endpoint bloqueia acessos fora do diretório raiz por segurança.",
      "Scripts-Jira ainda não dispara ações, servindo como protótipo visual para quando as automações forem conectadas.",
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas de conectividade",
    routes: ["/ferramentas"],
    summary: "Utilitários de ping e telnet simulados no ambiente da aplicação.",
    description:
      "O laboratório apresenta cartões para Ping ICMP e Teste Telnet, aceitando IPs via textarea ou upload e retornando resultados individuais.",
    steps: [
      {
        title: "Selecionar a ferramenta",
        detail:
          "Os cartões exibem descrição, helper e botão de execução específico para ping ou telnet.",
      },
      {
        title: "Informar IPs",
        detail:
          "É possível colar lista separada por linhas/virgulas ou enviar arquivo .txt/.csv; o código quebra por regex e normaliza os valores.",
      },
      {
        title: "Configurar porta (telnet)",
        detail:
          "Para telnet a UI mostra um input adicional (padrão 443) validado antes de chamar a API.",
      },
      {
        title: "Executar e analisar retornos",
        detail:
          "Os resultados são apresentados logo abaixo do formulário, indicando status ok/erro e mensagens como 'Latência 24.0 ms' ou 'Porta 443 não respondeu'.",
      },
    ],
    apis: [
      {
        method: "POST",
        path: "/api/tools/ping",
        detail:
          "Executa ping -c 1 -W 1 para cada IP e captura a latência; erros retornam timeout/host inacessível.",
      },
      {
        method: "POST",
        path: "/api/tools/telnet",
        detail:
          "Abre sockets com net.Socket, testa portas entre 1 e 65535 e responde status por IP.",
      },
    ],
    notes: [
      "Os helpers lembram que os testes são simulados neste ambiente e não atingem a rede corporativa real.",
    ],
  },
  {
    id: "sugestoes",
    title: "Central de sugestões e pipeline",
    routes: ["/sugestoes"],
    summary: "Espaço colaborativo para receber ideias de squads e gerenciar status/estágios.",
    description:
      "A página consulta /api/suggestions para listar backlog, permite enviar novas ideias e, para admins, aprovar, atualizar estágio ou excluir registros.",
    steps: [
      {
        title: "Carregar ideias existentes",
        detail:
          "O useEffect busca /api/suggestions (limit 100) e mostra cards agrupados por status (pendentes vs aprovadas).",
      },
      {
        title: "Enviar nova sugestão",
        detail:
          "O textarea grava o conteúdo, aplica limite de 2000 caracteres e faz POST /api/suggestions; a resposta é adicionada em tempo real.",
      },
      {
        title: "Aprovar ou voltar para pendente",
        detail:
          "Admins podem clicar em Aprovar, que dispara PATCH /api/suggestions com status approved e stage inicial 'Descoberta'.",
      },
      {
        title: "Atualizar estágio de implementação",
        detail:
          "Os botões de estágio enviam PATCH com implementationStage (Descoberta, Planejamento, Desenvolvimento, QA ou Go-live).",
      },
      {
        title: "Remover ideias",
        detail:
          "Admins podem deletar sugestões específicas via DELETE /api/suggestions?id=:id.",
      },
    ],
    apis: [
      { method: "GET", path: "/api/suggestions", detail: "Lista sugestões com filtros de status." },
      { method: "POST", path: "/api/suggestions", detail: "Cria uma nova ideia com conteúdo obrigatório." },
      {
        method: "PATCH",
        path: "/api/suggestions",
        detail:
          "Atualiza status approved/pending e implementationStage, apenas para admins.",
      },
      {
        method: "DELETE",
        path: "/api/suggestions",
        detail:
          "Remove uma sugestão específica (payload ou query param informam o id).",
      },
    ],
    notes: [
      "A timeline textual mostra data formatada via Intl.DateTimeFormat pt-BR e reforça quando a ideia entrou na fila.",
    ],
  },
  {
    id: "usuarios",
    title: "Gestão de usuários e perfis",
    routes: ["/usuarios"],
    summary: "Cadastro, listagem e ativação/desativação de contas internas.",
    description:
      "Restrita a admins, a página gera senhas fortes, cria usuários e oferece switches para ativar/desativar contas sem permitir que o próprio admin se bloqueie.",
    steps: [
      {
        title: "Aplicar guarda de perfil",
        detail:
          "Ao carregar, a tela verifica postura_user; se o role não for admin ela define accessDenied e evita exibir o restante.",
      },
      {
        title: "Gerar credenciais",
        detail:
          "Um helper gera senhas de 16 caracteres com letras, números e símbolos; o valor é sugerido no campo senha antes do POST.",
      },
      {
        title: "Criar usuários",
        detail:
          "O formulário envia POST /api/users com name/email/password/role; ao receber a resposta o usuário é adicionado à tabela local.",
      },
      {
        title: "Listar e filtrar",
        detail:
          "GET /api/users retorna todos os registros com role, created_at e flag is_active para serem exibidos em cards e na tabela.",
      },
      {
        title: "Ativar/Inativar",
        detail:
          "O switch chama PATCH /api/users/:id/status passando { active: true|false } e bloqueia a tentativa quando o id é do próprio admin conectado.",
      },
    ],
    apis: [
      { method: "GET", path: "/api/users", detail: "Listagem, restrita a admins autenticados." },
      { method: "POST", path: "/api/users", detail: "Criação, valida nome, e-mail e força senha >= 8 caracteres." },
      {
        method: "PATCH",
        path: "/api/users/:id/status",
        detail:
          "Atualiza o campo is_active; também é usado pela fila de aprovações para garantir que só admins ativos aprovem.",
      },
    ],
    notes: [
      "A seção também mostra os últimos usuários criados, reforçando quando registrar múltiplos perfis em sequência.",
    ],
  },
  {
    id: "configuracoes",
    title: "Configurações e integrações",
    routes: ["/configuracoes"],
    summary: "Painel para revisar o perfil logado, tokens Jira e encerrar a sessão.",
    description:
      "Exibe cards com identidade, integrações e fluxo ativo, traz formulários para consultar/salvar o token do Jira (apenas admins) e botão de logout.",
    steps: [
      {
        title: "Mostrar identidade",
        detail:
          "Logo acima a tela renderiza cards com papel, integrador (Jira + Postura) e fluxo ativo.",
      },
      {
        title: "Carregar token atual (admins)",
        detail:
          "Se o usuário for admin, um efeito chama GET /api/integrations/jira-token e preenche os campos URL/token.",
      },
      {
        title: "Salvar configurações",
        detail:
          "O botão Salvar envia POST /api/integrations/jira-token com url obrigatória e token opcional (pode limpar o token mantendo a URL).",
      },
      {
        title: "Efetuar logout",
        detail:
          "O botão 'Encerrar sessão' remove postura_user e redireciona para /login.",
      },
    ],
    apis: [
      {
        method: "GET",
        path: "/api/integrations/jira-token",
        detail: "Retorna url/token atuais, garantindo que apenas admins consultem.",
      },
      {
        method: "POST",
        path: "/api/integrations/jira-token",
        detail:
          "Atualiza os valores persistidos; permite limpar token mantendo a URL quando necessário.",
      },
    ],
    notes: [
      "Os campos usam estados locais jiraMessage/jiraError para exibir feedback instantâneo no formulário.",
    ],
  },
  {
    id: "kanban",
    title: "Kanban pessoal e local",
    routes: ["/kanban"],
    summary: "Quadro offline inspirado no workflow das squads para pequenos controles pessoais.",
    description:
      "O board salva tarefas no localStorage (postura_kanban_{email}) com colunas A Fazer, Em Progresso e Concluído; não depende de API.",
    steps: [
      {
        title: "Sincronizar com a identidade logada",
        detail:
          "O código extrai o e-mail do postura_user para gerar uma chave exclusiva em localStorage por usuário.",
      },
      {
        title: "Adicionar tarefas",
        detail:
          "Os inputs permitem informar título, descrição e prazo; cada tarefa ganha um id único (timestamp + random).",
      },
      {
        title: "Editar/arrastar",
        detail:
          "É possível abrir modal de edição, mudar coluna ou arrastar tarefas entre colunas (drag events no DOM).",
      },
      {
        title: "Persistência automática",
        detail:
          "Cada alteração no board salva o JSON completo na chave postura_kanban_<email>, garantindo estado offline.",
      },
    ],
    notes: [
      "Por ser local, o board serve como apoio rápido sem interferir nas rotas que efetivamente integram com Jira.",
    ],
  },
];

export default function ChangelogManualPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const heroSurface = cn(
    "relative overflow-hidden rounded-3xl border px-6 py-6",
    isDark
      ? "border-white/5 bg-gradient-to-br from-[#080f24] via-[#050816] to-[#05060f] text-zinc-100"
      : "border-slate-200 bg-white text-slate-800"
  );
  const cardSurface = cn(
    "rounded-3xl border",
    isDark ? "border-white/5 bg-[#050816]/80" : "border-slate-200 bg-white"
  );

  return (
    <DashboardShell
      pageTitle="Manual Operacional"
      pageSubtitle="Guia definitivo para navegar todas as rotas do Postura SM."
    >
      <div className="flex flex-col gap-6 px-4 pb-16 lg:px-10">
        <section className={heroSurface}>
          <div className="absolute inset-y-0 right-6 hidden w-56 rounded-full bg-gradient-to-b from-sky-500/30 via-purple-500/20 to-amber-400/20 blur-3xl md:block" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-zinc-400">
                <NotebookPen className="h-3.5 w-3.5" />
                Manual &middot; Changelog
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold">
                  Cada rota, API e fluxo documentados em um único lugar.
                </h2>
                <p className="text-sm text-zinc-400">
                  Conteúdo produzido a partir do código das rotas em /app e dos endpoints em
                  /app/api, garantindo aderência ao que está em produção.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "flex flex-col gap-2 rounded-2xl border px-4 py-3 text-xs",
                isDark
                  ? "border-white/10 bg-white/5 text-zinc-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                <span>Última revisão</span>
                <span>Release 1.5</span>
              </div>
              <p>
                Escopo cobre 19 rotas autenticadas, fluxos de MFA e 17 endpoints públicos em /api.
              </p>
            </div>
          </div>
        </section>

        <section className={cardSurface}>
          <CardHeader className="pb-4 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                  Sumário
                </p>
                <CardTitle className="text-lg">Mapa das sessões</CardTitle>
              </div>
              <Link
                href="/changelog"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition",
                  isDark
                    ? "border-white/10 text-white hover:bg-white/5"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                )}
              >
                <BookMarked className="h-3.5 w-3.5" />
                Ver releases
              </Link>
            </div>
          </CardHeader>
          <Separator className={isDark ? "border-white/5" : "border-slate-200"} />
          <CardContent className="pt-3">
            <ol className="grid gap-2 md:grid-cols-2">
              {manualSections.map((section, index) => {
                const step = String(index + 1).padStart(2, "0");
                return (
                  <li key={section.id}>
                    <Link
                      href={`#${section.id}`}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                        isDark
                          ? "border-white/5 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                            isDark
                              ? "bg-white/10 text-white"
                              : "bg-white text-slate-800 shadow-sm"
                          )}
                        >
                          {step}
                        </span>
                        <span className="truncate leading-tight">{section.title}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </section>

        {manualSections.map((section) => (
          <Card
            key={section.id}
            id={section.id}
            className={cn(
              "scroll-mt-24",
              isDark ? "border-white/5 bg-[#040612]/80" : "border-slate-200 bg-white"
            )}
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.summary}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em]",
                    isDark
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-200"
                      : "border-purple-200 bg-purple-50 text-purple-700"
                  )}
                >
                  Sessão
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-3">
                {section.routes.map((route) => (
                  <Badge
                    key={`${section.id}-${route}`}
                    variant="outline"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      isDark
                        ? "border-white/10 text-zinc-200"
                        : "border-slate-200 text-slate-700"
                    )}
                  >
                    {route}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{section.description}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                  Passo a passo
                </p>
                <ol className="mt-4 space-y-3">
                  {section.steps.map((step, index) => {
                    const stepNumber = String(index + 1).padStart(2, "0");
                    return (
                      <li
                        key={`${section.id}-step-${stepNumber}`}
                        className={cn(
                          "flex gap-3 rounded-2xl border px-4 py-3",
                          isDark
                            ? "border-white/5 bg-white/5 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-800"
                        )}
                      >
                        <span className="text-xs font-semibold text-purple-400">
                          {stepNumber}
                        </span>
                        <div>
                          <p className="font-semibold">{step.title}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-300">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              {section.apis?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                    APIs relacionadas
                  </p>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {section.apis.map((api) => (
                      <div
                        key={`${section.id}-${api.method}-${api.path}`}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-sm",
                          isDark
                            ? "border-white/10 bg-black/30 text-zinc-200"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase",
                            api.method === "GET"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : api.method === "POST"
                              ? "bg-sky-500/10 text-sky-700"
                              : "bg-amber-500/10 text-amber-700"
                          )}
                        >
                          {api.method}
                        </span>
                        <code className="mt-2 block font-mono text-xs">{api.path}</code>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {api.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {section.notes?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                    Observações
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-500 dark:text-zinc-300">
                    {section.notes.map((note, noteIndex) => (
                      <li key={`${section.id}-note-${noteIndex}`}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
