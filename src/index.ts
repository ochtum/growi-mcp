#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

function debugLog(title: string, data: any): string {
  console.error(`\n===== DEBUG: ${title} =====`);
  console.error(JSON.stringify(data, null, 2));
  console.error(`===== END DEBUG: ${title} =====\n`);
  
  return `\n===== DEBUG: ${title} =====\n${JSON.stringify(data, null, 2)}\n===== END DEBUG: ${title} =====\n`;
}

const LIST_PAGES_TOOL: Tool = {
  name: "growi_list_pages",
  description: "Get a list of pages from Growi with optional filters",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of pages to return (optional)",
        default: 10
      },
      offset: {
        type: "number",
        description: "Offset for pagination (optional)",
        default: 0
      },
      path: {
        type: "string",
        description: "Filter pages by path (optional)"
      }
    }
  }
};

const GET_PAGE_TOOL: Tool = {
  name: "growi_get_page",
  description: "Get a single page from Growi by path",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The path of the page to retrieve"
      }
    },
    required: ["path"]
  }
};

const CREATE_PAGE_TOOL: Tool = {
  name: "growi_create_page",
  description: "Create a new page in Growi",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The path where the page will be created"
      },
      body: {
        type: "string",
        description: "The content/body of the page"
      }
    },
    required: ["path", "body"]
  }
};

const UPDATE_PAGE_TOOL: Tool = {
  name: "growi_update_page",
  description: "Update an existing page in Growi",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The path of the page to update"
      },
      body: {
        type: "string",
        description: "The new content/body for the page"
      }
    },
    required: ["path", "body"]
  }
};

const SEARCH_PAGES_TOOL: Tool = {
  name: "growi_search_pages",
  description: "Search for pages in Growi",
  inputSchema: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "Search query"
      },
      limit: {
        type: "number",
        description: "Maximum number of pages to return",
        default: 10
      },
      offset: {
        type: "number",
        description: "Offset for pagination",
        default: 0
      }
    },
    required: ["q"]
  }
};

