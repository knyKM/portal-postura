# Portal Postura (Postura SM | Vivo)

Frontend do **Portal Postura / Postura Security Management** (Postura SM | Vivo).

Pelo output atual do projeto, trata-se de uma aplicação **Next.js** (App Router) com rotas autenticadas e uma página de **Changelog** em `/changelog`.

---

## Visão geral

- **Título/Branding:** `Postura SM | Vivo`
- **Descrição (meta):** “Plataforma Postura Security Management da Vivo”
- **Rota observada:** `/changelog`
- **Estrutura observada:**
  - `app/layout.tsx` (RootLayout)
  - `app/(authenticated)/layout.tsx` (AuthenticatedLayout)
  - `app/(authenticated)/changelog/page.tsx` (Changelog page)
- **Tema:** provider em `components/theme/theme-provider.tsx`
- **Página de erro 404 customizada:** `components/errors/not-found-tetris.tsx`
- **Favicons:** `/favicon.ico` e `/logo_vivo_sem_fundo.png`

---

## Requisitos

- Node.js (recomendado: LTS)
- npm / yarn / pnpm (use o gerenciador adotado pelo projeto)

---

## Como rodar em desenvolvimento

Instalar dependências:

```bash
npm install
