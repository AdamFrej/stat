import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const BASE_URL = "https://bdl.stat.gov.pl/api/v1/";

export const GET: RequestHandler = async ({ params, url, fetch }) => {
  const path = params.path;

  // Forward the query string
  const targetUrl = `${BASE_URL}${path}${url.search}`;

  try {
    const upstreamResponse = await fetch(targetUrl);

    // Create a new response with the upstream body and headers
    const headers = new Headers();
    upstreamResponse.headers.forEach((value, key) => {
      // Filter out headers that might cause issues or are irrelevant
      // We remove content-encoding because the body is already decoded by the fetch API
      // We remove content-length because it might change if we modify the body (though we aren't here)
      if (
        key.toLowerCase() !== "content-encoding" &&
        key.toLowerCase() !== "content-length"
      ) {
        headers.set(key, value);
      }
    });

    // Ensure content-type is set (usually JSON for this API)
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  } catch (e) {
    console.error("Proxy error:", e);
    error(500, "Error fetching data from upstream API");
  }
};
