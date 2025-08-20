export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  COMPANY = 'company',
  USER = 'user'
}

export interface Company {
  id: number
  name: string
  address: string
  phone: string
  email: string
  status: 'active' | 'suspended' | 'pending'
  userId: number
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  name: string
  description: string
  duration: number
  price: number
  companyId: number
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: number
  userId: number
  companyId: number
  serviceId: number
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers?: number
  totalCompanies?: number
  totalAppointments?: number
  totalRevenue?: number
  upcomingAppointments?: number
  totalAppointmentsUser?: number
  totalAppointmentsCompany?: number
  totalServices?: number
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
