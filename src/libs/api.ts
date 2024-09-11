type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export const api = async (url: string, options: RequestOptions) => {
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
