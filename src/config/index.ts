export interface Config {
  apiUrl: string;
  apiToken: string;
}

export function getConfig(): Config {
  const apiUrl = process.env.GROWI_API_URL || '';
  const apiToken = process.env.GROWI_API_TOKEN || '';
  
  if (!apiUrl) {
    throw new Error("GROWI_API_URL environment variable is required");
  }
  
  if (!apiToken) {
    throw new Error("GROWI_API_TOKEN environment variable is required");
  }
  
  return {
    apiUrl,
    apiToken
  };
}
