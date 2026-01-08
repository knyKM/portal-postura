"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Falha ao autenticar.");
      }

      if (data?.mfaSetupRequired && data?.token) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "postura_pending_user",
            JSON.stringify(data?.user ?? null)
          );
          window.location.assign(
            `/login/mfa-setup?token=${encodeURIComponent(data.token)}`
          );
          return;
        }
        router.replace(
          `/login/mfa-setup?token=${encodeURIComponent(data.token)}`
        );
        return;
      }

      if (data?.mfaRequired && data?.token) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "postura_pending_user",
            JSON.stringify(data?.user ?? null)
          );
          window.location.assign(
            `/login/mfa-verify?token=${encodeURIComponent(data.token)}`
          );
          return;
        }
        router.replace(
          `/login/mfa-verify?token=${encodeURIComponent(data.token)}`
        );
        return;
      }

      const user = data?.user;

      if (user && typeof window !== "undefined") {
        localStorage.setItem("postura_user", JSON.stringify(user));
      }

      router.replace("/vulnerabilidades/insights");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível processar o login."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">Acessar sua conta</CardTitle>
        <CardDescription className="text-zinc-400">
          Utilize suas credenciais corporativas para entrar no Postura SM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              E-mail corporativo
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Mail className="h-4 w-4 text-zinc-400" />
              <Input
                type="email"
                autoComplete="off"
                placeholder="seu.nome@empresa.com"
                className="h-10 border-none bg-transparent p-0 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Senha</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Lock className="h-4 w-4 text-zinc-400" />
              <Input
                type="password"
                placeholder="Digite sua senha"
                className="h-10 border-none bg-transparent p-0 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-300">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
          <span className="h-px flex-1 bg-white/10" />
          ou
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled
          className="w-full rounded-xl border-white/20 bg-transparent text-xs font-medium text-white hover:bg-white/10"
        >
          Entrar com SSO (em breve)
        </Button>
        <p className="text-center text-[11px] text-zinc-500">
          Ambiente de demonstração seguro · v1.5.0
        </p>
      </CardFooter>
    </Card>
  );
}
