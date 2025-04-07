import axios, { AxiosInstance } from 'axios';
import { Config } from '../config/index.js';

export class ApiClient {
  private client: AxiosInstance;
  private apiToken: string;
  
  constructor(config: Config) {
    this.apiToken = config.apiToken;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.client.interceptors.request.use((config) => {
      if (!config.params) {
        config.params = {};
      }
      config.params.access_token = this.apiToken;
      return config;
    });
  }
  
  async listPages(limit: number, path: string) {
    return this.client.get('/_api/v3/pages/list', {
      params: {
        limit,
        path
      }
    });
  }
  
  async getPage(path: string) {
    return this.client.get('/_api/v3/page', {
      params: { path }
    });
  }
  
  async createPage(path: string, body: string) {
    return this.client.post('/_api/v3/page', {
      path,
      body
    });
  }
  
  async updatePage(path: string, body: string, overwrite = true) {
    return this.client.post('/_api/v3/page', {
      path,
      body,
      grant: 1,
      overwrite
    });
  }
  
  async searchPages(q: string, limit: number, offset: number) {
    return this.client.get('/_api/v3/search', {
      params: {
        q,
        limit,
        offset
      }
    });
  }
}

export function createApiClient(config: Config): ApiClient {
  return new ApiClient(config);
}
