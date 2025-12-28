import { notFound } from "next/navigation";
import PlaybookDetailClient from "./playbook-detail-client";

type Params = Promise<{ id: string }>;

type PageProps = {
  params: Params;
};

export default async function PlaybookDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) {
    notFound();
  }
  return <PlaybookDetailClient playbookId={id} />;
}
