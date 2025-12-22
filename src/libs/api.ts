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
  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch (error) {
    // If we're on the client, we might be dealing with a relative path
    if (typeof window !== "undefined" && !url.startsWith("http")) {
      urlObj = new URL(url, window.location.origin);
    } else {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  // Security Check: Protocol (SSRF protection)
  if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
    throw new Error(
      `Invalid protocol: ${urlObj.protocol}. Only http and https are allowed.`
    );
  }

  // Security Check: Path Traversal
  if (!options.unsafePath && !isSafePathname(urlObj.pathname)) {
    throw new Error("Unsafe pathname detected in API request URL");
  }

  // Handle Query Parameters
  if (options.queryParams) {
    Object.entries(options.queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, value.toString());
      }
    });
  }

  // SSRF Protection: Ensure we are only talking to our backend or self.
  if (
    process.env.NEXT_PUBLIC_BACKEND_URL &&
    !options.unsafePath &&
    urlObj.origin !== new URL(process.env.NEXT_PUBLIC_BACKEND_URL).origin &&
    (typeof window !== "undefined"
      ? urlObj.origin !== window.location.origin
      : true)
  ) {
    // Allow localhost for dev
    if (
      process.env.NODE_ENV !== "development" ||
      urlObj.hostname !== "localhost"
    ) {
      throw new Error(
        `SSRF Prevention: Request to ${urlObj.origin} is not allowed.`
      );
    }
  }

  // Construct trusted URL from hardcoded origin to break SSRF taint flow
  const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_URL
    ? new URL(process.env.NEXT_PUBLIC_BACKEND_URL).origin
    : urlObj.origin;
  const trustedUrl = new URL(urlObj.pathname + urlObj.search, backendOrigin);

  const response = await fetch(trustedUrl.toString(), {
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
