type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  interceptorEnabled?: boolean;
}

export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private interceptorEnabled: boolean;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || "/api";
    this.headers = config.headers || {};
    this.interceptorEnabled = config.interceptorEnabled || false;
  }

  private async request(method: HttpMethod, url: string, data?: any) {
    const fullUrl = `${this.baseURL}${url}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
    };

    if (this.interceptorEnabled) {
      this.addInterceptor(options);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error in request");
    }

    return response.json();
  }

  private addInterceptor(options: RequestInit) {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  public get(url: string) {
    return this.request("GET", url);
  }

  public post(url: string, data: any) {
    return this.request("POST", url, data);
  }

  public put(url: string, data: any) {
    return this.request("PUT", url, data);
  }

  public delete(url: string) {
    return this.request("DELETE", url);
  }

  public setBaseURL(url: string) {
    this.baseURL = url;
  }

  public setHeaders(headers: Record<string, string>) {
    this.headers = headers;
  }

  public enableInterceptor(enable: boolean) {
    this.interceptorEnabled = enable;
  }
}

export const httpClient = new HttpClient();
export const securedHttpClient = new HttpClient({ interceptorEnabled: true });
