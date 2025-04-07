import { Tool } from '../types/index.js';

export const LIST_PAGES_TOOL: Tool = {
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
      path: {
        type: "string",
        description: "Filter pages by path (optional)"
      }
    }
  }
};

export const GET_PAGE_TOOL: Tool = {
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

export const CREATE_PAGE_TOOL: Tool = {
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

export const UPDATE_PAGE_TOOL: Tool = {
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

export const SEARCH_PAGES_TOOL: Tool = {
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

export const ALL_TOOLS = [
  LIST_PAGES_TOOL,
  GET_PAGE_TOOL,
  CREATE_PAGE_TOOL,
  UPDATE_PAGE_TOOL,
  SEARCH_PAGES_TOOL
];
