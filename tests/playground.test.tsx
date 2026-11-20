// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Playground } from "@/components/playground";
import { API_CATALOG } from "@/lib/api-catalog";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const status = () => host.querySelector(".dh-status")?.textContent;
const submit = async () => { await act(async () => { host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }); };
function choose(select: HTMLSelectElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!.call(select, value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
function mount(send: typeof fetch, catalog = API_CATALOG) {
  act(() => root.render(<Playground catalog={catalog} send={send} />));
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("playground", () => {
  it("sends the JSON-RPC body to the chosen API and shows the pretty response", async () => {
    const send = vi.fn(async () => new Response('{"jsonrpc":"2.0","id":1,"result":{}}', { status: 200 }));
    mount(send as unknown as typeof fetch);
    const [api, method] = [...host.querySelectorAll("select")];
    choose(api, "techblog");
    choose(method, "Initialize");
    await submit();
    expect(send).toHaveBeenCalledWith("https://bookchaowalit-techblog-frontend.vercel.app/api/mcp", expect.objectContaining({ method: "POST" }));
    const body = JSON.parse((send.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.method).toBe("initialize");
    expect(status()).toBe("HTTP 200");
    expect(host.querySelector('[aria-label="Response body"]')?.textContent).toContain('"jsonrpc": "2.0"');
  });

  it("shows a non-JSON body as it came back", async () => {
    mount((async () => new Response("Bad gateway", { status: 502 })) as unknown as typeof fetch);
    await submit();
    expect(status()).toBe("HTTP 502");
    expect(host.querySelector('[aria-label="Response body"]')?.textContent).toBe("Bad gateway");
  });

  it("explains a blocked or failed request instead of failing silently", async () => {
    mount((async () => { throw new TypeError("Failed to fetch"); }) as unknown as typeof fetch);
    await submit();
    expect(status()).toContain("The request failed: Failed to fetch");
    expect(status()).toContain("CORS");
  });

  it("copies the response and says so", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    mount((async () => new Response("{}", { status: 200 })) as unknown as typeof fetch);
    await submit();
    await act(async () => { host.querySelector<HTMLButtonElement>(".rs-copy")!.click(); });
    expect(writeText).toHaveBeenCalledWith("{}");
    expect(host.querySelector(".rs-copy")?.textContent).toBe("Copied");
  });

  it("reports a failed copy", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("denied"); } }, configurable: true });
    mount((async () => new Response("{}", { status: 200 })) as unknown as typeof fetch);
    await submit();
    await act(async () => { host.querySelector<HTMLButtonElement>(".rs-copy")!.click(); });
    expect(host.querySelector(".rs-copy")?.getAttribute("data-state")).toBe("failed");
  });

  it("shows an empty state when there is nothing to call", () => {
    mount(vi.fn() as unknown as typeof fetch, []);
    expect(host.textContent).toContain("No APIs to call");
  });
});

describe("playground races", () => {
  it("an older answer that arrives late does not overwrite the latest request", async () => {
    const pending: Array<(r: Response) => void> = [];
    const send = vi.fn(() => new Promise<Response>((resolve) => { pending.push(resolve); }));
    mount(send as unknown as typeof fetch);
    const [api] = [...host.querySelectorAll("select")];
    await submit();
    choose(api, "techblog");
    await submit();
    expect(send).toHaveBeenCalledTimes(2);
    await act(async () => { pending[1](new Response('{"second":true}', { status: 201 })); });
    expect(status()).toBe("HTTP 201");
    await act(async () => { pending[0](new Response('{"first":true}', { status: 500 })); });
    expect(status()).toBe("HTTP 201");
    expect(host.querySelector('[aria-label="Response body"]')?.textContent).toContain('"second": true');
  });

  it("an answer for a request made before the API changed is dropped", async () => {
    let resolve!: (r: Response) => void;
    mount((() => new Promise<Response>((r) => { resolve = r; })) as unknown as typeof fetch);
    await submit();
    choose(host.querySelectorAll("select")[0], "techblog");
    await act(async () => { resolve(new Response("{}", { status: 200 })); });
    expect(status()).toContain("Nothing sent yet");
  });
});
