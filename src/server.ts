import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig } from "./config/index.js";
import { createApiClient } from "./api/index.js";
import { ALL_TOOLS, handleToolCall, ToolName } from "./tools/index.js";

export function createServer() {
  const config = getConfig();
  const apiClient = createApiClient(config);

  const server = new McpServer({
    name: "Growi MCP Server",
    version: "1.0.0",
    tools: ALL_TOOLS,
    handleToolCall: async ({
      name,
      args,
    }: {
      name: ToolName;
      args: unknown;
    }) => {
      return handleToolCall(apiClient, name, args);
    },
  });

  return server;
}
