import { UpdatePageArgs } from '../types/index.js';
import { ApiClient } from '../api/index.js';
import { normalizePath, debugLog } from '../utils/index.js';

export async function handleUpdatePage(apiClient: ApiClient, args: UpdatePageArgs) {
  const path = normalizePath(args.path);
  const body = args.body;
  
  let debugInfo = "";
  debugInfo += debugLog("UPDATE PAGE REQUEST", { path, bodyLength: body.length });
  
  try {
    try {
      const updateResponse = await apiClient.updatePage(path, body);
      
      debugInfo += debugLog("UPDATE PAGE RESPONSE", updateResponse.data);
      
      if (updateResponse.data && updateResponse.data.page) {
        const page = updateResponse.data.page;
        
        return {
          content: [{ 
            type: "text", 
            text: `Successfully updated page at ${page.path}` 
          }],
          isError: false,
        };
      }
    } catch (method1Error) {
      debugInfo += debugLog("UPDATE METHOD 1 ERROR", {
        message: method1Error instanceof Error ? method1Error.message : String(method1Error),
        response: method1Error instanceof Error && 'response' in method1Error ? (method1Error as any).response?.data : null
      });
      
      try {
        const getResponse = await apiClient.getPage(path);
        
        debugInfo += debugLog("GET PAGE RESPONSE", getResponse.data);
        
        if (getResponse.data && getResponse.data.page) {
          try {
            const updateResponse = await apiClient.updatePage(path, body, true);
            
            debugInfo += debugLog("UPDATE PAGE RESPONSE (METHOD 2)", updateResponse.data);
            
            if (updateResponse.data && updateResponse.data.page) {
              const page = updateResponse.data.page;
              
              return {
                content: [{ 
                  type: "text", 
                  text: `Successfully updated page at ${page.path} (method 2)` 
                }],
                isError: false,
              };
            }
          } catch (method2Error) {
            debugInfo += debugLog("UPDATE METHOD 2 ERROR", {
              message: method2Error instanceof Error ? method2Error.message : String(method2Error),
              response: method2Error instanceof Error && 'response' in method2Error ? (method2Error as any).response?.data : null
            });
          }
        } else {
          try {
            const createResponse = await apiClient.createPage(path, body);
            
            debugInfo += debugLog("CREATE PAGE RESPONSE", createResponse.data);
            
            if (createResponse.data && createResponse.data.page) {
              const page = createResponse.data.page;
              
              return {
                content: [{ 
                  type: "text", 
                  text: `Successfully created page at ${page.path} (page didn't exist before)` 
                }],
                isError: false,
              };
            }
          } catch (method3Error) {
            debugInfo += debugLog("CREATE PAGE ERROR", {
              message: method3Error instanceof Error ? method3Error.message : String(method3Error),
              response: method3Error instanceof Error && 'response' in method3Error ? (method3Error as any).response?.data : null
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
                text: `Error updating page (all methods failed): ${method3Error instanceof Error ? method3Error.message : String(method3Error)}\n\n${debugInfo}` 
              }],
              isError: true,
            };
          }
        }
      } catch (error) {
        debugInfo += debugLog("INITIAL ERROR", {
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
    
    return {
      content: [{ 
        type: "text", 
        text: `Failed to update page: All methods failed\n\n${debugInfo}` 
      }],
      isError: true,
    };
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
