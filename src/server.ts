import { MCPServer } from '@modelcontextprotocol/sdk';
import { getConfig } from './config/index.js';
import { createApiClient } from './api/index.js';
import { ALL_TOOLS, handleToolCall } from './tools/index.js';

export function createServer() {
  const config = getConfig();
  const apiClient = createApiClient(config);
  
  const server = new MCPServer({
    tools: ALL_TOOLS,
    handleToolCall: async ({ name, args }) => {
      return handleToolCall(apiClient, name, args);
    }
  });
  
  return server;
}
