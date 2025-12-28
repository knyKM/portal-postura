import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Acessar Postura SM",
};

type LoginPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const isExpired = searchParams?.status === "expired";

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#030516] text-white lg:grid-cols-2">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050028] via-[#040619] to-[#060312]" />
      <div className="absolute right-0 top-0 hidden h-96 w-96 translate-x-24 -translate-y-12 rounded-full bg-purple-500/20 blur-3xl lg:block" />
      <div className="absolute left-0 bottom-0 hidden h-80 w-80 -translate-x-24 translate-y-16 rounded-full bg-indigo-600/20 blur-3xl lg:block" />

      <div className="relative flex flex-col justify-between p-8 lg:p-16">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
              <Image
                src="/logo_vivo_sem_fundo.png"
                alt="Postura"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Plataforma
              </p>
              <p className="font-semibold">Postura Security Management</p>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-zinc-300">
              Observabilidade de identidades
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Portal de Segurança Centralizada para Postura Cibernética.
            </h1>
            <p className="text-zinc-400">
              Ferramentas de apoio, indicadores em tempo real e ações automatizadas
              integradas ao Jira para elevar o nível de segurança.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-sm text-zinc-300">Ferramentas de Postura</p>
                <p className="text-2xl font-semibold text-white">+12 utilities</p>
                <p className="text-xs text-zinc-400">Automação de análises, telnet, ping e orquestrações.</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-sm text-zinc-300">Indicadores de Postura</p>
                <p className="text-2xl font-semibold text-white">24/7</p>
                <p className="text-xs text-zinc-400">Painéis de automação e ações inteligentes para o Jira.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 hidden text-sm text-zinc-400 lg:block">
          © {new Date().getFullYear()} Postura SM · Release 1.1
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-right text-xs uppercase tracking-[0.3em] text-zinc-500">
            Login seguro
          </div>
          {isExpired && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Sua sessão expirou. Entre novamente para continuar navegando.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
