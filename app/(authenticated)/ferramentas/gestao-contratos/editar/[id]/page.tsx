import { ContractForm } from "@/components/contracts/contract-form";

export default function EditarContratoPage({
  params,
}: {
  params: { id: string };
}) {
  const contractId = Number(params.id ?? 0);
  return <ContractForm mode="edit" contractId={contractId} />;
}
