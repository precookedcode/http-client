// httpClient.ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  useInterceptor?: boolean; // Renombrado desde interceptorEnabled para mayor claridad
}

export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private useInterceptor: boolean;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || "/api";
    this.headers = config.headers || {};
    this.useInterceptor = config.useInterceptor || false;
  }

  private async request(method: HttpMethod, url: string, data?: any) {
    const fullUrl = `${this.baseURL}${url}`;
    const options: RequestInit = {
      method,
      headers: {
        ...(method === "GET"
          ? this.headers
          : { "Content-Type": "application/json", ...this.headers }),
      },
      body:
        method !== "GET" && data
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined,
    };

    if (this.useInterceptor) {
      this.addInterceptor(options);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // Maneja errores sin cuerpo JSON
      throw new Error(
        errorData?.message || response.statusText || "Unknown error occurred"
      );
    }

    return response.json();
  }

  private addInterceptor(options: RequestInit) {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      console.warn("No token available for Authorization header.");
      return;
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
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
    this.useInterceptor = enable;
  }
}

export const httpClient = new HttpClient();
export const securedHttpClient = new HttpClient({ useInterceptor: true });
