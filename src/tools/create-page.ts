import { CreatePageArgs } from '../types/index.js';
import { ApiClient } from '../api/index.js';
import { normalizePath, debugLog } from '../utils/index.js';

export async function handleCreatePage(apiClient: ApiClient, args: CreatePageArgs) {
  const path = normalizePath(args.path);
  const body = args.body;
  
  let debugInfo = "";
  debugInfo += debugLog("CREATE PAGE REQUEST", { path, bodyLength: body.length });
  
  try {
    const response = await apiClient.createPage(path, body);
    
    debugInfo += debugLog("CREATE PAGE RESPONSE", response.data);
    
    if (response.data && response.data.page) {
      const page = response.data.page;
      
      return {
        content: [{ 
          type: "text", 
          text: `Successfully created page at ${page.path}` 
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
    
    try {
      const tempPath = `${path}_temp_${Date.now()}`;
      
      debugInfo += debugLog("CREATE TEMP PAGE ATTEMPT", { tempPath });
      
      const createTempResponse = await apiClient.createPage(tempPath, body);
      
      debugInfo += debugLog("CREATE TEMP PAGE RESPONSE", createTempResponse.data);
      
      if (createTempResponse.data && createTempResponse.data.page) {
        
        return {
          content: [{ 
            type: "text", 
            text: `Created page at temporary location ${tempPath}. Please manually rename it to ${path}.` 
          }],
          isError: false,
        };
      }
    } catch (tempError) {
      debugInfo += debugLog("CREATE TEMP PAGE ERROR", {
        message: tempError instanceof Error ? tempError.message : String(tempError),
        response: tempError instanceof Error && 'response' in tempError ? (tempError as any).response?.data : null
      });
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Error creating page: ${error instanceof Error ? error.message : String(error)}\n\n${debugInfo}` 
      }],
      isError: true,
    };
  }
}
