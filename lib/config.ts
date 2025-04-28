// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://condidate-test-be.onrender.com',
  ENDPOINTS: {
    JOBS: '/jobs',
    CANDIDATES: '/candidates',
    MATCH: '/match',
    SEARCH_CANDIDATES: '/candidates/search',
  }
};

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to get search URL with parameters
export function getSearchUrl(endpoint: string, params: Record<string, string>): string {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}
