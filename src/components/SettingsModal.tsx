import React, { useState, useEffect } from 'react'
import { AppSettings } from '../types'

interface SettingsModalProps {
  isOpen: boolean
  settings: AppSettings | null
  onClose: () => void
  onSave: (settings: Partial<AppSettings>) => void
  onExport: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
  onExport
}) => {
  const [tabletId, setTabletId] = useState('')
  const [salesPoint, setSalesPoint] = useState('')

  useEffect(() => {
    if (settings) {
      setTabletId(settings.tabletId)
      setSalesPoint(settings.salesPoint)
    }
  }, [settings])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      tabletId: tabletId.trim(),
      salesPoint: salesPoint.trim()
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Paramètres de la tablette</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tabletId">ID Tablette</label>
            <input
              type="text"
              id="tabletId"
              className="input"
              value={tabletId}
              onChange={e => setTabletId(e.target.value)}
              placeholder="ex: TAB1, TAB2"
              required
            />
            <small style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Utilisé pour générer les IDs de commande
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="salesPoint">Point de vente</label>
            <input
              type="text"
              id="salesPoint"
              className="input"
              value={salesPoint}
              onChange={e => setSalesPoint(e.target.value)}
              placeholder="ex: Foire Dijon – Jour 1 – Tablette 1"
              required
            />
          </div>

          <div style={{ 
            background: '#f1f5f9', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem' 
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Informations</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Compteur de commandes: {settings?.lastOrderCounter || 0}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Format ID: {tabletId || 'TAB'}-YYYYMMDD-XXXX
            </p>
          </div>

          <div style={{ 
            background: '#f1f5f9', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <button
              type="button"
              className="btn btn-success btn-large"
              onClick={onExport}
              style={{ width: '100%' }}
            >
              📊 Exporter CSV
            </button>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
              Télécharger toutes les commandes au format CSV
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
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
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
