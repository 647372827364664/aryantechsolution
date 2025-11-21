// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "client" | "admin" | "developer"
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
}

// Service Types
export interface Service {
  id: string
  name: string
  title?: string
  description: string
  category: "hosting" | "development" | "domains" | "minecraft" | "custom" | "bots" | "gaming" | "security" | "optimization" | "consulting"
  price: number
  pricing?: string
  features: string[]
  popular?: boolean
  badge?: string
  icon?: string
  link?: string
  status?: "active" | "inactive" | "coming-soon"
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  serviceId: string
  name: string
  description: string
  price: number
  billingCycle: "monthly" | "yearly"
  features: string[]
  specifications: Record<string, any>
  popular?: boolean
}

// Order and Payment Types
export interface Order {
  id: string
  userId: string
  planId: string
  status: "pending" | "processing" | "completed" | "cancelled"
  amount: number
  currency: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "processing" | "succeeded" | "cancelled"
  clientSecret: string
}

// Dashboard Types
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeServices: number
  pendingOrders: number
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: User
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
}

// Contact and Support Types
export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  category: "general" | "support" | "sales" | "technical"
  status: "new" | "in-progress" | "resolved" | "closed"
  createdAt: Date
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed"
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

// Domain and Hosting Types
export interface Domain {
  id: string
  name: string
  userId: string
  registrar: string
  expiresAt: Date
  autoRenew: boolean
  status: "active" | "expired" | "pending" | "suspended"
  nameservers: string[]
  createdAt: Date
}

export interface HostingAccount {
  id: string
  userId: string
  planId: string
  domain: string
  cpanelUrl: string
  ftpCredentials: {
    host: string
    username: string
    password: string
  }
  status: "active" | "suspended" | "cancelled"
  expiresAt: Date
  createdAt: Date
}

// Bot and Development Types
export interface BotProject {
  id: string
  userId: string
  name: string
  type: "discord" | "telegram" | "whatsapp" | "custom"
  status: "development" | "testing" | "deployed" | "maintenance"
  features: string[]
  repository?: string
  hosting?: {
    provider: string
    url: string
    credentials: Record<string, any>
  }
  createdAt: Date
  updatedAt: Date
}

export interface DevelopmentProject {
  id: string
  userId: string
  name: string
  type: "web" | "mobile" | "desktop" | "api"
  status: "planning" | "development" | "testing" | "completed" | "maintenance"
  technologies: string[]
  repository?: string
  liveUrl?: string
  requirements: string
  timeline: {
    start: Date
    end: Date
    milestones: Array<{
      name: string
      date: Date
      completed: boolean
    }>
  }
  createdAt: Date
  updatedAt: Date
}

// Store and Marketplace Types
export interface StoreItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  images: string[]
  features: string[]
  tags: string[]
  author: User
  downloads: number
  rating: number
  reviews: number
  status: "active" | "draft" | "discontinued"
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  itemId: string
  rating: number
  comment: string
  helpful: number
  createdAt: Date
}

// Common Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  uploadedBy: string
  createdAt: Date
}
