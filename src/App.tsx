import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { ProductGrid } from './components/ProductGrid'
import { Cart } from './components/Cart'
import { CheckoutModal } from './components/CheckoutModal'
import { SettingsModal } from './components/SettingsModal'
import { db, initializeDatabase, generateOrderId, downloadCSV } from './services/database'
import { Product, CartItem, Order, AppSettings } from './types'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase()
        await loadData()
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }
    init()
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadData = async () => {
    try {
      const [productsData, settingsData] = await Promise.all([
        db.products.toArray(),
        db.settings.get('main')
      ])
      
      // Sort products by sortOrder (T-Ponge first, then Recharge)
      const sortedProducts = productsData.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
      setProducts(sortedProducts)
      setSettings(settingsData || null)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productSku === product.sku)
    
    if (existingItem) {
      updateCartItemQuantity(existingItem.tempId, existingItem.qty + 1)
    } else {
      const newItem: CartItem = {
        tempId: `temp-${Date.now()}-${Math.random()}`,
        productSku: product.sku,
        productLabel: product.label,
        qty: 1,
        unitPriceTTC: product.priceTTC,
        lineTotalTTC: product.priceTTC
      }
      setCartItems(prev => [...prev, newItem])
    }
  }

  const updateCartItemQuantity = (tempId: string, newQty: number) => {
    if (newQty <= 0) {
      removeCartItem(tempId)
      return
    }

    setCartItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        return {
          ...item,
          qty: newQty,
          lineTotalTTC: item.unitPriceTTC * newQty
        }
      }
      return item
    }))
  }

  const removeCartItem = (tempId: string) => {
    setCartItems(prev => prev.filter(item => item.tempId !== tempId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const handleCheckout = async (customerName?: string, customerPhone?: string, notes?: string) => {
    try {
      const orderId = await generateOrderId()
      const total = cartItems.reduce((sum, item) => sum + item.lineTotalTTC, 0)
      
      const order: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items: cartItems.map(item => ({
          productSku: item.productSku,
          productLabel: item.productLabel,
          qty: item.qty,
          unitPriceTTC: item.unitPriceTTC,
          lineTotalTTC: item.lineTotalTTC
        })),
        totalTTC: total,
        salesPoint: settings?.salesPoint || 'Point de vente non configuré',
        customerName,
        customerPhone,
        notes
      }

      await db.orders.add(order)
      
      // Clear cart and close modal
      clearCart()
      setIsCheckoutOpen(false)
      
      // Show success message
      alert(`Commande ${orderId} enregistrée avec succès !`)
      
    } catch (error) {
      console.error('Failed to save order:', error)
      alert('Erreur lors de l\'enregistrement de la commande')
    }
  }

  const handleExport = async () => {
    try {
      await downloadCSV()
      alert('Export CSV réussi ! Le fichier a été téléchargé.')
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Erreur lors de l\'export CSV')
    }
  }

  const handleSaveSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      if (settings) {
        await db.settings.update('main', newSettings)
        setSettings({ ...settings, ...newSettings })
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Erreur lors de la sauvegarde des paramètres')
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.lineTotalTTC, 0)

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Chargement de l'application...</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <Header
        salesPoint={settings?.salesPoint || 'Configuration requise'}
        onSettings={() => setIsSettingsOpen(true)}
        isOnline={isOnline}
      />
      
      <main className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Catalogue des produits - 100% largeur */}
          <div style={{ width: '100%' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              Catalogue des produits
            </h2>
            <ProductGrid products={products} onAddToCart={addToCart} />
          </div>
          
          {/* Panier en dessous */}
          <div style={{ width: '100%' }}>
            <Cart
              items={cartItems}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeCartItem}
              onCheckout={() => setIsCheckoutOpen(true)}
              onClear={clearCart}
            />
          </div>
        </div>
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleCheckout}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        onExport={handleExport}
      />
    </div>
  )
}

export default App
