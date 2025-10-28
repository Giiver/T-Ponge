import React, { useState } from 'react'
import { CartItem } from '../types'

interface CheckoutModalProps {
  isOpen: boolean
  items: CartItem[]
  total: number
  onClose: () => void
  onConfirm: (customerName?: string, customerFirstName?: string, customerEmail?: string, customerPhone?: string, customerAddress?: string, notes?: string) => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  total,
  onClose,
  onConfirm
}) => {
  const [customerName, setCustomerName] = useState('')
  const [customerFirstName, setCustomerFirstName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(
      customerName.trim() || undefined,
      customerFirstName.trim() || undefined,
      customerEmail.trim() || undefined,
      customerPhone.trim() || undefined,
      customerAddress.trim() || undefined,
      notes.trim() || undefined
    )
    // Reset form
    setCustomerName('')
    setCustomerFirstName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setCustomerAddress('')
    setNotes('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Finaliser la commande</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Récapitulatif</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', margin: '1rem 0' }}>
            {items.map(item => (
              <div key={item.tempId} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.productLabel}</div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {item.unitPriceTTC.toFixed(2)} € × {item.qty}
                  </div>
                </div>
                <div style={{ fontWeight: '600' }}>
                  {item.lineTotalTTC.toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            textAlign: 'right',
            borderTop: '2px solid #e2e8f0',
            paddingTop: '1rem'
          }}>
            Total: {total.toFixed(2)} €
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">Nom :</label>
            <input
              type="text"
              id="customerName"
              className="input"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Nom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerFirstName">Prénom :</label>
            <input
              type="text"
              id="customerFirstName"
              className="input"
              value={customerFirstName}
              onChange={e => setCustomerFirstName(e.target.value)}
              placeholder="Prénom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Mail :</label>
            <input
              type="email"
              id="customerEmail"
              className="input"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Téléphone :</label>
            <input
              type="tel"
              id="customerPhone"
              className="input"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="Numéro de téléphone"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerAddress">Adresse :</label>
            <textarea
              id="customerAddress"
              className="input"
              value={customerAddress}
              onChange={e => setCustomerAddress(e.target.value)}
              placeholder="Adresse complète"
              rows={2}
              style={{ resize: 'vertical', minHeight: '60px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes :</label>
            <textarea
              id="notes"
              className="input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes sur la commande"
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-success btn-large"
              style={{ flex: 2 }}
            >
              Confirmer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
