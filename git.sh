#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/opt/apps/frontend"
REMOTE="origin"

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

# ===== Status & mudanças =====
echo "📌 Repositório: $REPO_DIR"
echo "📌 Remote:      $REMOTE -> $(git remote get-url "$REMOTE")"
echo "📌 Branch:      $BRANCH"
echo

git status -sb
echo

# Se não há mudanças, sair
if git diff --quiet && git diff --cached --quiet; then
  ok "Nenhuma alteração para commitar."
  exit 0
fi

# Mostrar resumo das mudanças
echo "📎 Resumo (diff --stat):"
git diff --stat
echo

# ===== Seleção de staging =====
echo "Como você quer adicionar arquivos?"
echo "  1) Tudo (git add .)"
echo "  2) Interativo (git add -p)  [mais seguro]"
echo "  3) Cancelar"
read -r -p "Escolha [1/2/3]: " mode

case "$mode" in
  1) git add . ;;
  2) git add -p ;;
  3) die "Cancelado." ;;
  *) die "Opção inválida." ;;
esac

echo
echo "🧾 O que está staged (vai pro commit):"
git diff --cached --name-status
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
git commit -m "$COMMIT_MSG"
ok "Commit criado."

# ===== Pull com rebase antes do push =====
# Evita rejeição por histórico divergente e mantém histórico limpo.
echo
confirm "Fazer 'git pull --rebase' antes do push?" && git pull --rebase "$REMOTE" "$BRANCH"

# ===== Push =====
echo
confirm "Confirmar PUSH para $REMOTE/$BRANCH?" || die "Push cancelado."
git push "$REMOTE" "$BRANCH"
ok "Push realizado com sucesso."

