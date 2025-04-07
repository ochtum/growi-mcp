import { handleSearchPages } from './search-pages.js';
import { ApiClient } from '../api/index.js';
import { SearchPagesArgs } from '../types/index.js';

describe('handleSearchPages', () => {
  let mockApiClient: ApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      searchPages: jest.fn()
    } as unknown as ApiClient;
    
    jest.clearAllMocks();
  });
  
  it('should handle successful search with direct pages response', async () => {
    const mockPages = [
      { path: '/page1', title: 'Page 1' },
      { path: '/page2', title: 'Page 2' }
    ];
    
    (mockApiClient.searchPages as jest.Mock).mockResolvedValue({
      data: {
        pages: mockPages
      }
    });
    
    const args: SearchPagesArgs = { 
      q: 'test query',
      limit: 10,
      offset: 0
    };
    
    const result = await handleSearchPages(mockApiClient, args);
    
    expect(mockApiClient.searchPages).toHaveBeenCalledWith('test query', 10, 0);
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('/page1');
    expect(result.content[0].text).toContain('/page2');
    expect(result.content[0].text).toContain('Page 1');
    expect(result.content[0].text).toContain('Page 2');
  });
  
  it('should handle successful search with dehydratedState response', async () => {
    const mockHits = [
      { data: { path: '/page1', title: 'Page 1' } },
      { data: { path: '/page2', title: 'Page 2' } }
    ];
    
    (mockApiClient.searchPages as jest.Mock).mockResolvedValue({
      data: {
        props: {
          pageProps: {
            dehydratedState: {
              queries: [
                {
                  state: {
                    data: {
                      hits: mockHits
                    }
                  }
                }
              ]
            }
          }
        }
      }
    });
    
    const args: SearchPagesArgs = { 
      q: 'test query',
      limit: 10,
      offset: 0
    };
    
    const result = await handleSearchPages(mockApiClient, args);
    
    expect(mockApiClient.searchPages).toHaveBeenCalledWith('test query', 10, 0);
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('/page1');
    expect(result.content[0].text).toContain('/page2');
  });
  
  it('should handle no search results', async () => {
    (mockApiClient.searchPages as jest.Mock).mockResolvedValue({
      data: {
        pages: []
      }
    });
    
    const args: SearchPagesArgs = { 
      q: 'no results',
      limit: 10,
      offset: 0
    };
    
    const result = await handleSearchPages(mockApiClient, args);
    
    expect(mockApiClient.searchPages).toHaveBeenCalledWith('no results', 10, 0);
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('No pages found matching "no results"');
  });
  
  it('should handle unexpected response format', async () => {
    (mockApiClient.searchPages as jest.Mock).mockResolvedValue({
      data: {}
    });
    
    const args: SearchPagesArgs = { 
      q: 'test query',
      limit: 10,
      offset: 0
    };
    
    const result = await handleSearchPages(mockApiClient, args);
    
    expect(mockApiClient.searchPages).toHaveBeenCalledWith('test query', 10, 0);
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Failed to search pages: Unexpected response format');
  });
  
  it('should handle API errors', async () => {
    (mockApiClient.searchPages as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const args: SearchPagesArgs = { 
      q: 'test query',
      limit: 10,
      offset: 0
    };
    
    const result = await handleSearchPages(mockApiClient, args);
    
    expect(mockApiClient.searchPages).toHaveBeenCalledWith('test query', 10, 0);
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Error searching pages: API error');
  });
});
