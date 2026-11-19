import type { Metadata } from "next";
import { Playground } from "@/components/playground";
import { API_CATALOG } from "@/lib/api-catalog";

export const metadata: Metadata = { title: "Playground | DevHub", description: "Send a JSON-RPC request to a DevHub MCP API from your browser.", alternates: { canonical: "/playground" } };

export default function PlaygroundPage() {
  return <Playground catalog={API_CATALOG} />;
}
