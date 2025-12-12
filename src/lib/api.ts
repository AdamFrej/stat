import type { GusDataResponse, GusSubject, GusVariable } from "./types";
import { mockSubjects, mockVariables, mockData } from "./mockData";

const PROXY_BASE = "/api/proxy";

// Generic fetch wrapper
async function fetchFromApi<T>(
  endpoint: string,
  params?: URLSearchParams,
): Promise<T> {
  // Clean up endpoint leading slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const queryString = params ? `?${params.toString()}` : "";
  const url = `${PROXY_BASE}/${cleanEndpoint}${queryString}`;

  console.log(`Fetching: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Fetch failed: ${response.status} ${response.statusText}`);
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

// Specialized fetchers

export async function fetchSubjects(parentId?: string): Promise<GusSubject[]> {
  const params = new URLSearchParams({
    format: "json",
    "page-size": "100",
  });
  if (parentId) {
    params.append("parent-id", parentId);
  }

  // We assume the BDL structure here (subjects endpoint)
  // If the proxy target is strictly api.stat.gov.pl and not bdl.stat.gov.pl/api/v1,
  // this might need adjustment.
  try {
    const data = await fetchFromApi<{ results: GusSubject[] }>(
      "subjects",
      params,
    );
    return data.results || [];
  } catch (e) {
    console.warn("API Error (Subjects):", e);
    return mockSubjects;
  }
}

export async function fetchVariables(
  subjectId: string,
): Promise<GusVariable[]> {
  const params = new URLSearchParams({
    format: "json",
    "page-size": "100",
    "subject-id": subjectId,
  });

  try {
    const data = await fetchFromApi<{ results: GusVariable[] }>(
      "variables",
      params,
    );
    return data.results || [];
  } catch (e) {
    console.warn("API Error (Variables):", e);
    return mockVariables;
  }
}

export async function fetchData(
  variableId: number | string,
  yearFrom?: number,
  yearTo?: number,
): Promise<GusDataResponse> {
  const params = new URLSearchParams({
    format: "json",
    "unit-level": "0", // Country level
  });

  if (yearFrom) params.append("year-from", yearFrom.toString());
  if (yearTo) params.append("year-to", yearTo.toString());

  try {
    return await fetchFromApi<GusDataResponse>(
      `data/by-variable/${variableId}`,
      params,
    );
  } catch (e) {
    console.warn("API Error (Data):", e);
    return mockData;
  }
}
