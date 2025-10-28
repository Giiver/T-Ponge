import Dexie, { Table } from 'dexie'
import { Order, Product, AppSettings } from '../types'

export class TPongeDatabase extends Dexie {
  orders!: Table<Order>
  products!: Table<Product>
  settings!: Table<AppSettings>

  constructor() {
    super('TPongeOrdersDB')
    this.version(1).stores({
      orders: 'id, createdAt, salesPoint, totalTTC',
      products: 'sku, label, isActive',
      settings: 'id',
    })
  }
}

export const db = new TPongeDatabase()

// Reset database completely (for development/testing)
export const resetDatabase = async () => {
  try {
    await db.products.clear()
    await db.orders.clear()
    await db.settings.clear()
    console.log('Database reset successfully')
    await initializeDatabase()
  } catch (error) {
    console.error('Error resetting database:', error)
  }
}

// Initialize default data
export const initializeDatabase = async () => {
  try {
    // Check if settings exist
    const existingSettings = await db.settings.get('main')
    if (!existingSettings) {
      // Initialize default settings
      await db.settings.add({
        id: 'main',
        tabletId: 'TAB1', // This should be configurable
        salesPoint: 'Foire Dijon – Jour 1 – Tablette 1',
        lastOrderCounter: 0,
      })
    }

    // Check if products need sortOrder field - force reset if missing
    const existingProducts = await db.products.toArray()
    const needsReset = existingProducts.length === 0 || 
                      existingProducts.some(p => p.sortOrder === undefined) ||
                      existingProducts.length !== 4
    
    if (needsReset) {
      await db.products.clear()
      console.log('Resetting products to ensure correct order with sortOrder field')
    }
    
    // TEMPORARY: Force reset for development - remove after testing
    if (existingProducts.length > 0 && existingProducts[0].label?.includes('Recharge')) {
      await db.products.clear()
      console.log('FORCE RESET: Recharge was first, resetting order')
    }
    
    // Check if we need to add products after any reset
    const currentProductCount = await db.products.count()
    if (currentProductCount === 0) {
      // Initialize T-Ponge products (T-Ponge, Recharge, Pack, Livraison)
      const defaultProducts: Product[] = [
        { 
          sku: 'TPONGE001', 
          label: 'T-Ponge - Éponge Révolutionnaire', 
          priceTTC: 12.90, 
          originalPrice: 15.99,
          images: [`${import.meta.env.BASE_URL}t-ponge.PNG`], 
          isActive: true,
          sortOrder: 1
        },
        { 
          sku: 'RECHARGE001', 
          label: 'Recharge T-Ponge', 
          priceTTC: 4.90, 
          originalPrice: 7.99,
          images: [`${import.meta.env.BASE_URL}recharge-1.PNG`, `${import.meta.env.BASE_URL}recharge-2.PNG`], 
          isActive: true,
          sortOrder: 2
        },
        { 
          sku: 'PACK001', 
          label: 'Pack T-Ponge - Éponge + Recharge', 
          priceTTC: 16.90, 
          originalPrice: 23.98,
          images: [`${import.meta.env.BASE_URL}t-ponge.PNG`], 
          isActive: true,
          sortOrder: 3
        },
        { 
          sku: 'LIVRAISON001', 
          label: 'Livraison', 
          priceTTC: 4.90, 
          images: [], 
          isActive: true,
          sortOrder: 4
        },
      ]
      await db.products.bulkAdd(defaultProducts)
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// Generate order ID
export const generateOrderId = async (): Promise<string> => {
  const settings = await db.settings.get('main')
  if (!settings) throw new Error('Settings not found')

  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const newCounter = settings.lastOrderCounter + 1
  const counterStr = newCounter.toString().padStart(4, '0')

  const orderId = `${settings.tabletId}-${dateStr}-${counterStr}`

  // Update counter
  await db.settings.update('main', { lastOrderCounter: newCounter })

  return orderId
}

// Export orders to CSV
export const exportOrdersToCSV = async (): Promise<string> => {
  const orders = await db.orders.orderBy('createdAt').toArray()
  
  const headers = [
    'ID Commande',
    'Date Création',
    'Point de Vente',
    'Nom Client',
    'Prénom Client',
    'Email Client',
    'Téléphone Client',
    'Adresse Client',
    'SKU Produit',
    'Libellé Produit',
    'Quantité',
    'Prix Unitaire TTC',
    'Total Ligne TTC',
    'Total Commande TTC',
    'Notes'
  ]

  const csvRows = [headers.join(',')]

  orders.forEach(order => {
    if (order.items.length === 0) {
      // Empty order
      csvRows.push([
        `"${order.id}"`,
        `"${order.createdAt}"`,
        `"${order.salesPoint}"`,
        `"${order.customerName || ''}"`,
        `"${order.customerFirstName || ''}"`,
        `"${order.customerEmail || ''}"`,
        `"${order.customerPhone || ''}"`,
        `"${order.customerAddress || ''}"`,
        '""',
        '""',
        '0',
        '0',
        '0',
        order.totalTTC.toString(),
        `"${order.notes || ''}"`
      ].join(','))
    } else {
      order.items.forEach(item => {
        csvRows.push([
          `"${order.id}"`,
          `"${order.createdAt}"`,
          `"${order.salesPoint}"`,
          `"${order.customerName || ''}"`,
          `"${order.customerFirstName || ''}"`,
          `"${order.customerEmail || ''}"`,
          `"${order.customerPhone || ''}"`,
          `"${order.customerAddress || ''}"`,
          `"${item.productSku}"`,
          `"${item.productLabel}"`,
          item.qty.toString(),
          item.unitPriceTTC.toString(),
          item.lineTotalTTC.toString(),
          order.totalTTC.toString(),
          `"${order.notes || ''}"`
        ].join(','))
      })
    }
  })

  return csvRows.join('\n')
}

// Download CSV file
export const downloadCSV = async () => {
  try {
    const csvContent = await exportOrdersToCSV()
    const settings = await db.settings.get('main')
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
    
    const filename = `commandes-${settings?.tabletId || 'TAB'}-${dateStr}-${timeStr}.csv`
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    console.log(`CSV exported: ${filename}`)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw error
  }
}
