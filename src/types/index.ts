export interface OrderItem {
  productSku: string
  productLabel: string
  qty: number
  unitPriceTTC: number
  lineTotalTTC: number
}

export interface Order {
  id: string // Format: ${tabletId}-${YYYYMMDD}-${counter4}
  createdAt: string // ISO string
  items: OrderItem[]
  totalTTC: number
  salesPoint: string
  notes?: string
  customerName?: string
  customerPhone?: string
}

export interface Product {
  sku: string
  label: string
  priceTTC: number
  originalPrice?: number // Prix barré si en promotion
  images: string[] // URLs des images
  isActive: boolean
}

export interface AppSettings {
  id: string
  tabletId: string
  salesPoint: string
  lastOrderCounter: number
}

export interface CartItem extends OrderItem {
  tempId: string // For cart management
}
