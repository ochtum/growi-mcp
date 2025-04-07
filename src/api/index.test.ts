import { createApiClient } from './index.js';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  const mockConfig = {
    apiUrl: 'https://test-growi.com',
    apiToken: 'test-token'
  };
  
  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      interceptors: {
        request: {
          use: jest.fn()
        }
      }
    } as any);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should create an axios instance with the correct config', () => {
    createApiClient(mockConfig);
    
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: mockConfig.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
  
  it('should add access token to requests', () => {
    const mockUse = jest.fn();
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: {
          use: mockUse
        }
      }
    } as any);
    
    createApiClient(mockConfig);
    
    expect(mockUse).toHaveBeenCalled();
    
    const interceptor = mockUse.mock.calls[0][0];
    const config = { params: {} };
    const result = interceptor(config);
    
    expect(result.params.access_token).toBe(mockConfig.apiToken);
  });
  
  describe('listPages', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: { pages: [] } });
      mockedAxios.create.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        interceptors: {
          request: {
            use: jest.fn()
          }
        }
      } as any);
      
      const apiClient = createApiClient(mockConfig);
      await apiClient.listPages(10, '/path');
      
      expect(mockGet).toHaveBeenCalledWith('/_api/v3/pages/list', {
        params: {
          limit: 10,
          path: '/path'
        }
      });
    });
  });
  
  describe('getPage', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: { page: {} } });
      mockedAxios.create.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        interceptors: {
          request: {
            use: jest.fn()
          }
        }
      } as any);
      
      const apiClient = createApiClient(mockConfig);
      await apiClient.getPage('/path');
      
      expect(mockGet).toHaveBeenCalledWith('/_api/v3/page', {
        params: {
          path: '/path'
        }
      });
    });
  });
  
  describe('createPage', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { page: {} } });
      mockedAxios.create.mockReturnValue({
        get: jest.fn(),
        post: mockPost,
        interceptors: {
          request: {
            use: jest.fn()
          }
        }
      } as any);
      
      const apiClient = createApiClient(mockConfig);
      await apiClient.createPage('/path', 'content');
      
      expect(mockPost).toHaveBeenCalledWith('/_api/v3/page', {
        path: '/path',
        body: 'content'
      });
    });
  });
  
  describe('updatePage', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { page: {} } });
      mockedAxios.create.mockReturnValue({
        get: jest.fn(),
        post: mockPost,
        interceptors: {
          request: {
            use: jest.fn()
          }
        }
      } as any);
      
      const apiClient = createApiClient(mockConfig);
      await apiClient.updatePage('/path', 'content', true);
      
      expect(mockPost).toHaveBeenCalledWith('/_api/v3/page', {
        path: '/path',
        body: 'content',
        grant: 1,
        overwrite: true
      });
    });
  });
  
  describe('searchPages', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: { pages: [] } });
      mockedAxios.create.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        interceptors: {
          request: {
            use: jest.fn()
          }
        }
      } as any);
      
      const apiClient = createApiClient(mockConfig);
      await apiClient.searchPages('query', 10, 0);
      
      expect(mockGet).toHaveBeenCalledWith('/_api/v3/search', {
        params: {
          q: 'query',
          limit: 10,
          path: '/'
        }
      });
    });
  });
});
