import { BaseSdAssetDetail } from "@/components/base-sd/base-sd-asset-detail";

export default async function BaseSdAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const assetId = Number(resolvedParams?.id ?? 0);
  return <BaseSdAssetDetail assetId={assetId} />;
}
