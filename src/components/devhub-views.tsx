import Link from "next/link";
import { ArticleHeader, EmptyState, EntryList, Pager, Prose, ReaderHead, TableScroll, neighbours, plural } from "@/components/reader-shell";
import { DevhubFrame } from "@/components/devhub-frame";
import { type ApiEntry, exampleRequest } from "@/lib/api-catalog";

export const PROTOCOL_METHODS = [
  { method: "initialize", detail: "Start a session. Returns the server's capabilities and protocol version." },
  { method: "tools/list", detail: "List the tools the server offers, with their input schemas." },
  { method: "tools/call", detail: "Run one tool by name with its arguments. Returns the tool's result." },
];

export function curlFor(url: string, body: unknown): string {
  return `curl -X POST ${url} \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(body, null, 2)}'`;
}

function Code({ label, children }: { label: string; children: string }) {
  return <pre tabIndex={0} aria-label={label}><code>{children}</code></pre>;
}

/** Home: what DevHub is, then the catalog as cards. */
export function CatalogView({ catalog }: { catalog: ApiEntry[] }) {
  const tools = catalog.reduce((sum, api) => sum + api.endpoints, 0);
  const first = catalog[0];
  return (
    <DevhubFrame current="catalog">
      <ReaderHead
        eyebrow="Developer portal"
        title="MCP APIs across the Bookchaowalit portfolio"
        lede={`${plural(catalog.length, "service")} with ${plural(tools, "documented tool")}. Read each contract here, then call it from the Playground.`}
      >
        <Link className="rs-button" href="/playground">Open the Playground</Link>
        <Link className="rs-plain" href="/docs">Read the quick start</Link>
      </ReaderHead>

      <section aria-labelledby="catalog-title">
        <div className="rs-section-head"><h2 id="catalog-title">Catalog</h2></div>
        {catalog.length === 0 ? (
          <EmptyState title="No APIs in the catalog yet" headingLevel={3}>Add an entry to src/lib/api-catalog.ts to list a service here.</EmptyState>
        ) : (
          <EntryList
            layout="cards"
            headingLevel={3}
            entries={catalog.map((api) => ({
              href: `/apis/${api.id}`,
              title: api.name,
              summary: api.description,
              meta: [api.category, plural(api.endpoints, "tool")],
              tags: api.features.slice(0, 2),
            }))}
          />
        )}
      </section>

      {first ? (
        <section aria-labelledby="wire-title">
          <div className="rs-section-head"><h2 id="wire-title">A first request</h2></div>
          <Prose>
            <p>Every service speaks JSON-RPC 2.0 over one <code>POST /api/mcp</code> route. This is the first documented call of the {first.name}, exactly as the Playground sends it:</p>
            <Code label={`Example request to the ${first.name}`}>{curlFor(first.url, exampleRequest(first))}</Code>
          </Prose>
        </section>
      ) : null}
    </DevhubFrame>
  );
}

/** One API's contract: endpoint, tools, and two copyable requests, then previous / next in catalog order. */
export function ApiView({ api, catalog }: { api: ApiEntry; catalog: ApiEntry[] }) {
  const { previous, next } = neighbours(catalog, catalog.findIndex((entry) => entry.id === api.id));
  return (
    <DevhubFrame current="catalog">
      <article className="rs-article">
        <ArticleHeader back={{ href: "/", label: "Catalog" }} tags={api.features} title={api.name} lede={api.longDescription || api.description} meta={[`${api.category} API`, plural(api.endpoints, "tool")]} />
        <Prose>
          <h2>Endpoint</h2>
          <p><code>{api.url}</code></p>
          <h2>Tools</h2>
          <TableScroll label={`${api.name} tools`}>
            <table>
              <thead><tr><th scope="col">Tool</th><th scope="col">Method</th><th scope="col">What it does</th></tr></thead>
              <tbody>{api.tools.map((tool) => <tr key={tool.name}><td><code>{tool.name}</code></td><td><code>{tool.method}</code></td><td>{tool.description}</td></tr>)}</tbody>
            </table>
          </TableScroll>
          <h2>Quick start</h2>
          <p>List the tools the server offers:</p>
          <Code label="List tools request">{curlFor(api.url, { jsonrpc: "2.0", id: 1, method: "tools/list" })}</Code>
          <p>Then try the first documented operation:</p>
          <Code label="First operation request">{curlFor(api.url, exampleRequest(api))}</Code>
          <p>Or send it from your browser in the <Link href="/playground">Playground</Link>.</p>
        </Prose>
        <Pager label="More APIs" previous={previous ? { href: `/apis/${previous.id}`, title: previous.name } : undefined} next={next ? { href: `/apis/${next.id}`, title: next.name } : undefined} />
      </article>
    </DevhubFrame>
  );
}

const DOC_EXAMPLE_URL = "https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp";

/** The quick start guide. */
export function DocsView({ catalog }: { catalog: ApiEntry[] }) {
  return (
    <DevhubFrame current="docs">
      <article className="rs-article">
        <ArticleHeader title="Quick start" lede="Call any DevHub API in three steps. Every one speaks the Model Context Protocol (MCP): JSON-RPC 2.0 over a single POST route." />
        <Prose>
          <h2>1. Choose an API</h2>
          <p>The catalog lists {plural(catalog.length, "service")}:</p>
          <ul>{catalog.map((api) => <li key={api.id}><Link href={`/apis/${api.id}`}>{api.name}</Link> — {api.description}.</li>)}</ul>
          <h2>2. Find its endpoint</h2>
          <p>Each API page shows its MCP endpoint URL and the tools it documents.</p>
          <h2>3. Send a request</h2>
          <p>POST a JSON-RPC 2.0 body with the method you want. cURL:</p>
          <Code label="cURL example">{curlFor(DOC_EXAMPLE_URL, { jsonrpc: "2.0", id: 1, method: "tools/list" })}</Code>
          <p>JavaScript:</p>
          <Code label="JavaScript example">{`const response = await fetch("${DOC_EXAMPLE_URL}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),\n});\nconst data = await response.json();`}</Code>
          <p>Python:</p>
          <Code label="Python example">{`import requests\n\nresponse = requests.post(\n    "${DOC_EXAMPLE_URL}",\n    json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"},\n)\ndata = response.json()`}</Code>
          <h2>Protocol methods</h2>
          <TableScroll label="MCP methods">
            <table>
              <thead><tr><th scope="col">Method</th><th scope="col">What it does</th></tr></thead>
              <tbody>{PROTOCOL_METHODS.map((row) => <tr key={row.method}><td><code>{row.method}</code></td><td>{row.detail}</td></tr>)}</tbody>
            </table>
          </TableScroll>
          <h2>Response format</h2>
          <p>Responses follow JSON-RPC 2.0: the same <code>id</code>, and either a <code>result</code> or an <code>error</code>.</p>
          <Code label="Example response">{`{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "result": {\n    "tools": [\n      {\n        "name": "get_projects",\n        "description": "Get all projects",\n        "inputSchema": { "type": "object", "properties": {} }\n      }\n    ]\n  }\n}`}</Code>
          <h2>Try it</h2>
          <p>The <Link href="/playground">Playground</Link> sends these requests from your browser and shows the raw response.</p>
        </Prose>
      </article>
    </DevhubFrame>
  );
}

export function NotFoundView() {
  return (
    <DevhubFrame>
      <ReaderHead eyebrow="404" title="Page not found" lede="The page you asked for does not exist." />
      <EmptyState title="Where to next" action={<Link className="rs-button" href="/">Back to the catalog</Link>}>Every API has a page under the catalog.</EmptyState>
    </DevhubFrame>
  );
}
