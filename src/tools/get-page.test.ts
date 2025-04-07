import { handleGetPage } from './get-page.js';
import { ApiClient } from '../api/index.js';
import { GetPageArgs } from '../types/index.js';

describe('handleGetPage', () => {
  let mockApiClient: ApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      getPage: jest.fn()
    } as unknown as ApiClient;
    
    jest.clearAllMocks();
  });
  
  it('should handle successful page retrieval', async () => {
    const mockPage = {
      path: '/test-page',
      revision: {
        body: 'Test page content'
      }
    };
    
    (mockApiClient.getPage as jest.Mock).mockResolvedValue({
      data: {
        page: mockPage
      }
    });
    
    const args: GetPageArgs = { path: '/test-page' };
    const result = await handleGetPage(mockApiClient, args);
    
    expect(mockApiClient.getPage).toHaveBeenCalledWith('/test-page');
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('# /test-page');
    expect(result.content[0].text).toContain('Test page content');
  });
  
  it('should handle page not found', async () => {
    (mockApiClient.getPage as jest.Mock).mockResolvedValue({
      data: {}
    });
    
    const args: GetPageArgs = { path: '/non-existent' };
    const result = await handleGetPage(mockApiClient, args);
    
    expect(mockApiClient.getPage).toHaveBeenCalledWith('/non-existent');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Page not found for path: /non-existent');
  });
  
  it('should handle API errors', async () => {
    (mockApiClient.getPage as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const args: GetPageArgs = { path: '/test-page' };
    const result = await handleGetPage(mockApiClient, args);
    
    expect(mockApiClient.getPage).toHaveBeenCalledWith('/test-page');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Error fetching page: API error');
  });
});
