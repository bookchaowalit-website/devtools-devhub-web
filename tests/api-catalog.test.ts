import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  API_CATALOG,
  allUrlsHttps,
  catalogIds,
  exampleRequest,
} from "../src/lib/api-catalog.ts";

describe("devhub api catalog", () => {
  it("includes the core showcase APIs", () => {
    const ids = catalogIds();
    for (const id of ["portfolio", "techblog", "artblog", "techspace", "mcp"]) {
      assert.ok(ids.includes(id), `missing ${id}`);
    }
  });

  it("keeps only https MCP endpoints", () => {
    assert.equal(allUrlsHttps(), true);
    assert.ok(API_CATALOG.every((entry) => entry.endpoints > 0));
  });
});

describe("documented tools", () => {
  it("lists the six portfolio handlers by their actual names", () => {
    const portfolio = API_CATALOG.find(entry => entry.id === "portfolio")!;
    assert.deepEqual(portfolio.tools.map(tool => tool.name), ["get_projects", "get_skills", "get_blog_posts", "get_blog_post", "get_github_repos", "get_contact_info"]);
  });

  it("keeps endpoint counts derived from the shared detail data", () => {
    for (const api of API_CATALOG) {
      assert.equal(api.endpoints, api.tools.length);
      assert.equal(new Set(api.tools.map(tool => tool.name)).size, api.tools.length);
      assert.ok(api.tools.every(tool => tool.description && tool.method));
    }
  });

  it("lists the seven current TechSpace tools", () => {
    assert.deepEqual(API_CATALOG.find(api => api.id === "techspace")!.tools.map(tool => tool.name), ["roll_dice", "list_stacks", "get_stack", "search_stacks", "site_summary", "page_summary", "render_stack_markdown"]);
  });
});


it("uses the catalog method in examples for protocol methods and tool calls", () => {
  assert.deepEqual(exampleRequest(API_CATALOG.find(api => api.id === "portfolio")!), { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_projects", arguments: {} } });
  assert.deepEqual(exampleRequest(API_CATALOG.find(api => api.id === "mcp")!), { jsonrpc: "2.0", id: 1, method: "servers/list" });
});
