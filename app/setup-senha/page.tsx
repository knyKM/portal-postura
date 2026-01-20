import type { Metadata } from "next";
import { PasswordSetupForm } from "@/components/auth/password-setup-form";

export const metadata: Metadata = {
  title: "Definir senha · Postura SM",
};

type SetupPageProps = {
  searchParams?: Promise<{ token?: string }>;
};

export default async function SetupSenhaPage({ searchParams }: SetupPageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token ?? "";
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#030516] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#050816] p-6">
        <h1 className="text-xl font-semibold">Definir senha</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Crie sua senha para acessar a plataforma. O link expira em 24 horas.
        </p>
        <PasswordSetupForm token={token} />
      </div>
    </div>
  );
}
