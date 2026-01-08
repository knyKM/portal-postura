#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/opt/apps/frontend"
REMOTE="origin"

# Evita pager do git (acaba com "(END)" / less)
export GIT_PAGER=cat

# Bloqueios de segurança (ajuste conforme sua realidade)
BLOCK_PATTERNS=(
  '^\.env$'
  '^\.env\.'
  '\.pem$'
  '\.p12$'
  '\.pfx$'
  '^id_rsa$'
  '^id_ed25519$'
  '\.key$'
  '\.crt$'
  '\.kube/config$'
  '\.aws/credentials$'
)

# Diretórios/arquivos que NÃO deveriam ser versionados (Next/Node)
DEFAULT_IGNORES=(
  ".next/"
  "node_modules/"
  "out/"
  ".turbo/"
  ".cache/"
)

# ===== Funções utilitárias =====
die() { echo "❌ $*" >&2; exit 1; }
warn() { echo "⚠️  $*" >&2; }
ok() { echo "✅ $*"; }

confirm() {
  local prompt="${1:-Confirmar?}"
  read -r -p "$prompt [y/N]: " ans
  [[ "${ans,,}" == "y" || "${ans,,}" == "yes" ]]
}

# ===== Checagens iniciais =====
[[ "$(id -u)" -ne 0 ]] || die "Não rode como root. Use o usuário deploy."
[[ -d "$REPO_DIR/.git" ]] || die "Não encontrei repositório em $REPO_DIR/.git"

cd "$REPO_DIR" || die "Falha ao entrar em $REPO_DIR"

# Confirma remote
git remote get-url "$REMOTE" >/dev/null 2>&1 || die "Remote '$REMOTE' não existe. Rode: git remote -v"

# Branch atual
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
[[ -n "$BRANCH" && "$BRANCH" != "HEAD" ]] || die "Não consegui identificar a branch atual (detached HEAD?)."

# ===== Garanta ignores básicos =====
ensure_gitignore() {
  local changed=0
  [[ -f .gitignore ]] || : > .gitignore

  for entry in "${DEFAULT_IGNORES[@]}"; do
    if ! grep -qxF "$entry" .gitignore; then
      echo "$entry" >> .gitignore
      changed=1
    fi
  done

  if [[ "$changed" -eq 1 ]]; then
    ok "Atualizei .gitignore com padrões (Next/Node caches)."
  fi
}

ensure_gitignore

# Se algo desses já estiver rastreado, remove do index (sem apagar do disco)
cleanup_tracked_junk() {
  local removed=0

  for entry in "${DEFAULT_IGNORES[@]}"; do
    # remove trailing slash pra checar no git ls-files
    local check="${entry%/}"
    if git ls-files --error-unmatch "$check" >/dev/null 2>&1; then
      warn "Detectei '$entry' sendo rastreado. Vou remover do index (git rm --cached)."
      git rm -r --cached "$check" >/dev/null 2>&1 || true
      removed=1
    fi
  done

  if [[ "$removed" -eq 1 ]]; then
    ok "Removi lixo rastreado do index. Ele continuará existindo no disco, mas não irá mais para o repo."
    ok "Incluirei .gitignore no stage para registrar a correção."
    git add .gitignore >/dev/null 2>&1 || true
  fi
}

cleanup_tracked_junk

# ===== Status & mudanças =====
echo "📌 Repositório: $REPO_DIR"
echo "📌 Remote:      $REMOTE -> $(git remote get-url "$REMOTE")"
echo "📌 Branch:      $BRANCH"
echo

# Status sem pager
git -c core.pager=cat status -sb
echo

# Se não há mudanças, sair
if git diff --quiet && git diff --cached --quiet; then
  ok "Nenhuma alteração para commitar."
  exit 0
fi

# Mostrar resumo das mudanças (sem detalhar milhares de arquivos)
echo "📎 Resumo (diff --stat):"
git -c core.pager=cat diff --stat
echo

# ===== Seleção de staging =====
echo "Como você quer adicionar arquivos?"
echo "  1) Tudo (git add .) [ignores aplicados]"
echo "  2) Interativo (git add -p)  [mais seguro]"
echo "  3) Cancelar"
read -r -p "Escolha [1/2/3]: " mode

case "$mode" in
  1) git add . >/dev/null 2>&1 ;;
  2) git add -p ;;
  3) die "Cancelado." ;;
  *) die "Opção inválida." ;;
esac

echo
echo "🧾 O que está staged (vai pro commit):"

# Evita despejar 3000 linhas na tela:
STAGED_COUNT="$(git diff --cached --name-only | wc -l | tr -d ' ')"

if [[ "$STAGED_COUNT" -le 200 ]]; then
  git -c core.pager=cat diff --cached --name-status
else
  echo "⚠️  Muitos arquivos staged ($STAGED_COUNT). Mostrando apenas os 80 primeiros:"
  git -c core.pager=cat diff --cached --name-status | head -n 80
  echo "… (lista truncada)"
fi
echo

# ===== Bloqueio de segredos =====
STAGED_FILES="$(git diff --cached --name-only || true)"
if [[ -n "$STAGED_FILES" ]]; then
  while IFS= read -r f; do
    for pat in "${BLOCK_PATTERNS[@]}"; do
      if [[ "$f" =~ $pat ]]; then
        die "Arquivo sensível detectado no stage: '$f' (regex: $pat). Remova do stage e adicione ao .gitignore."
      fi
    done
  done <<< "$STAGED_FILES"
else
  die "Nada staged para commitar (você provavelmente rejeitou tudo no modo interativo)."
fi

# ===== Mensagem do commit =====
COMMIT_MSG="${1:-}"
if [[ -z "$COMMIT_MSG" ]]; then
  echo "Digite a mensagem do commit (obrigatório):"
  read -r COMMIT_MSG
fi
[[ -n "$COMMIT_MSG" ]] || die "Mensagem vazia. Cancelado."

echo
echo "📝 Commit message:"
echo "  $COMMIT_MSG"
echo

confirm "Confirmar commit com esses arquivos?" || die "Cancelado pelo usuário."

# ===== Commit =====
git commit -m "$COMMIT_MSG" >/dev/null 2>&1 || die "Falha ao commitar."
ok "Commit criado."

# ===== Pull com rebase antes do push =====
echo
if confirm "Fazer 'git pull --rebase' antes do push?"; then
  git pull --rebase "$REMOTE" "$BRANCH"
fi

# ===== Push =====
echo
confirm "Confirmar PUSH para $REMOTE/$BRANCH?" || die "Push cancelado."
git push "$REMOTE" "$BRANCH"
ok "Push realizado com sucesso."