const server = new Server(
  {
    name: "growi-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const GROWI_API_URL = process.env.GROWI_API_URL || '';
const GROWI_API_TOKEN = process.env.GROWI_API_TOKEN || '';
if (!GROWI_API_URL) {
  console.error("Error: GROWI_API_URL environment variable is required");
  process.exit(1);
}
if (!GROWI_API_TOKEN) {
  console.error("Error: GROWI_API_TOKEN environment variable is required");
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: GROWI_API_URL,
  headers: {
    'Authorization': `Bearer ${GROWI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

function isListPagesArgs(args: unknown): args is { 
  limit?: number;
  offset?: number;
  path?: string;
} {
  return (
    typeof args === "object" &&
    args !== null
  );
}

function isGetPageArgs(args: unknown): args is { 
  path: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string"
  );
}

function isCreatePageArgs(args: unknown): args is {
  path: string;
  body: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string" &&
    "body" in args &&
    typeof (args as { body: string }).body === "string"
  );
}

function isUpdatePageArgs(args: unknown): args is {
  path: string;
  body: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string" &&
    "body" in args &&
    typeof (args as { body: string }).body === "string"
  );
}

function isSearchPagesArgs(args: unknown): args is {
  q: string;
  limit?: number;
  offset?: number;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "q" in args &&
    typeof (args as { q: string }).q === "string"
  );
}

function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  return path;
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [LIST_PAGES_TOOL, GET_PAGE_TOOL, CREATE_PAGE_TOOL, UPDATE_PAGE_TOOL, SEARCH_PAGES_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "growi_list_pages") {
      if (!isListPagesArgs(args)) {
        throw new Error("Invalid arguments for growi_list_pages");
      }
      
      const limit = args.limit || 10;
      const offset = args.offset || 0;
      const path = args.path ? normalizePath(args.path) : undefined;
      
      let debugInfo = "";
      debugInfo += debugLog("LIST PAGES REQUEST", { limit, offset, path });
      
      try {
        const response = await apiClient.get('/_api/v3/pages/list', {
          params: {
            limit,
            offset,
            path
          }
        });
        
        debugInfo += debugLog("LIST PAGES RESPONSE", response.data);
        
        if (response.data && response.data.pages) {
          const pages = response.data.pages;
          const pageList = pages.map((page: any) => 
            `- ${page.path}${page.revision ? `\n  Last Updated: ${new Date(page.revision.createdAt).toLocaleString()}` : ''}`
          ).join('\n\n');
          
          return {
            content: [{ 
              type: "text", 
              text: pages.length > 0 ? pageList : "No pages found" 
            }],
            isError: false,
          };
        } else {
          return {
            content: [{ 
              type: "text", 
              text: `Failed to list pages: Unexpected response format\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
      } catch (error) {
        debugInfo += debugLog("LIST PAGES ERROR", {
          message: error instanceof Error ? error.message : String(error),
          response: error instanceof Error && 'response' in error ? (error as any).response?.data : null
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `Error listing pages: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
          }],
          isError: true,
        };
      }
    }

    if (name === "growi_get_page") {
      if (!isGetPageArgs(args)) {
        throw new Error("Invalid arguments for growi_get_page");
      }

      const path = normalizePath(args.path);
      let debugInfo = "";
      debugInfo += debugLog("GET PAGE REQUEST", { path });
      
      try {
        const response = await apiClient.get('/_api/v3/page', {
          params: { path }
        });
        
        debugInfo += debugLog("GET PAGE RESPONSE", response.data);
        
        if (response.data && response.data.page) {
          const page = response.data.page;
          
          return {
            content: [{ 
              type: "text", 
              text: `# ${page.path}\n\n${page.revision ? page.revision.body : 'No content available'}` 
            }],
            isError: false,
          };
        } else {
          return {
            content: [{ 
              type: "text", 
              text: `Page not found for path: ${path}\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
      } catch (error) {
        debugInfo += debugLog("GET PAGE ERROR", {
          message: error instanceof Error ? error.message : String(error),
          response: error instanceof Error && 'response' in error ? (error as any).response?.data : null
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching page: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
          }],
          isError: true,
        };
      }
    }

    if (name === "growi_create_page") {
      if (!isCreatePageArgs(args)) {
        throw new Error("Invalid arguments for growi_create_page");
      }

      const path = normalizePath(args.path);
      const body = args.body;
      let debugInfo = "";
      debugInfo += debugLog("CREATE PAGE REQUEST", { path, body: body.substring(0, 100) + (body.length > 100 ? '...' : '') });
      
      try {
        const response = await apiClient.post('/_api/v3/pages', {
          path,
          body
        });
        
        debugInfo += debugLog("CREATE PAGE RESPONSE", response.data);
        
        if (response.data && response.data.page) {
          const page = response.data.page;
          
          return {
            content: [{ 
              type: "text", 
              text: `Page created successfully:\nPath: ${page.path}\n\n${debugInfo}` 
            }],
            isError: false,
          };
        } else {
          return {
            content: [{ 
              type: "text", 
              text: `Failed to create page: Unexpected response format\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
      } catch (error) {
        debugInfo += debugLog("CREATE PAGE ERROR", {
          message: error instanceof Error ? error.message : String(error),
          response: error instanceof Error && 'response' in error ? (error as any).response?.data : null
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `Error creating page: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
          }],
          isError: true,
        };
      }
    }

    if (name === "growi_update_page") {
      if (!isUpdatePageArgs(args)) {
        throw new Error("Invalid arguments for growi_update_page");
      }

      const path = normalizePath(args.path);
      const body = args.body;
      let debugInfo = "";
      debugInfo += debugLog("UPDATE PAGE REQUEST", { path, body: body.substring(0, 100) + (body.length > 100 ? '...' : '') });
      
      try {
        const getResponse = await apiClient.get('/_api/v3/page', {
          params: { path }
        });
        
        debugInfo += debugLog("GET PAGE FOR UPDATE RESPONSE", getResponse.data);
        
        if (!getResponse.data || !getResponse.data.page) {
          return {
            content: [{ 
              type: "text", 
              text: `Page not found for path: ${path}\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
        
        const pageId = getResponse.data.page._id;
        
        const response = await apiClient.post('/_api/v3/pages/update', {
          page_id: pageId,
          body
        });
        
        debugInfo += debugLog("UPDATE PAGE RESPONSE", response.data);
        
        if (response.data && response.data.page) {
          const page = response.data.page;
          
          return {
            content: [{ 
              type: "text", 
              text: `Page updated successfully:\nPath: ${page.path}\n\n${debugInfo}` 
            }],
            isError: false,
          };
        } else {
          return {
            content: [{ 
              type: "text", 
              text: `Failed to update page: Unexpected response format\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
      } catch (error) {
        debugInfo += debugLog("UPDATE PAGE ERROR", {
          message: error instanceof Error ? error.message : String(error),
          response: error instanceof Error && 'response' in error ? (error as any).response?.data : null
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `Error updating page: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
          }],
          isError: true,
        };
      }
    }

    if (name === "growi_search_pages") {
      if (!isSearchPagesArgs(args)) {
        throw new Error("Invalid arguments for growi_search_pages");
      }

      const q = args.q;
      const limit = args.limit || 10;
      const offset = args.offset || 0;
      let debugInfo = "";
      debugInfo += debugLog("SEARCH PAGES REQUEST", { q, limit, offset });
      
      try {
        const response = await apiClient.get('/_api/v3/search', {
          params: {
            q,
            limit,
            offset
          }
        });
        
        debugInfo += debugLog("SEARCH PAGES RESPONSE", response.data);
        
        if (response.data && response.data.pages) {
          const pages = response.data.pages;
          const pageList = pages.map((page: any) => 
            `- ${page.path}${page.pageTitles ? `\n  Title: ${page.pageTitles}` : ''}`
          ).join('\n\n');
          
          return {
            content: [{ 
              type: "text", 
              text: pages.length > 0 ? pageList : `No pages found matching "${q}"` 
            }],
            isError: false,
          };
        } else {
          return {
            content: [{ 
              type: "text", 
              text: `Failed to search pages: Unexpected response format\n\n${debugInfo}` 
            }],
            isError: true,
          };
        }
      } catch (error) {
        debugInfo += debugLog("SEARCH PAGES ERROR", {
          message: error instanceof Error ? error.message : String(error),
          response: error instanceof Error && 'response' in error ? (error as any).response?.data : null
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `Error searching pages: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
          }],
          isError: true,
        };
      }
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Growi MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
