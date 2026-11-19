import type { ReactNode } from "react";
import { Reader, ReaderFoot, ReaderTop } from "@/components/reader-shell";

export const SOURCE = "https://github.com/bookchaowalit-website/devtools-devhub-web";

export type Section = "catalog" | "docs" | "playground" | undefined;

/** Every DevHub page: Reader shell top bar, one <main id="main">, and the shared footer. */
export function DevhubFrame({ current, children }: { current?: Section; children: ReactNode }) {
  return (
    <Reader>
      <ReaderTop
        name="DevHub"
        tagline="MCP API catalog"
        links={[
          { href: "/", label: "Catalog", current: current === "catalog" },
          { href: "/docs", label: "Docs", current: current === "docs" },
          { href: "/playground", label: "Playground", current: current === "playground" },
        ]}
      />
      <main id="main" className="rs-main">{children}</main>
      <ReaderFoot
        source={SOURCE}
        note="The catalog is written in this repository from each service's /api/mcp route. DevHub does not check whether a service is up; the Playground calls it live from your browser."
      />
    </Reader>
  );
}
