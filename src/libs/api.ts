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
      fetchOptions.queryParams as any
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
      const errorData = await response.json();
      const message =
        errorData.message || errorData.data?.message || "Request failed";
      return { statusCode: response.status, message };
    }

    const jsonData = await response.json();

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
    const errorData = await response.json();
    const message =
      errorData.message || errorData.data?.message || "Request failed";
    return { statusCode: response.status, message };
  }

  const jsonData = await response.json();

  // Auto-unwrap backend ResponseInterceptor format: { status, message, data }
  if (unwrapData && jsonData.data !== undefined) {
    return jsonData.data;
  }

  return jsonData;
};
