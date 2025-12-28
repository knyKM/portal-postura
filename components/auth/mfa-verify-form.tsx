"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Props = {
  token: string;
};

export function MfaVerifyForm({ token }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("postura_pending_user");
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch {
        setUserInfo(null);
      }
    }
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Informe o código gerado no aplicativo.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Não foi possível validar o código.");
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
          : "Ocorreu um erro ao confirmar o MFA."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardHeader className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300">
          Autenticação multifator
        </p>
        <CardTitle className="text-2xl">Confirme seu acesso</CardTitle>
        <CardDescription className="text-zinc-400">
          Digite o código exibido no app autenticador cadastrado para{" "}
          {userInfo?.email ?? "seu usuário"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Código de 6 dígitos
            </label>
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="123 456"
              inputMode="numeric"
              className="h-12 rounded-xl border-white/10 bg-white/5 text-center text-lg tracking-[0.4em] text-white placeholder:text-zinc-500 focus-visible:ring-0"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-300">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-sm font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Validando..." : "Confirmar e acessar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-zinc-400">
        Verificação protegida por MFA. Se não estiver com o dispositivo,
        contate um administrador.
      </CardFooter>
    </Card>
  );
}
