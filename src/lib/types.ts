// TypeScript types for Car Service Tracking System

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  user_type: "admin" | "office_manager"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  customer_code: string
  name: string
  customer_type: "government" | "ngo" | "private" | "personal" | "bodaboda"
  phone: string
  email?: string
  address?: string
  is_owner?: boolean // For personal customers - true if owner, false if driver
  personal_sub_type?: "owner" | "driver" // Sub-type for personal customers
  business_name?: string // For business customers
  tax_number?: string
  registration_date: string
  last_visit?: string
  total_visits: number
  total_spent: number
  is_active: boolean
  notes?: string
  created_by: number
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: number
  customer_id: number
  plate_number: string
  make: string
  model: string
  year?: number
  color?: string
  engine_number?: string
  chassis_number?: string
  vehicle_type?: string
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface ServiceType {
  id: number
  category_id: number
  name: string
  description?: string
  estimated_duration?: number // in minutes
  base_price?: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: number
  order_number: string
  customer_id: number
  vehicle_id?: number
  order_type: "service" | "sales" | "consultation"
  status: "created" | "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "normal" | "high" | "urgent"
  description?: string
  estimated_completion?: string
  actual_completion?: string
  total_amount: number
  discount_amount: number
  tax_amount: number
  final_amount: number
  created_by: number
  assigned_to?: number
  created_at: string
  updated_at: string
}

export interface JobCard {
  id: number
  job_card_number: string
  order_id: number
  customer_id: number
  vehicle_id?: number
  status: "pending" | "in_progress" | "quality_check" | "completed" | "on_hold"
  time_in?: string
  time_out?: string
  estimated_duration?: number
  actual_duration?: number
  work_description: string
  technician_notes?: string
  quality_check_notes?: string
  customer_complaints?: string
  work_completed?: string
  assigned_technician?: number
  quality_checker?: number
  created_by: number
  completion_reason?: "completed" | "customer_cancelled" | "parts_unavailable" | "technical_issue"
  customer_satisfaction?: number
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  job_card_id: number
  customer_id: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  paid_amount: number
  balance_due: number
  invoice_date: string
  due_date: string
  paid_date?: string
  payment_method?: string
  payment_reference?: string
  generated_by: number
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: number
  category_id: number
  item_code: string
  name: string
  brand?: string
  description?: string
  unit_price: number
  quantity_in_stock: number
  minimum_stock_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimeLog {
  id: number
  job_card_id: number
  user_id: number
  activity_type: "work" | "break" | "waiting" | "quality_check"
  start_time: string
  end_time?: string
  duration_minutes?: number
  notes?: string
  created_at: string
}

export interface DashboardStats {
  todaysServices: number
  activeJobCards: number
  dailyRevenue: number
  customerVisits: number
  newCustomers: number
  returningCustomers: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}
