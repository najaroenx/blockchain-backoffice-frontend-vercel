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

const readResponseBody = async (response: Response) => {
  if (typeof response.text === "function") {
    return response.text();
  }

  if (typeof response.json === "function") {
    return JSON.stringify(await response.json());
  }

  return "";
};

export const api = async (url: string, options: RequestOptions) => {
  const { unwrapData = true, ...fetchOptions } = options;

  // Build final URL (with or without query params)
  const finalUrl = fetchOptions.queryParams
    ? `${url}${url.includes("?") ? "&" : "?"}${new URLSearchParams(fetchOptions.queryParams as any).toString()}`
    : url;

  const response = await fetch(finalUrl, {
    method: fetchOptions.method,
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
  });

  if (!response.ok) {
    const text = await readResponseBody(response);
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
    const err = new Error(message) as Error & { statusCode: number };
    err.statusCode = response.status;
    throw err;
  }

  const text = await readResponseBody(response);
  if (!text) return {};

  let jsonData: any;
  try {
    jsonData = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (unwrapData && jsonData.data !== undefined) {
    return jsonData.data;
  }

  return jsonData;
};
