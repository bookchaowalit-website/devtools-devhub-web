import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  CircleCheck,
  Code2,
  Command,
  Database,
  FileCode2,
  Github,
  Globe2,
  Mail,
  Network,
  Terminal,
  Twitter,
  Zap,
} from "lucide-react";
import { API_CATALOG } from "@/lib/api-catalog";

const iconMap = {
  code: Code2,
  file: FileCode2,
  book: BookOpen,
  database: Database,
  globe: Globe2,
} as const;

const methodRows = [
  { method: "GET", path: "/api/mcp", label: "discover" },
  { method: "POST", path: "/api/mcp", label: "call tool" },
  { method: "GET", path: "/api/health", label: "health check" },
];

export default function HomePage() {
  const endpointCount = API_CATALOG.reduce((sum, api) => sum + api.endpoints, 0);

  return (
    <div className="devhub-home">
      <div className="devhub-cord devhub-cord-one" aria-hidden="true" />
      <div className="devhub-cord devhub-cord-two" aria-hidden="true" />
      <div className="devhub-cord devhub-cord-three" aria-hidden="true" />

      <header className="devhub-nav">
        <Link href="/" className="devhub-mark" aria-label="DevHub home">
          <span className="devhub-mark-icon"><Network size={17} /></span>
          <span><strong>DEVHUB</strong><small>book / api fabric</small></span>
        </Link>
        <nav className="devhub-nav-links" aria-label="Primary navigation">
          <Link href="#catalog">catalog</Link><Link href="/docs">docs</Link><Link href="/playground">playground</Link>
        </nav>
        <Link href="/playground" className="devhub-nav-cta"><Terminal size={15} /> open console</Link>
      </header>

      <main id="main-content">
        <section className="devhub-hero" aria-labelledby="devhub-title">
          <div className="devhub-hero-copy">
            <p className="devhub-kicker"><span /> api routing layer / 2026</p>
            <h1 id="devhub-title">The shortest path<br /><em>from idea to call.</em></h1>
            <p className="devhub-hero-lede">A live developer portal for the portfolio APIs and MCP services that power the Book ecosystem. Find a surface, read the contract, then run it.</p>
            <div className="devhub-actions">
              <Link href="/playground" className="devhub-button devhub-button-primary"><Zap size={16} /> launch playground <ArrowUpRight size={15} /></Link>
              <Link href="/docs" className="devhub-button devhub-button-quiet">browse docs <ChevronRight size={15} /></Link>
            </div>
            <div className="devhub-proofline"><CircleCheck size={14} /><span>catalog sourced from live service definitions</span></div>
          </div>

          <div className="devhub-console" aria-label="Example API request">
            <div className="devhub-console-topline"><span className="devhub-console-dots"><i /><i /><i /></span><span>request / 001</span><span className="devhub-console-status"><b /> online</span></div>
            <div className="devhub-console-stage">
              <div className="devhub-console-path"><span>POST</span> https://api.bookchaowalit.com/mcp</div>
              <div className="devhub-console-code"><span className="syntax-muted">&#123;</span><br /><span className="syntax-key">&nbsp;&nbsp;&quot;tool&quot;</span><span className="syntax-muted">: </span><span className="syntax-string">&quot;portfolio.projects&quot;</span><span className="syntax-muted">,</span><br /><span className="syntax-key">&nbsp;&nbsp;&quot;input&quot;</span><span className="syntax-muted">: &#123; </span><span className="syntax-key">&quot;status&quot;</span><span className="syntax-muted">: </span><span className="syntax-string">&quot;live&quot;</span><span className="syntax-muted"> &#125;</span><br /><span className="syntax-muted">&#125;</span></div>
              <div className="devhub-console-response"><div><span className="syntax-green">200 OK</span><span className="syntax-muted"> · 118ms</span></div><div className="devhub-response-line"><span className="syntax-key">&quot;results&quot;</span><span className="syntax-muted">: </span><span className="syntax-string">[ 12 projects ]</span></div></div>
            </div>
            <div className="devhub-console-footer"><span><Command size={13} /> live browser playground</span><span>⌘ ↵ run</span></div>
          </div>
        </section>

        <section className="devhub-signal-row" aria-label="DevHub facts">
          <div><span className="devhub-signal-value">{API_CATALOG.length}</span><span>registered APIs</span></div><div><span className="devhub-signal-value">{endpointCount}</span><span>documented endpoints</span></div><div><span className="devhub-signal-value">MCP</span><span>tool-aware surface</span></div><div><span className="devhub-signal-value">LIVE</span><span>catalog status</span></div>
        </section>

        <section id="catalog" className="devhub-section">
          <div className="devhub-section-heading"><div><p className="devhub-eyebrow">01 / service fabric</p><h2>Choose a line to pull.</h2></div><p>Each service keeps its own domain, docs, and request shape. The catalog is the shared map.</p></div>
          <div className="devhub-api-grid">
            {API_CATALOG.map((api, index) => { const Icon = iconMap[api.icon]; return (
              <Link key={api.id} href={`/apis/${api.id}`} className="devhub-api-node">
                <div className="devhub-node-head"><span className="devhub-node-index">0{index + 1}</span><span className="devhub-node-status"><b /> {api.status}</span></div>
                <div className="devhub-node-icon"><Icon size={20} /></div><h3>{api.name}</h3><p>{api.description}</p>
                <div className="devhub-node-tags">{api.features.slice(0, 2).map((feature) => <span key={feature}>{feature}</span>)}</div>
                <div className="devhub-node-foot"><span>{api.endpoints} endpoints</span><ArrowUpRight size={16} /></div>
              </Link>
            ); })}
          </div>
        </section>

        <section className="devhub-section devhub-section-split">
          <div><p className="devhub-eyebrow">02 / first request</p><h2>Read the wire<br /><em>before you write the app.</em></h2><p className="devhub-section-copy">The portal keeps discovery, documentation, and testing in one continuous handoff.</p><Link href="/docs" className="devhub-text-link">read the integration guide <ArrowUpRight size={15} /></Link></div>
          <div className="devhub-method-list">{methodRows.map((row) => <div key={`${row.method}-${row.path}`} className="devhub-method-row"><span className="devhub-method">{row.method}</span><code>{row.path}</code><span className="devhub-method-label">{row.label}</span></div>)}</div>
        </section>
      </main>

      <footer className="devhub-footer"><div><Network size={16} /><span>DEVHUB / by Chaowalit Greepoke</span></div><div className="devhub-footer-links"><a href="https://github.com/bookchaowalit" target="_blank" rel="noreferrer"><Github size={14} /> github</a><a href="mailto:bookchaowalit@gmail.com"><Mail size={14} /> contact</a><a href="https://twitter.com/bookchaowalit" target="_blank" rel="noreferrer"><Twitter size={14} /> twitter</a></div></footer>
    </div>
  );
}
