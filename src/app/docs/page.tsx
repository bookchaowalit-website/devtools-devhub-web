import type { Metadata } from "next";
import { DocsView } from "@/components/devhub-views";
import { API_CATALOG } from "@/lib/api-catalog";

export const metadata: Metadata = { title: "Quick start | DevHub", description: "Call a DevHub MCP API in three steps.", alternates: { canonical: "/docs" } };

export default function DocsPage() {
  return <DocsView catalog={API_CATALOG} />;
}
