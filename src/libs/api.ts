type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export const api = async (url: string, options: RequestOptions) => {
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
