import { 
  DocumentGenerationRequest, 
  DocumentGenerationResult,
  ApiResponse 
} from '../types/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async generateDocument(request: DocumentGenerationRequest): Promise<ApiResponse<DocumentGenerationResult>> {
    return this.request<DocumentGenerationResult>('/api/documents/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async getDocument(documentId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/documents/${documentId}`);
  }

  async exportDocument(documentId: string, format: string): Promise<ApiResponse<any>> {
    return this.request<any>('/api/documents/export', {
      method: 'POST',
      body: JSON.stringify({
        document_id: documentId,
        format
      })
    });
  }

  async getTemplates(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/documents/templates');
  }

  async generateQuestions(request: any): Promise<ApiResponse<any>> {
    return this.request<any>('/api/questions/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async getQuestions(filters: any = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams(filters);
    return this.request<any[]>(`/api/questions?${params}`);
  }

  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

// Singleton instance
export const apiService = new ApiService();

// Hook for React components
export const useApiService = () => {
  return apiService;
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Retry utility for failed requests
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw new Error('Max retries exceeded');
};