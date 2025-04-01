import { toast } from '@/components/ui/use-toast';
import { FIR, Evidence } from '@/services/blockchainService';
import { MONGODB_CONFIG } from '@/config/mongodb';

// This is a frontend-friendly API service using the Fetch API
// It would be used to communicate with a backend server that handles MongoDB operations

class ApiService {
  private apiUrl = 'https://your-backend-api.com'; // Replace with your actual backend API URL
  private mockData = false; // Changed from true to false to use MongoDB
  private mongoDbUrl = MONGODB_CONFIG.url;

  // Constructor to initialize with MongoDB config
  constructor() {
    console.log('ApiService initialized with MongoDB URL pattern:', 
      this.mongoDbUrl.replace(/\/\/(.+?)@/, '//****@')); // Logs URL with credentials hidden
    console.log('Using MongoDB connection:', this.mockData ? 'No (using mock data)' : 'Yes');
  }

  // Helper method for making API requests
  private async request<T>(endpoint: string, options: RequestInit = {}, queryParams?: Record<string, any>): Promise<T> {
    if (this.mockData) {
      // If in mock mode, delegate to the existing blockchainService
      // We'll import it dynamically to avoid circular dependencies
      const { blockchainService } = await import('./blockchainService');
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const method = options.method || 'GET';
      const body = options.body ? JSON.parse(options.body as string) : undefined;
      
      if (endpoint === 'firs' && method === 'GET') {
        return blockchainService.getFIRs(queryParams) as unknown as T;
      }
      else if (endpoint.startsWith('firs/') && method === 'GET') {
        const id = endpoint.split('/')[1];
        return blockchainService.getFIRById(id) as unknown as T;
      }
      else if (endpoint === 'firs' && method === 'POST') {
        return blockchainService.fileFIR(body) as unknown as T;
      }
      else if (endpoint === 'statistics' && method === 'GET') {
        return blockchainService.getFIRStatistics() as unknown as T;
      }
      
      throw new Error(`Unhandled mock endpoint: ${method} ${endpoint}`);
    }
    
    try {
      let url = `${this.apiUrl}/${endpoint}`;
      
      // Add query parameters if provided
      if (queryParams && Object.keys(queryParams).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      toast({
        variant: "destructive",
        title: "API Request Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  }

  // FIR related methods
  async getFIRs(filters?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    policeName?: string;
    status?: string;
  }): Promise<FIR[]> {
    return this.request<FIR[]>('firs', { method: 'GET' }, filters);
  }

  async getFIRById(id: string): Promise<FIR | null> {
    return this.request<FIR | null>(`firs/${id}`);
  }

  async fileFIR(firData: Omit<FIR, 'id' | 'isVerified' | 'timestamp' | 'ipfsCID' | 'blockchainTxHash'>): Promise<FIR> {
    return this.request<FIR>('firs', {
      method: 'POST',
      body: JSON.stringify(firData),
    });
  }

  async verifyFIR(id: string): Promise<boolean> {
    return this.request<boolean>(`firs/${id}/verify`, {
      method: 'POST',
    });
  }

  async getFIRStatistics(): Promise<{
    pendingCount: number;
    investigatingCount: number;
    closedCount: number;
    firsByLocation: { location: string; count: number }[];
    firsByOfficer: { officer: string; count: number }[];
    firsByMonth: { month: string; count: number }[];
  }> {
    return this.request<any>('statistics');
  }
}

// Export a singleton instance
export const apiService = new ApiService();
