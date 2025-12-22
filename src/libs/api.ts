type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  queryParams?: Record<string, string | number>;
  /**
   * When true, disables pathname safety checks in the api helper.
   * Use with caution and only for trusted URLs.
   */
  unsafePath?: boolean;
};

const SAFE_PATH_SEGMENT_REGEX = /^[A-Za-z0-9_-]+$/;

function isSafePathname(pathname: string): boolean {
  // Normalize multiple slashes and split into segments
  const segments = pathname.split("/").filter(Boolean);

  for (const segment of segments) {
    // Disallow path traversal and empty/meaningless segments
    if (segment === "." || segment === "..") {
      return false;
    }
    // Only allow simple identifier-like segments
    if (!SAFE_PATH_SEGMENT_REGEX.test(segment)) {
      return false;
    }
  }

  return true;
}

export const api = async (url: string, options: RequestOptions) => {
  if (options.queryParams) {
    const urlObj = new URL(url);

    // Validate pathname to prevent SSRF via crafted path segments
    if (!options.unsafePath && !isSafePathname(urlObj.pathname)) {
      throw new Error("Unsafe pathname detected in API request URL");
    }

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

  const urlObj = new URL(url);

  // Validate pathname to prevent SSRF via crafted path segments
  if (!options.unsafePath && !isSafePathname(urlObj.pathname)) {
    throw new Error("Unsafe pathname detected in API request URL");
  }

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
};
