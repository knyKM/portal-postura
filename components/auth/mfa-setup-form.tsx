"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SetupData = {
  secret: string;
  otpauthUrl: string;
  qrCode: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

type Props = {
  token: string;
};

export function MfaSetupForm({ token }: Props) {
  const router = useRouter();
  const [data, setData] = useState<SetupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setError(null);
    setLoading(true);
    fetch("/api/auth/mfa/setup/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!active) return;
        if (!res.ok) {
          throw new Error(body?.error || "Não foi possível iniciar o MFA.");
        }
        setData(body as SetupData);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Erro inesperado ao carregar configuração."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Informe o código gerado no aplicativo.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/mfa/setup/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Falha ao validar código.");
      }
      if (body?.user && typeof window !== "undefined") {
        localStorage.setItem("postura_user", JSON.stringify(body.user));
      }
      sessionStorage.removeItem("postura_pending_user");
      router.replace("/vulnerabilidades/insights");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível validar o código informado."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-32">
          <Image
            src="/logo_vivo_login_sem_fundo.png"
            alt="Vivo"
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>

        <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#050816]/80 px-8 py-8 shadow-2xl">
          <div className="mb-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300">
              Segurança adicional
            </p>
            <h1 className="text-xl font-semibold text-zinc-50">
              Ative o MFA para continuar
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Utilize um app autenticador (Google Authenticator, 1Password etc.)
              para registrar este dispositivo.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-sm text-zinc-500">
              Gerando chave segura...
            </p>
          ) : data ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <p className="text-sm text-zinc-300">
                  Escaneie o QR Code abaixo
                </p>
                <div className="mt-3 flex justify-center">
                  <Image
                    src={data.qrCode}
                    alt="QR Code MFA"
                    width={220}
                    height={220}
                    className="rounded-2xl border border-white/10 bg-white p-3"
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-[11px] text-zinc-400">
                  Usuário: {data.user.name} ({data.user.email})
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    Código manual
                  </p>
                  <p className="text-xs text-zinc-400">
                    Se não conseguir escanear, adicione manualmente:
                  </p>
                  <code className="mt-2 block rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-sm tracking-widest text-white">
                    {data.secret}
                  </code>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    Código de 6 dígitos
                  </label>
                  <Input
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="123 456"
                    inputMode="numeric"
                    className="h-11 rounded-xl border-zinc-700 bg-[#050816] text-center text-lg tracking-[0.4em] text-zinc-100"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#5b3df8] text-sm font-medium text-white shadow-lg transition-all hover:bg-[#6a4ffb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Validando..." : "Ativar MFA e continuar"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error ??
                "Não foi possível iniciar a configuração. Retorne ao login e tente novamente."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
