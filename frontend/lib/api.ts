// Centralized API configuration for consistent backend connections
import {
  USE_MOCK_DATA,
  mockInventoryItems,
  mockAnalytics,
  getRegionalTopByCountry,
  mockTopSold,
  mockDeliveryAgents,
  mockStock,
} from './mockData';

// Backend URLs
export const BACKEND_URLS = {
  production: "https://backend-lnia.onrender.com",
  local: "http://localhost:5000",
};

// Get the active backend URL (prioritize production, fallback to local)
export const getBackendUrl = (): string => {
  return BACKEND_URLS.production;
};

// Helper function to try multiple backend URLs with proper error handling
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  retryLocal: boolean = true
): Promise<Response> => {
  const urls = retryLocal ? [BACKEND_URLS.production, BACKEND_URLS.local] : [BACKEND_URLS.production];
  let lastError: Error | null = null;

  for (const baseUrl of urls) {
    try {
      console.log(`🔄 Trying API call: ${baseUrl}${endpoint}`);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error(`❌ Non-JSON response from ${baseUrl}:`, textResponse);
        throw new Error(`Server returned non-JSON response: ${response.status}`);
      }

      console.log(`✅ Successfully connected to ${baseUrl}`);
      return response;

    } catch (error) {
      console.error(`❌ Failed to connect to ${baseUrl}:`, error);
      lastError = error as Error;
      continue; // Try next URL
    }
  }

  throw lastError || new Error("Failed to connect to any backend server");
};

// Helper to create a mock Response object
const createMockResponse = (data: any): Response => {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as Response;
};

// Specific API functions for different endpoints
export const api = {
  // User management
  createUser: (userData: any, token: string) =>
    apiCall('/create-db', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(userData),
    }),

  // Inventory management
  getItems: (userId: string) => {
    if (USE_MOCK_DATA) {
      console.log('📦 [MOCK] Returning mock inventory items');
      return Promise.resolve(createMockResponse({ items: mockInventoryItems }));
    }
    return apiCall(`/getItems/${userId}`);
  },

  addItem: (userId: string, itemData: any) => {
    if (USE_MOCK_DATA) {
      console.log('📦 [MOCK] Adding mock item:', itemData);
      const newItem = { _id: Date.now().toString(), ...itemData, createdAt: new Date().toISOString() };
      mockInventoryItems.push(newItem);
      return Promise.resolve(createMockResponse({ success: true, item: newItem }));
    }
    return apiCall(`/add-item/${userId}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Analytics
  getAnalytics: (userId: string) => {
    if (USE_MOCK_DATA) {
      console.log('📊 [MOCK] Returning mock analytics');
      return Promise.resolve(createMockResponse(mockAnalytics));
    }
    return apiCall(`/analytics/${userId}`);
  },

  getTopSold: (userId: string, limit: number = 5) => {
    if (USE_MOCK_DATA) {
      console.log('🏆 [MOCK] Returning mock top sold products');
      return Promise.resolve(createMockResponse({ topSold: mockTopSold.slice(0, limit) }));
    }
    return apiCall(`/top-sold/${userId}?limit=${limit}`);
  },

  getRegionalTop: (country: string, limit: number = 5) => {
    if (USE_MOCK_DATA) {
      console.log('🌍 [MOCK] Returning mock regional top for:', country);
      const products = getRegionalTopByCountry(country);
      return Promise.resolve(createMockResponse({ topRegional: products.slice(0, limit) }));
    }
    return apiCall(`/regional-top/${country}?limit=${limit}`);
  },

  // Delivery agents
  getDeliveryAgents: (userId: string, location?: string) => {
    if (USE_MOCK_DATA) {
      console.log('🚚 [MOCK] Returning mock delivery agents');
      const agents = location
        ? mockDeliveryAgents.filter(a => a.location.toLowerCase().includes(location.toLowerCase()))
        : mockDeliveryAgents;
      return Promise.resolve(createMockResponse({ agents }));
    }
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    return apiCall(`/getDeliveryAgents/${userId}${query}`);
  },

  addDeliveryAgent: (userId: string, agentData: any) => {
    if (USE_MOCK_DATA) {
      console.log('🚚 [MOCK] Adding mock delivery agent:', agentData);
      const newAgent = { _id: Date.now().toString(), ...agentData };
      mockDeliveryAgents.push(newAgent);
      return Promise.resolve(createMockResponse({ success: true, agent: newAgent }));
    }
    return apiCall(`/addDeliveryAgent/${userId}`, {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  },

  // Stock management
  getStock: (userId: string, filters?: { product_name?: string; country?: string }) => {
    if (USE_MOCK_DATA) {
      console.log('📦 [MOCK] Returning mock stock data');
      let stock = [...mockStock];
      if (filters?.product_name) {
        stock = stock.filter(s => s.product_name.toLowerCase().includes(filters.product_name!.toLowerCase()));
      }
      if (filters?.country) {
        stock = stock.filter(s => s.country.toLowerCase() === filters.country!.toLowerCase());
      }
      return Promise.resolve(createMockResponse({ stock }));
    }
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiCall(`/stock/${userId}${query}`);
  },

  setPrice: (userId: string, priceData: any) =>
    apiCall(`/set-price/${userId}`, {
      method: 'POST',
      body: JSON.stringify(priceData),
    }),

  // Forecasting
  forecast: (forecastData: any) =>
    apiCall('/forecast', {
      method: 'POST',
      body: JSON.stringify(forecastData),
    }),

  // Billing
  createBill: (userId: string, billData: any) =>
    apiCall(`/bill/${userId}`, {
      method: 'POST',
      body: JSON.stringify(billData),
    }),

  // Dynamic pricing
  dynamicPricing: (userId: string, pricingData: any) =>
    apiCall(`/dynamic-pricing/${userId}`, {
      method: 'POST',
      body: JSON.stringify(pricingData),
    }),

  // Replenishment
  replenishCheck: (userId: string) =>
    apiCall(`/replenish/check/${userId}`, {
      method: 'POST',
    }),
};

// Helper function to get userId from localStorage with error handling
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userId = "690e541f164b48a3147069dd";
    if (!userId) {
      console.warn('⚠️ No userId found in localStorage');
      return null;
    }
    return userId;
  } catch (error) {
    console.error('❌ Error accessing localStorage:', error);
    return null;
  }
};

// Helper function to get user info from localStorage
export const getUserInfo = (): any | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('❌ Error parsing userInfo from localStorage:', error);
    return null;
  }
};