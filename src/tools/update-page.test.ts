import { handleUpdatePage } from './update-page.js';
import { ApiClient } from '../api/index.js';
import { UpdatePageArgs } from '../types/index.js';

describe('handleUpdatePage', () => {
  let mockApiClient: ApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      updatePage: jest.fn()
    } as unknown as ApiClient;
    
    jest.clearAllMocks();
  });
  
  it('should handle successful page update', async () => {
    const mockPage = {
      path: '/existing-page',
      revision: {
        body: 'Updated content'
      }
    };
    
    (mockApiClient.updatePage as jest.Mock).mockResolvedValue({
      data: {
        page: mockPage
      }
    });
    
    const args: UpdatePageArgs = { 
      path: '/existing-page', 
      body: 'Updated content'
    };
    
    const result = await handleUpdatePage(mockApiClient, args);
    
    expect(mockApiClient.updatePage).toHaveBeenCalledWith('/existing-page', 'Updated content');
    expect(result.isError).toBe(false);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Successfully updated page at');
    expect(result.content[0].text).toContain('/existing-page');
  });
  
  it('should use default overwrite value if not provided', async () => {
    const mockPage = {
      path: '/existing-page',
      revision: {
        body: 'Updated content'
      }
    };
    
    (mockApiClient.updatePage as jest.Mock).mockResolvedValue({
      data: {
        page: mockPage
      }
    });
    
    const args: UpdatePageArgs = { 
      path: '/existing-page', 
      body: 'Updated content'
    };
    
    const result = await handleUpdatePage(mockApiClient, args);
    
    expect(mockApiClient.updatePage).toHaveBeenCalledWith('/existing-page', 'Updated content');
    expect(result.isError).toBe(false);
  });
  
  it('should handle API errors', async () => {
    (mockApiClient.updatePage as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const args: UpdatePageArgs = { 
      path: '/existing-page', 
      body: 'Updated content' 
    };
    
    const result = await handleUpdatePage(mockApiClient, args);
    
    expect(mockApiClient.updatePage).toHaveBeenCalledWith('/existing-page', 'Updated content');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Error updating page:');
  });
  
  it('should handle unexpected response format', async () => {
    (mockApiClient.updatePage as jest.Mock).mockResolvedValue({
      data: {}
    });
    
    const args: UpdatePageArgs = { 
      path: '/existing-page', 
      body: 'Updated content' 
    };
    
    const result = await handleUpdatePage(mockApiClient, args);
    
    expect(mockApiClient.updatePage).toHaveBeenCalledWith('/existing-page', 'Updated content');
    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Failed to update page: All methods failed');
  });
});
