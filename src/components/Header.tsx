import React from 'react'

interface HeaderProps {
  salesPoint: string
  onExport: () => void
  onSettings: () => void
  isOnline: boolean
}

export const Header: React.FC<HeaderProps> = ({ salesPoint, onExport, onSettings, isOnline }) => {
  return (
    <header className="header">
      <div>
        <h1>T-Ponge Commandes</h1>
        <p>{salesPoint}</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="status-indicator">
          <div className={`status-dot ${isOnline ? 'status-online' : 'status-offline'}`}></div>
          <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
        </div>
        
        <button className="btn btn-secondary" onClick={onSettings}>
          ⚙️ Paramètres
        </button>
        
        <button className="btn btn-success" onClick={onExport}>
          📊 Exporter CSV
        </button>
      </div>
    </header>
  )
}
