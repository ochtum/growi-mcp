import { ListPagesArgs } from '../types/index.js';
import { ApiClient } from '../api/index.js';
import { normalizePath, debugLog } from '../utils/index.js';

export async function handleListPages(apiClient: ApiClient, args: ListPagesArgs) {
  const limit = args.limit || 10;
  const path = args.path ? normalizePath(args.path) : '/';
  
  let debugInfo = "";
  debugInfo += debugLog("LIST PAGES REQUEST", { limit, path });
  
  try {
    const response = await apiClient.listPages(limit, path);
    
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
