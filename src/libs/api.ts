type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: object;
  queryParams?: Record<string, string | number>;
  unwrapData?: boolean; // Option to unwrap { status, message, data } response
};

type BackendResponse<T = any> = {
  status: string;
  message: string;
  data: T;
};

export const api = async (url: string, options: RequestOptions) => {
  const { unwrapData = true, ...fetchOptions } = options;

  if (fetchOptions.queryParams) {
    const separator = url.includes("?") ? "&" : "?";
    const queryString = new URLSearchParams(
      fetchOptions.queryParams as any,
    ).toString();
    const finalUrl = `${url}${separator}${queryString}`;

    const response = await fetch(finalUrl, {
      method: fetchOptions.method,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {}),
      },
      body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
    });

    if (!response.ok) {
      // Try to parse error response, but handle empty body
      const text = await response.text();
      let errorData: any = {};
      if (text) {
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text };
        }
      }
      const message =
        errorData.message || errorData.data?.message || "Request failed";
      return { statusCode: response.status, message };
    }

    // Handle empty response body
    const text = await response.text();
    if (!text) {
      return {};
    }

    let jsonData;
    try {
      jsonData = JSON.parse(text);
    } catch {
      return { statusCode: 500, message: "Invalid JSON response from server" };
    }

    // Auto-unwrap backend ResponseInterceptor format: { status, message, data }
    if (unwrapData && jsonData.data !== undefined) {
      return jsonData.data;
    }

    return jsonData;
  }

  const response = await fetch(url, {
    method: fetchOptions.method,
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
  });

  if (!response.ok) {
    // Try to parse error response, but handle empty body
    const text = await response.text();
    let errorData: any = {};
    if (text) {
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
    }
    const message =
      errorData.message || errorData.data?.message || "Request failed";
    return { statusCode: response.status, message };
  }

  // Handle empty response body
  const text = await response.text();
  if (!text) {
    return {};
  }

  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch {
    return { statusCode: 500, message: "Invalid JSON response from server" };
  }

  // Auto-unwrap backend ResponseInterceptor format: { status, message, data }
  if (unwrapData && jsonData.data !== undefined) {
    return jsonData.data;
  }

  return jsonData;
};
