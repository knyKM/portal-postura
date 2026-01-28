import { ContractForm } from "@/components/contracts/contract-form";

export default async function EditarContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const contractId = Number(resolvedParams?.id ?? 0);
  return <ContractForm mode="edit" contractId={contractId} />;
}
