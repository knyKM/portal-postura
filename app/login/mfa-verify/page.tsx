import { redirect } from "next/navigation";
import { MfaVerifyForm } from "@/components/auth/mfa-verify-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MfaVerifyPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const tokenParam = resolvedParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#030516] text-white place-items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050028] via-[#040619] to-[#060312]" />
      <div className="absolute left-0 top-0 h-80 w-80 -translate-x-32 -translate-y-20 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-32 translate-y-24 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative flex w-full max-w-5xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center lg:px-16">
        <div className="flex-1 space-y-6">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-300">
            Segunda camada
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Valide o código do seu autenticador e continue com segurança.
          </h1>
          <p className="text-zinc-400">
            Nossa camada de MFA garante que as automações e indicadores de
            postura só sejam acessados por identidades confiáveis.
          </p>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-zinc-300">
            Porta de entrada única para monitorar automações, executar ações no
            Jira e consultar indicadores em tempo real.
          </div>
        </div>

        <div className="flex-1">
          <MfaVerifyForm token={token} />
        </div>
      </div>
    </div>
  );
}
