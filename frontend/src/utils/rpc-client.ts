// RPC utility functions to handle CORS issues
export class RPCClient {
  private baseUrl: string;
  private useProxy: boolean;

  constructor(baseUrl: string, useProxy: boolean = false) {
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
  }

  private getUrl(path: string): string {
    if (this.useProxy && typeof window !== 'undefined') {
      return `/api/rpc-proxy?path=${encodeURIComponent(path)}`;
    }
    return `${this.baseUrl}/${path}`;
  }

  async get(path: string): Promise<any> {
    try {
      const url = this.getUrl(path);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If direct RPC fails due to CORS, try with proxy
      if (!this.useProxy && error instanceof TypeError && error.message.includes('CORS')) {
        console.warn('Direct RPC failed due to CORS, trying with proxy...');
        const proxyClient = new RPCClient(this.baseUrl, true);
        return proxyClient.get(path);
      }
      throw error;
    }
  }

  async post(path: string, data: any): Promise<any> {
    try {
      const url = this.getUrl(path);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If direct RPC fails due to CORS, try with proxy
      if (!this.useProxy && error instanceof TypeError && error.message.includes('CORS')) {
        console.warn('Direct RPC failed due to CORS, trying with proxy...');
        const proxyClient = new RPCClient(this.baseUrl, true);
        return proxyClient.post(path, data);
      }
      throw error;
    }
  }
}

// Default RPC client
export const rpcClient = new RPCClient(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.stbl.mstbl.com'
);

// Proxy RPC client for when CORS fails
export const proxyRpcClient = new RPCClient(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.stbl.mstbl.com',
  true
);
