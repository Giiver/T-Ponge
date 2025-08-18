import { test, expect } from '@playwright/test'

test.describe('Offline Order Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should load application offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Reload page to test offline functionality
    await page.reload()
    
    // Should still show the main interface
    await expect(page.locator('h1')).toContainText('T-Ponge Commandes')
    await expect(page.locator('text=Catalogue des produits')).toBeVisible()
  })

  test('should add products to cart', async ({ page }) => {
    // Wait for products to load
    await expect(page.locator('.product-card').first()).toBeVisible()
    
    // Add first product to cart
    await page.locator('.product-card').first().click()
    
    // Check cart shows item
    await expect(page.locator('.cart')).toContainText('1 article')
    
    // Add same product again
    await page.locator('.product-card').first().click()
    
    // Check quantity increased
    await expect(page.locator('.qty-display')).toContainText('2')
  })

  test('should create order offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Add product to cart
    await page.locator('.product-card').first().click()
    
    // Open checkout
    await page.locator('text=Finaliser la commande').click()
    
    // Fill customer info
    await page.fill('#customerName', 'Test Client')
    await page.fill('#customerPhone', '0123456789')
    await page.fill('#notes', 'Test order offline')
    
    // Confirm order
    await page.locator('text=Confirmer la commande').click()
    
    // Should show success message
    await expect(page.locator('text=enregistrée avec succès')).toBeVisible()
    
    // Cart should be empty
    await expect(page.locator('text=Votre panier est vide')).toBeVisible()
  })

  test('should update cart quantities', async ({ page }) => {
    // Add product to cart
    await page.locator('.product-card').first().click()
    
    // Increase quantity
    await page.locator('.qty-btn:has-text("+")').click()
    await expect(page.locator('.qty-display')).toContainText('2')
    
    // Decrease quantity
    await page.locator('.qty-btn:has-text("−")').click()
    await expect(page.locator('.qty-display')).toContainText('1')
    
    // Remove item
    await page.locator('.btn-danger:has-text("🗑️")').click()
    await expect(page.locator('text=Votre panier est vide')).toBeVisible()
  })

  test('should export CSV', async ({ page }) => {
    // Create an order first
    await page.locator('.product-card').first().click()
    await page.locator('text=Finaliser la commande').click()
    await page.locator('text=Confirmer la commande').click()
    
    // Wait for success message to disappear
    await page.waitForTimeout(1000)
    
    // Start download
    const downloadPromise = page.waitForEvent('download')
    await page.locator('text=Exporter CSV').click()
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/commandes-.*\.csv/)
  })

  test('should persist data after page reload', async ({ page }) => {
    // Add product to cart
    await page.locator('.product-card').first().click()
    
    // Create order
    await page.locator('text=Finaliser la commande').click()
    await page.locator('text=Confirmer la commande').click()
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Export should still work (data persisted)
    const downloadPromise = page.waitForEvent('download')
    await page.locator('text=Exporter CSV').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/commandes-.*\.csv/)
  })

  test('should work in kiosk mode (fullscreen)', async ({ page }) => {
    // Test that interface is optimized for touch
    const productCard = page.locator('.product-card').first()
    const boundingBox = await productCard.boundingBox()
    
    // Product cards should be large enough for touch (min 160px height)
    expect(boundingBox?.height).toBeGreaterThan(160)
    
    // Buttons should be large enough
    const button = page.locator('.btn').first()
    const buttonBox = await button.boundingBox()
    expect(buttonBox?.height).toBeGreaterThan(60)
  })
})
