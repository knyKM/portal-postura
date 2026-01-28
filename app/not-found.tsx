export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#01010a] via-[#040519] to-[#06030d] px-4 py-10 text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-[#050816] px-6 py-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.4)]">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
          Página não encontrada
        </p>
        <h1 className="mt-3 text-3xl font-semibold">404</h1>
        <p className="mt-2 text-sm text-zinc-400">
          O conteúdo que você buscou não está disponível ou foi movido.
        </p>
      </div>
    </div>
  );
}
