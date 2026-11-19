"use client";

import { useState } from "react";
import { Prose, ReaderHead } from "@/components/reader-shell";
import { DevhubFrame } from "@/components/devhub-frame";
import { curlFor } from "@/components/devhub-views";
import type { ApiEntry } from "@/lib/api-catalog";

export const METHODS = [
  { name: "List tools", method: "tools/list", params: {} },
  { name: "Initialize", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "DevHub Playground", version: "1.0.0" } } },
];

export function requestBody(method: (typeof METHODS)[number]) {
  return { jsonrpc: "2.0", id: 1, method: method.method, params: method.params };
}

type Result = { state: "idle" } | { state: "loading" } | { state: "done"; status: number; body: string } | { state: "failed"; message: string };

/** Sends a real JSON-RPC request from the browser to the chosen API and shows the raw answer. */
export function Playground({ catalog, send = fetch }: { catalog: ApiEntry[]; send?: typeof fetch }) {
  const [apiId, setApiId] = useState(catalog[0]?.id ?? "");
  const [methodName, setMethodName] = useState(METHODS[0].name);
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [copied, setCopied] = useState<"" | "copied" | "failed">("");
  const api = catalog.find((entry) => entry.id === apiId) ?? catalog[0];
  const method = METHODS.find((entry) => entry.name === methodName) ?? METHODS[0];
  const body = requestBody(method);

  const run = async () => {
    if (!api) return;
    setResult({ state: "loading" });
    setCopied("");
    try {
      const res = await send(api.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON: show it as sent */ }
      setResult({ state: "done", status: res.status, body: pretty });
    } catch (error) {
      setResult({ state: "failed", message: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const copy = async () => {
    if (result.state !== "done") return;
    try {
      await navigator.clipboard.writeText(result.body);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
  };

  return (
    <DevhubFrame current="playground">
      <ReaderHead eyebrow="Playground" title="Call an API from your browser" lede="Pick a service and a method, then send. The request goes straight from this page to the service; nothing passes through DevHub." />
      {api ? (
        <>
          <form className="dh-form" onSubmit={(event) => { event.preventDefault(); void run(); }}>
            <label className="dh-field">
              <span>API</span>
              <select value={api.id} onChange={(event) => { setApiId(event.target.value); setResult({ state: "idle" }); }}>
                {catalog.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
              </select>
            </label>
            <label className="dh-field">
              <span>Method</span>
              <select value={method.name} onChange={(event) => { setMethodName(event.target.value); setResult({ state: "idle" }); }}>
                {METHODS.map((entry) => <option key={entry.name} value={entry.name}>{entry.name}</option>)}
              </select>
            </label>
            <div className="dh-send">
              <button className="rs-button" type="submit" disabled={result.state === "loading"}>{result.state === "loading" ? "Sending…" : "Send request"}</button>
            </div>
          </form>

          <section aria-labelledby="request-title">
            <div className="rs-section-head"><h2 id="request-title">Request</h2></div>
            <Prose>
              <p>POST <code>{api.url}</code></p>
              <pre tabIndex={0} aria-label="Request body"><code>{JSON.stringify(body, null, 2)}</code></pre>
            </Prose>
          </section>

          <section aria-labelledby="response-title">
            <div className="rs-section-head"><h2 id="response-title">Response</h2></div>
            <div role="status" className="dh-status">
              {result.state === "idle" ? "Nothing sent yet. Press Send request to call the API." : null}
              {result.state === "loading" ? "Waiting for the API…" : null}
              {result.state === "done" ? `HTTP ${result.status}` : null}
              {result.state === "failed" ? `The request failed: ${result.message}. The service may be down, or it may not allow requests from this site (CORS).` : null}
            </div>
            {result.state === "done" ? (
              <Prose>
                <div className="rs-code">
                  <pre tabIndex={0} aria-label="Response body"><code>{result.body}</code></pre>
                  <button type="button" className="rs-copy" onClick={copy} data-state={copied === "failed" ? "failed" : undefined}>{copied === "copied" ? "Copied" : "Copy"}</button>
                  <span role="status" className="rs-sr">{copied === "copied" ? "Response copied" : copied === "failed" ? "Copy failed" : ""}</span>
                </div>
              </Prose>
            ) : null}
          </section>

          <section aria-labelledby="curl-title">
            <div className="rs-section-head"><h2 id="curl-title">Same request with cURL</h2></div>
            <Prose>
              <pre tabIndex={0} aria-label="cURL command"><code>{curlFor(api.url, body)}</code></pre>
            </Prose>
          </section>
        </>
      ) : (
        <div className="rs-empty"><h2>No APIs to call</h2><p>The catalog is empty, so there is nothing to send a request to.</p></div>
      )}
    </DevhubFrame>
  );
}
