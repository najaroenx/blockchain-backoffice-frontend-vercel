type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
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

  // Validate and parse URL first
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Validate protocol to prevent usage of non-standard protocols (e.g. javascript:, file:)
  if (!["http:", "https:"].includes(urlObj.protocol)) {
    throw new Error(`Invalid protocol: ${urlObj.protocol}`);
  }

  if (fetchOptions.queryParams) {
    Object.entries(fetchOptions.queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(urlObj.toString(), {
    method: fetchOptions.method,
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message || errorData.data?.message || "Request failed";
    return { statusCode: response.status, message };
  }

  const jsonData = await response.json().catch(() => ({}));

  // Auto-unwrap backend ResponseInterceptor format: { status, message, data }
  if (unwrapData && jsonData.data !== undefined) {
    return jsonData.data;
  }

  return jsonData;
};
