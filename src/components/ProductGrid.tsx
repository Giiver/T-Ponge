import React from 'react'
import { Product } from '../types'
import { useImageCarousel } from '../hooks/useImageCarousel'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => {
  const images = product.images || []
  const { currentIndex } = useImageCarousel(images, true, 4000)

  return (
    <div
      className="product-card"
      onClick={() => onAddToCart(product)}
    >
          {/* Image carousel if multiple images */}
          {images.length > 0 && (
            <div className="product-images">
              {images.length === 1 ? (
                <img 
                  src={images[0]} 
                  alt={product.label}
                  className="product-image"
                />
              ) : (
                <div className="image-carousel">
                  {images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${product.label} ${index + 1}`}
                      className="product-image carousel-image"
                      style={{ display: index === currentIndex ? 'block' : 'none' }}
                    />
                  ))}
                  {images.length > 1 && (
                    <div className="image-indicator">
                      {images.map((_, index) => (
                        <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`}></div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div>
            <h3>{product.label}</h3>
            <div className="price-container">
              {product.originalPrice ? (
                <>
                  <div className="original-price">{product.originalPrice.toFixed(2)} €</div>
                  <div className="promo-price">{product.priceTTC.toFixed(2)} €</div>
                  <div className="discount-badge">
                    -{Math.round(((product.originalPrice - product.priceTTC) / product.originalPrice) * 100)}%
                  </div>
                </>
              ) : (
                <div className="price">{product.priceTTC.toFixed(2)} €</div>
              )}
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
            SKU: {product.sku}
          </div>
    </div>
  )
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const activeProducts = products.filter(p => p.isActive)

  return (
    <div className="products-grid">
      {activeProducts.map(product => (
        <ProductCard 
          key={product.sku} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  )
}
