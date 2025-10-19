// apiCaller.ts

const BASE_URL = 'http://localhost:3000/api';

// This is a placeholder for a real API. In this project, it will be intercepted
// and handled by our dummy data provider.
// In a real-world scenario, you wouldn't need the dummy data logic.

import { DUMMY_API_RESPONSE } from './api/dummyApiData';

const getJwtToken = (): string | null => {
  try {
    return localStorage.getItem('jwt_token');
  } catch (e) {
    console.error('Could not access localStorage', e);
    return null;
  }
};

const apiCaller = async <T,>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: Record<string, any> | FormData,
  isFormData: boolean = false
): Promise<T> => {
  const token = getJwtToken();
  const headers = new Headers();
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // --- MOCK API LOGIC START ---
  // This block simulates the backend response. In a real app, you would
  // remove this and let the fetch call go to your server.
  console.log(`[API Caller MOCK] ${method} ${path}`, { body });
  const response = DUMMY_API_RESPONSE(method, path, body);
  if (response.status >= 400) {
    console.error(`[API Caller MOCK] Error ${response.status}:`, response.data);
    throw new Error(response.data.message || 'An API error occurred');
  }
  console.log(`[API Caller MOCK] Success ${response.status}:`, response.data);
  return response.data as T;
  // --- MOCK API LOGIC END ---

  /*
  // --- REAL API LOGIC START ---
  // In a real application, you would use this fetch logic.
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
  // --- REAL API LOGIC END ---
  */
};

export const api = {
  get: <T,>(path: string) => apiCaller<T>(path, 'GET'),
  post: <T,>(path: string, body: Record<string, any>) => apiCaller<T>(path, 'POST', body),
  postForm: <T,>(path: string, formData: FormData) => apiCaller<T>(path, 'POST', formData, true),
  put: <T,>(path: string, body: Record<string, any>) => apiCaller<T>(path, 'PUT', body),
  delete: <T,>(path: string) => apiCaller<T>(path, 'DELETE'),
};