import { SearchPagesArgs } from '../types/index.js';
import { ApiClient } from '../api/index.js';
import { debugLog } from '../utils/index.js';

export async function handleSearchPages(apiClient: ApiClient, args: SearchPagesArgs) {
  const q = args.q;
  const limit = args.limit || 10;
  const offset = args.offset || 0;
  
  let debugInfo = "";
  debugInfo += debugLog("SEARCH PAGES REQUEST", { q, limit, offset });
  
  try {
    const response = await apiClient.searchPages(q, limit, offset);
    
    debugInfo += debugLog("SEARCH PAGES RESPONSE", response.data);
    
    let searchResults: any[] | null = null;
    
    if (response.data && response.data.pages) {
      searchResults = response.data.pages;
    } else if (response.data && response.data.props && response.data.props.pageProps) {
      const pageProps = response.data.props.pageProps;
      
      if (pageProps.dehydratedState && pageProps.dehydratedState.queries) {
        const queries = pageProps.dehydratedState.queries;
        
        for (const query of queries) {
          if (query.state && query.state.data) {
            const data = query.state.data;
            
            if (data.pages || (data.hits && data.hits.length > 0)) {
              searchResults = data.pages || data.hits;
              break;
            }
          }
        }
      }
      
      if (!searchResults && pageProps.searchResults) {
        searchResults = pageProps.searchResults;
      }
    }
    
    if (searchResults && Array.isArray(searchResults)) {
      const pageList = searchResults.map((page: any) => {
        const path = page.path || (page.data && page.data.path) || '';
        const title = page.title || page.pageTitles || (page.data && page.data.title) || '';
        
        return `- ${path}${title ? `\n  Title: ${title}` : ''}`;
      }).join('\n\n');
      
      return {
        content: [{ 
          type: "text", 
          text: searchResults.length > 0 ? pageList : `No pages found matching "${q}"` 
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
