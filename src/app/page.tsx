import { CatalogView } from "@/components/devhub-views";
import { API_CATALOG } from "@/lib/api-catalog";

export default function HomePage() {
  return <CatalogView catalog={API_CATALOG} />;
}
