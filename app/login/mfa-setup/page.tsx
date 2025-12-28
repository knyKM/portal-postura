import { redirect } from "next/navigation";
import { MfaSetupForm } from "@/components/auth/mfa-setup-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MfaSetupPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const tokenParam = resolvedParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    redirect("/login");
  }

  return <MfaSetupForm token={token} />;
}
