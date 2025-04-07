import { GetPageArgs } from '../types/index.js';
import { ApiClient } from '../api/index.js';
import { normalizePath, debugLog } from '../utils/index.js';

export async function handleGetPage(apiClient: ApiClient, args: GetPageArgs) {
  const path = normalizePath(args.path);
  let debugInfo = "";
  debugInfo += debugLog("GET PAGE REQUEST", { path });
  
  try {
    const response = await apiClient.getPage(path);
    
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
