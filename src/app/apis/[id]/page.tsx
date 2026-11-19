import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiView } from "@/components/devhub-views";
import { API_CATALOG } from "@/lib/api-catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return API_CATALOG.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const api = API_CATALOG.find((entry) => entry.id === id);
  return api ? { title: `${api.name} | DevHub`, description: api.description, alternates: { canonical: `/apis/${api.id}` } } : {};
}

export default async function ApiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = API_CATALOG.find((entry) => entry.id === id);
  if (!api) notFound();
  return <ApiView api={api} catalog={API_CATALOG} />;
}
