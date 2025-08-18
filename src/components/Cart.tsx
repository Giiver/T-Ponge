import React from 'react'
import { CartItem } from '../types'

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (tempId: string, newQty: number) => void
  onRemoveItem: (tempId: string) => void
  onCheckout: () => void
  onClear: () => void
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClear
}) => {
  const total = items.reduce((sum, item) => sum + item.lineTotalTTC, 0)

  if (items.length === 0) {
    return (
      <div className="cart">
        <h2>Panier</h2>
        <p style={{ textAlign: 'center', color: '#64748b', margin: '2rem 0' }}>
          Votre panier est vide
        </p>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2>Panier ({items.length} article{items.length > 1 ? 's' : ''})</h2>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {items.map(item => (
          <div key={item.tempId} className="cart-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {item.productLabel}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                {item.unitPriceTTC.toFixed(2)} € × {item.qty} = {item.lineTotalTTC.toFixed(2)} €
              </div>
            </div>
            
            <div className="qty-controls">
              <button
                className="qty-btn"
                onClick={() => onUpdateQuantity(item.tempId, Math.max(0, item.qty - 1))}
              >
                −
              </button>
              <div className="qty-display">{item.qty}</div>
              <button
                className="qty-btn"
                onClick={() => onUpdateQuantity(item.tempId, item.qty + 1)}
              >
                +
              </button>
              <button
                className="btn btn-danger"
                style={{ marginLeft: '1rem', minWidth: 'auto', padding: '0.5rem' }}
                onClick={() => onRemoveItem(item.tempId)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-total">
        Total: {total.toFixed(2)} €
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onClear} style={{ flex: 1 }}>
          Vider
        </button>
        <button className="btn btn-primary btn-large" onClick={onCheckout} style={{ flex: 2 }}>
          Finaliser la commande
        </button>
      </div>
    </div>
  )
}
