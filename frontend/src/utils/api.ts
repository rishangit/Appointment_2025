import { ApiResponse, LoginResponse } from '../types'

const API_BASE_URL = '/api'

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

// Helper function to create headers
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    ...options,
    headers: createHeaders(endpoint !== '/auth/login' && endpoint !== '/auth/register'),
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    
    return data
      } catch (error) {
      throw error
    }
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData: any): Promise<LoginResponse> => {
    return apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  getProfile: async (): Promise<ApiResponse<{ user: any }>> => {
    return apiRequest<{ user: any }>('/auth/profile')
  },
}

// Admin API functions
export const adminAPI = {
  getDashboard: async (): Promise<ApiResponse<{ stats: any }>> => {
    return apiRequest<{ stats: any }>('/admin/dashboard')
  },

  getCompanies: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/admin/companies')
  },

  updateCompanyStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/admin/companies/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  deleteCompany: async (id: number): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/admin/companies/${id}`, {
      method: 'DELETE',
    })
  },

  getUsers: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/admin/users')
  },

  deleteUser: async (id: number): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  },

  getBilling: async (startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    let url = '/admin/billing'
    const params = new URLSearchParams()
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return apiRequest<any>(url)
  },

  getAppointments: async (filters?: {
    company_id?: string
    start_date?: string
    end_date?: string
    status?: string
  }): Promise<ApiResponse<any>> => {
    let url = '/admin/appointments'
    const params = new URLSearchParams()
    
    if (filters?.company_id) params.append('company_id', filters.company_id)
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.status) params.append('status', filters.status)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return apiRequest<any>(url)
  },
}

// Company API functions
export const companyAPI = {
  getDashboard: async (): Promise<ApiResponse<{ stats: any }>> => {
    return apiRequest<{ stats: any }>('/company/dashboard')
  },

  getAppointments: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/company/appointments')
  },

  createAppointment: async (appointmentData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/company/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    })
  },

  updateAppointmentStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/company/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  getServices: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/company/services')
  },

  createService: async (serviceData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/company/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })
  },

  updateService: async (id: number, serviceData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/company/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })
  },

  deleteService: async (id: number): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/company/services/${id}`, {
      method: 'DELETE',
    })
  },

  getCompanyProfile: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/company/profile')
  },

  updateCompanyProfile: async (companyData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/company/profile', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    })
  },

  getCompanyUsers: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/company/users')
  },
}

// User API functions
export const userAPI = {
  getDashboard: async (): Promise<ApiResponse<{ stats: any }>> => {
    return apiRequest<{ stats: any }>('/user/dashboard')
  },

  getCompanies: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/user/companies')
  },

  getAllCompanies: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/user/all-companies')
  },

  getServices: async (companyId: number): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>(`/user/services?company_id=${companyId}`)
  },

  getMyAppointments: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/user/my-appointments')
  },

  createAppointment: async (appointmentData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/user/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    })
  },

  cancelAppointment: async (id: number): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/user/appointments/${id}/cancel`, {
      method: 'PUT',
    })
  },
}
