export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface GrowiPage {
  _id: string;
  path: string;
  revision?: {
    body?: string;
    createdAt?: string;
  };
}

export interface GrowiResponse<T> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface ListPagesArgs {
  limit?: number;
  path?: string;
}

export interface GetPageArgs {
  path: string;
}

export interface CreatePageArgs {
  path: string;
  body: string;
}

export interface UpdatePageArgs {
  path: string;
  body: string;
}

export interface SearchPagesArgs {
  q: string;
  limit?: number;
  offset?: number;
}
