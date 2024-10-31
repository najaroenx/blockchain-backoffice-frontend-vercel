type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  queryParams?: Record<string, string | number>;
};

export const api = async (url: string, options: RequestOptions) => {
  if (options.queryParams) {
    const urlObj = new URL(url);

    Object.entries(options.queryParams).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value.toString());
    });

    const response = await fetch(urlObj.toString(), {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const { message } = await response.json();
      return { statusCode: response.status, message };
    }

    return await response.json();
  }

  const response = await fetch(url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const { message } = await response.json();
    return { statusCode: response.status, message };
  }

  return await response.json();
};
