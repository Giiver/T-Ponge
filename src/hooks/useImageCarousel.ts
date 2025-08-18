import { useState, useEffect } from 'react'

export const useImageCarousel = (images: string[] = [], autoRotate = true, interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate || !images || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images?.length, autoRotate, interval])

  const goToNext = () => {
    if (!images || images.length === 0) return
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    if (!images || images.length === 0) return
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToIndex
  }
}
