import { handleListPages } from './list-pages.js';
import { ApiClient } from '../api/index.js';
import { ListPagesArgs } from '../types/index.js';

describe('handleListPages', () => {
  let mockApiClient: ApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      listPages: jest.fn()
    } as unknown as ApiClient;
    
    jest.clearAllMocks();
  });
  
  it('should handle successful page listing', async () => {
    const mockPages = [
      { path: '/page1', revision: { createdAt: '2023-01-01T00:00:00.000Z' } },
      { path: '/page2', revision: { createdAt: '2023-01-02T00:00:00.000Z' } }
    ];
    
    (mockApiClient.listPages as jest.Mock).mockResolvedValue({
      data: {
        pages: mockPages
      }
    });
    
    const args: ListPagesArgs = { limit: 10, path: '/' };
    const result = await handleListPages(mockApiClient, args);
    
    expect(mockApiClient.listPages).toHaveBeenCalledWith(10, '/');
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('/page1');
    expect(result.content[0].text).toContain('/page2');
  });
  
  it('should handle empty page list', async () => {
    (mockApiClient.listPages as jest.Mock).mockResolvedValue({
      data: {
        pages: []
      }
    });
    
    const args: ListPagesArgs = { limit: 10, path: '/' };
    const result = await handleListPages(mockApiClient, args);
    
    expect(mockApiClient.listPages).toHaveBeenCalledWith(10, '/');
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe('No pages found');
  });
  
  it('should handle unexpected response format', async () => {
    (mockApiClient.listPages as jest.Mock).mockResolvedValue({
      data: {}
    });
    
    const args: ListPagesArgs = { limit: 10, path: '/' };
    const result = await handleListPages(mockApiClient, args);
    
    expect(mockApiClient.listPages).toHaveBeenCalledWith(10, '/');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Failed to list pages: Unexpected response format');
  });
  
  it('should handle API errors', async () => {
    (mockApiClient.listPages as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const args: ListPagesArgs = { limit: 10, path: '/' };
    const result = await handleListPages(mockApiClient, args);
    
    expect(mockApiClient.listPages).toHaveBeenCalledWith(10, '/');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Error listing pages: API error');
  });
});
