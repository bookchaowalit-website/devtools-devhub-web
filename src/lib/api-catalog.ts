export type ApiTool = { name: string; description: string; method: string };

export type ApiEntry = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  status: "online" | "offline" | "degraded";
  endpoints: number;
  tools: ApiTool[];
  category: string;
  url: string;
  features: string[];
  icon: "code" | "file" | "book" | "database" | "globe";
};

/** Developer-portal MCP catalog (showcase metadata only). */
const CATALOG_ENTRIES: Omit<ApiEntry, "endpoints">[] = [
  {
    id: "portfolio",
    name: "Portfolio API",
    description: "Access projects, skills, blog posts, and GitHub activity",
    longDescription:
      "Comprehensive portfolio API providing access to all your professional information including projects, technical skills, blog posts, and GitHub contribution data.",
    status: "online",
    tools: [
      {"name": "get_projects", "description": "Get all projects", "method": "tools/call"},
      {"name": "get_skills", "description": "Get technical skills", "method": "tools/call"},
      {"name": "get_blog_posts", "description": "Get blog posts", "method": "tools/call"},
      {"name": "get_blog_post", "description": "Get a specific blog post", "method": "tools/call"},
      {"name": "get_github_repos", "description": "Get GitHub repositories", "method": "tools/call"},
      {"name": "get_contact_info", "description": "Get contact information", "method": "tools/call"},
    ],
    category: "Portfolio",
    url: "https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp",
    features: ["Projects data", "Skills taxonomy", "Blog posts", "GitHub integration"],
    icon: "code",
  },
  {
    id: "techblog",
    name: "Tech Blog API",
    description: "Technical articles and programming content",
    longDescription:
      "Access technical articles, tutorials, and programming insights from the Tech Blog with full search and filtering capabilities.",
    status: "online",
    tools: [
      {"name": "get_tech_posts", "description": "Get technical blog posts", "method": "tools/call"},
      {"name": "search_tech_content", "description": "Search by query", "method": "tools/call"},
      {"name": "get_tech_post", "description": "Get a specific post", "method": "tools/call"},
    ],
    category: "Content",
    url: "https://bookchaowalit-techblog-frontend.vercel.app/api/mcp",
    features: ["Technical articles", "Search by query", "Post retrieval", "Category filtering"],
    icon: "file",
  },
  {
    id: "artblog",
    name: "Art Blog API",
    description: "Creative arts and design content",
    longDescription:
      "Explore creative arts content including illustrations, graphic design, photography, and digital art with rich metadata and tagging.",
    status: "online",
    tools: [
      {"name": "get_art_posts", "description": "Get art blog posts", "method": "tools/call"},
      {"name": "search_art_content", "description": "Search art content", "method": "tools/call"},
      {"name": "get_art_post", "description": "Get a specific art post", "method": "tools/call"},
    ],
    category: "Content",
    url: "https://bookchaowalit-artblog-frontend.vercel.app/api/mcp",
    features: ["Art posts", "Tag-based filtering", "Creative content", "Design resources"],
    icon: "book",
  },
  {
    id: "techspace",
    name: "Tech Space API",
    description: "Technology stacks and development platforms",
    longDescription:
      "Comprehensive information about technology stacks, development platforms, and tools used in modern software development.",
    status: "online",
    tools: [
      {"name": "roll_dice", "description": "Roll a die", "method": "tools/call"},
      {"name": "list_stacks", "description": "List technology stacks", "method": "tools/call"},
      {"name": "get_stack", "description": "Get a technology stack", "method": "tools/call"},
      {"name": "search_stacks", "description": "Search technology stacks", "method": "tools/call"},
      {"name": "site_summary", "description": "Get a site summary", "method": "tools/call"},
      {"name": "page_summary", "description": "Get a content page summary", "method": "tools/call"},
      {"name": "render_stack_markdown", "description": "Render a stack as Markdown", "method": "tools/call"},
    ],
    category: "Tech",
    url: "https://bookchaowalit-techspace-frontend.vercel.app/api/mcp",
    features: ["Stack information", "Platform details", "Tool descriptions", "Best practices"],
    icon: "database",
  },
  {
    id: "mcp",
    name: "MCP List Hub",
    description: "Central aggregator for all MCP servers",
    longDescription:
      "The central hub that aggregates all MCP servers, providing discovery, documentation, and proxy functionality for the entire ecosystem.",
    status: "online",
    tools: [
      {"name": "servers/list", "description": "List registered MCP servers", "method": "servers/list"},
      {"name": "tools/list", "description": "Discover namespaced tools from registered servers", "method": "tools/list"},
      {"name": "<server-id>_<tool-name>", "description": "Call a discovered tool through the hub", "method": "tools/call"},
    ],
    category: "Infrastructure",
    url: "https://bookchaowalit-mcplist-frontend.vercel.app/api/mcp",
    features: ["Server discovery", "Tool aggregation", "Proxy functionality", "Documentation"],
    icon: "globe",
  },
];

export const API_CATALOG: ApiEntry[] = CATALOG_ENTRIES.map(entry => ({ ...entry, endpoints: entry.tools.length }));

export function catalogIds(catalog: ApiEntry[] = API_CATALOG): string[] {
  return catalog.map((entry) => entry.id);
}

export function allUrlsHttps(catalog: ApiEntry[] = API_CATALOG): boolean {
  return catalog.every((entry) => entry.url.startsWith("https://"));
}
