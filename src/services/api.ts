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
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          url: url
        });
        console.error('❌ Full Error Details:', JSON.stringify(errorData, null, 2));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          JSON.stringify(errorData) ||
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

  // AI API request method for Modal backend
  private async aiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const aiApiUrl = import.meta.env.VITE_AI_API_URL || this.baseUrl;
    const url = `${aiApiUrl}${endpoint}`;
    
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
        console.error('❌ AI API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          url: url
        });
        throw new Error(
          errorData.detail || 
          errorData.message || 
          JSON.stringify(errorData) ||
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`AI API Request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

   // Add authentication headers for authenticated requests
  private async authenticatedRequest<T>(
    endpoint: string,
    authToken: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // User Profile API
  async getUserProfile(authToken: string): Promise<ApiResponse<any>> {
    return this.authenticatedRequest<any>('/api/users/profile', authToken);
  }

  async updateUserProfile(authToken: string, profileData: any): Promise<ApiResponse<any>> {
    return this.authenticatedRequest<any>('/api/users/profile', authToken, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getUserAssessmentData(authToken: string): Promise<ApiResponse<any>> {
    return this.authenticatedRequest<any>('/api/users/assessment-data', authToken);
  }

  private mapDetailLevelToBackend(frontendLevel: string | number): number {
    // Map frontend DetailLevel strings to backend integers
    if (typeof frontendLevel === 'number') return frontendLevel;
    
    const mapping: Record<string, number> = {
      'minimal': 1,
      'medium': 5, 
      'comprehensive': 9,
      'guided': 10
    };
    
    return mapping[frontendLevel] || 5; // Default to medium
  }

  async generateDocument(request: DocumentGenerationRequest): Promise<ApiResponse<DocumentGenerationResult>> {
    // Convert request to match backend expectations
    const backendRequest = {
      ...request,
      detail_level: this.mapDetailLevelToBackend(request.detail_level as any)
    };
    
    console.log('🚀 Frontend sending request to Modal AI API:', JSON.stringify(backendRequest, null, 2));
    
    // Use Modal AI API for document generation
    return this.aiRequest<DocumentGenerationResult>('/api/generation/documents/generate-markdown', {
      method: 'POST',
      body: JSON.stringify(backendRequest)
    });
  }

  async getDocument(documentId: string): Promise<ApiResponse<any>> {
    console.log('🚀 Getting document via AI API:', { documentId });
    
    return this.aiRequest<any>(`/api/generation/documents/${documentId}`);
  }

  async exportDocument(documentId: string, format: string): Promise<ApiResponse<any>> {
    console.error('🚨 OLD API METHOD CALLED: exportDocument()');
    console.error('📋 Document ID:', documentId);
    console.error('📋 Format:', format);
    console.error('🔍 Call stack:', new Error().stack);
    console.error('⚠️  This will return MOCK DATA - use generate-markdown endpoint instead!');
    
    return this.aiRequest<any>('/api/generation/documents/export', {
      method: 'POST',
      body: JSON.stringify({
        document_id: documentId,
        format
      })
    });
  }

  async getTemplates(): Promise<ApiResponse<any[]>> {
    console.log('🚀 Getting templates via AI API');
    
    return this.aiRequest<any[]>('/api/generation/documents/templates');
  }

  async generateQuestions(request: any): Promise<ApiResponse<any>> {
    // Use Modal AI API for question generation
    return this.aiRequest<any>('/api/questions/generate', {
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