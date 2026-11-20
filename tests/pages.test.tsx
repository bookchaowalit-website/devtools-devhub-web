import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import ApiPage, { generateMetadata, generateStaticParams } from "@/app/apis/[id]/page";
import DocsPage from "@/app/docs/page";
import PlaygroundPage from "@/app/playground/page";
import NotFound from "@/app/not-found";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CatalogView } from "@/components/devhub-views";
import { API_CATALOG } from "@/lib/api-catalog";

describe("home", () => {
  const html = renderToString(<HomePage />);
  it("has one h1, every API as a card linking to its page, and the hub footer", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    for (const api of API_CATALOG) expect(html).toContain(`href="/apis/${api.id}"`);
    expect(html).toContain('href="https://bookchaowalit.com/"');
    expect(html).toContain('href="#main"');
  });
  it("makes no unmeasured claims", () => {
    for (const claim of ["118ms", "200 OK", "12 projects", "online", "99.99"]) expect(html).not.toContain(claim);
  });
  it("shows an empty state for an empty catalog", () => {
    const empty = renderToString(<CatalogView catalog={[]} />);
    expect(empty).toContain("No APIs in the catalog yet");
    expect(empty).not.toContain("A first request");
  });
});

describe("api page", () => {
  it("renders the contract, a tools table and previous / next links", async () => {
    const html = renderToString(await ApiPage({ params: Promise.resolve({ id: "techblog" }) }));
    expect(html).toContain("Tech Blog API");
    expect(html).toContain("<table>");
    expect(html).toContain('rel="prev"');
    expect(html).toContain('rel="next"');
    expect(html).toContain("https://bookchaowalit-techblog-frontend.vercel.app/api/mcp");
  });
  it("has no previous link on the first API", async () => {
    const html = renderToString(await ApiPage({ params: Promise.resolve({ id: API_CATALOG[0].id }) }));
    expect(html).not.toContain('rel="prev"');
  });
  it("prerenders every API and sets a canonical per page", async () => {
    expect(generateStaticParams()).toEqual(API_CATALOG.map(({ id }) => ({ id })));
    const meta = await generateMetadata({ params: Promise.resolve({ id: "mcp" }) });
    expect(meta.alternates?.canonical).toBe("/apis/mcp");
    expect(await generateMetadata({ params: Promise.resolve({ id: "nope" }) })).toEqual({});
  });
  it("calls notFound for an unknown id", async () => {
    await expect(ApiPage({ params: Promise.resolve({ id: "nope" }) })).rejects.toThrow();
  });
});

describe("docs, playground and 404", () => {
  it("docs list every API and drop the invented uptime and speed claims", () => {
    const html = renderToString(<DocsPage />);
    for (const api of API_CATALOG) expect(html).toContain(api.name);
    expect(html).not.toContain("99.99");
    expect(html).not.toContain("Lightning");
  });
  it("playground starts idle with the first API selected", () => {
    const html = renderToString(<PlaygroundPage />);
    expect(html).toContain("Nothing sent yet");
    expect(html).toContain(API_CATALOG[0].url);
  });
  it("404 links back to the catalog", () => {
    const html = renderToString(<NotFound />);
    expect(html).toContain("Page not found");
    expect(html).toContain('href="/"');
  });
});

describe("site files", () => {
  it("use the devhub.bookchaowalit.com domain", () => {
    expect(robots().sitemap).toBe("https://devhub.bookchaowalit.com/sitemap.xml");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://devhub.bookchaowalit.com/");
    expect(urls).toContain("https://devhub.bookchaowalit.com/apis/portfolio");
  });
});

describe("first request examples (2026-11-19 review)", () => {
  const techblog = "https://bookchaowalit-techblog-frontend.vercel.app/api/mcp";
  const deadPortfolio = "https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp";
  it("home shows a request that runs: tools/list to an endpoint the probe confirmed, as the Playground sends it", () => {
    const html = renderToString(<HomePage />).replace(/&quot;/g, '"');
    const example = html.slice(html.indexOf("A first request"));
    expect(example).toContain(techblog);
    expect(example).toContain('"method": "tools/list"');
    expect(example).not.toContain("tools/call");
    expect(example).not.toContain(deadPortfolio);
  });
  it("the quick start examples use a working endpoint", () => {
    const html = renderToString(<DocsPage />);
    expect(html).toContain(techblog);
    expect(html).not.toContain(deadPortfolio);
  });
});
