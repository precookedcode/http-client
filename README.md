
# @precooked/http-client

![Precooked Logo](https://precookedcode.com/assets/logos/logo-horizontal-dark.svg)

A lightweight and configurable HTTP client built with TypeScript.

## Installation

Install the package using npm:

```bash
npm install @precooked/http-client
```

## Features

- Supports HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Customizable base URL and headers.
- Multiple interceptors for advanced request customization.
- Dynamic header management (`setHeaders`, `removeHeader`).
- Detailed error handling with the `HttpError` class.

## Usage

### Importing the Client

```typescript
import { httpClient, securedHttpClient, HttpClient } from "@precooked/http-client";
```

### Basic Example

```typescript
// Perform a GET request
httpClient.get("/users").then(response => {
  console.log(response);
}).catch(error => {
  console.error("Error:", error.message);
});

// Perform a POST request
httpClient.post("/users", { name: "John Doe", age: 30 }).then(response => {
  console.log(response);
}).catch(error => {
  console.error("Error:", error.message);
});
```

### Using Secured Client with Interceptor

```typescript
securedHttpClient.get("/profile").then(response => {
  console.log("Profile data:", response);
}).catch(error => {
  console.error(`Error ${error.status}:`, error.message);
});
```

### Adding Interceptors Dynamically

You can add custom interceptors to modify requests dynamically:
```typescript
securedHttpClient.addInterceptor((options) => {
  console.log("Request options before sending:", options);
});

securedHttpClient.get("/profile");
```

### Customizing Headers

```typescript
httpClient.setHeaders({
  Authorization: "Bearer my-token",
  "X-Custom-Header": "value",
});

// Remove a specific header
httpClient.removeHeader("Authorization");
```

### Handling Errors with `HttpError`

Errors are thrown as instances of `HttpError`, providing detailed information:
```typescript
try {
  await httpClient.get("/invalid-endpoint");
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`Error ${error.status}:`, error.message, error.data);
  }
}
```

### Creating a Custom Client Instance

```typescript
const customClient = new HttpClient({
  baseURL: "https://api.example.com",
  headers: { "X-Custom-Header": "MyValue" },
});

customClient.get("/custom-endpoint").then(response => {
  console.log("Custom response:", response);
});
```

## API

### HttpClient

| Method                | Description                             |
|-----------------------|-----------------------------------------|
| `get(url)`            | Sends a GET request to the specified URL. |
| `post(url, data)`     | Sends a POST request with the provided data. |
| `put(url, data)`      | Sends a PUT request with the provided data. |
| `delete(url)`         | Sends a DELETE request to the specified URL. |
| `setBaseURL(url)`     | Sets the base URL for the client.       |
| `setHeaders(headers)` | Sets custom headers for requests.       |
| `removeHeader(key)`   | Removes a specific header.              |
| `addInterceptor(fn)`  | Adds a custom request interceptor.      |
| `clearInterceptors()` | Clears all interceptors.                |

## License

This package is licensed under the ISC License.

---

Developed with ❤️ by Roberto Carraro.
