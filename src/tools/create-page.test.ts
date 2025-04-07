import { handleCreatePage } from './create-page.js';
import { ApiClient } from '../api/index.js';
import { CreatePageArgs } from '../types/index.js';

describe('handleCreatePage', () => {
  let mockApiClient: ApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      createPage: jest.fn()
    } as unknown as ApiClient;
    
    jest.clearAllMocks();
  });
  
  it('should handle successful page creation', async () => {
    const mockPage = {
      path: '/new-page',
      revision: {
        body: 'New page content'
      }
    };
    
    (mockApiClient.createPage as jest.Mock).mockResolvedValue({
      data: {
        page: mockPage
      }
    });
    
    const args: CreatePageArgs = { 
      path: '/new-page', 
      body: 'New page content' 
    };
    
    const result = await handleCreatePage(mockApiClient, args);
    
    expect(mockApiClient.createPage).toHaveBeenCalledWith('/new-page', 'New page content');
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Page created successfully');
    expect(result.content[0].text).toContain('/new-page');
  });
  
  it('should handle API errors', async () => {
    (mockApiClient.createPage as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const args: CreatePageArgs = { 
      path: '/new-page', 
      body: 'New page content' 
    };
    
    const result = await handleCreatePage(mockApiClient, args);
    
    expect(mockApiClient.createPage).toHaveBeenCalledWith('/new-page', 'New page content');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Error creating page: API error');
  });
  
  it('should handle unexpected response format', async () => {
    (mockApiClient.createPage as jest.Mock).mockResolvedValue({
      data: {}
    });
    
    const args: CreatePageArgs = { 
      path: '/new-page', 
      body: 'New page content' 
    };
    
    const result = await handleCreatePage(mockApiClient, args);
    
    expect(mockApiClient.createPage).toHaveBeenCalledWith('/new-page', 'New page content');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Failed to create page: Unexpected response format');
  });
});
