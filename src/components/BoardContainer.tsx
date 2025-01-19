// src/components/BoardContainer.tsx

import { useEffect, useState, useCallback } from 'react'
import ManifestButton from './ManifestButton'
import LoadingAnimation from './LoadingAnimation'
import AgainButton from './AgainButton'
import { fetchTumblrLikes } from '../lib/api'
import './BoardContainer.css'

interface BoardContainerProps {
  currentUser: string
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

interface ImagePosition {
  url: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

const BoardContainer = ({ 
  currentUser, 
  isGenerating, 
  setIsGenerating 
}: BoardContainerProps) => {
  const [images, setImages] = useState<ImagePosition[]>([])
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })

  // Function to calculate random position that keeps 75% of image in container
  const calculatePosition = (imgWidth: number, imgHeight: number) => {
    const maxX = containerDimensions.width - (imgWidth * 0.75)
    const maxY = containerDimensions.height - (imgHeight * 0.75)
    
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY
    }
  }

  // Function to scale image dimensions while maintaining aspect ratio
  const scaleImageDimensions = (originalWidth: number, originalHeight: number) => {
    const maxWidth = containerDimensions.width * 0.5  // Max 50% of container width
    const maxHeight = containerDimensions.height * 0.5 // Max 50% of container height
    
    let newWidth = originalWidth
    let newHeight = originalHeight
    
    if (newWidth > maxWidth) {
      const ratio = maxWidth / newWidth
      newWidth = maxWidth
      newHeight = newHeight * ratio
    }
    
    if (newHeight > maxHeight) {
      const ratio = maxHeight / newHeight
      newHeight = maxHeight
      newWidth = newWidth * ratio
    }
    
    return { width: newWidth, height: newHeight }
  }

  // Function to fetch and process images
  const fetchAndGenerateImages = async () => {
    try {
      const imageUrls = await fetchTumblrLikes(currentUser)
      let processedImages: ImagePosition[] = []
      
      // Pre-load images to get dimensions
      const imagePromises = imageUrls.map(url => {
        return new Promise<ImagePosition>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const { width, height } = scaleImageDimensions(img.width, img.height)
            const { x, y } = calculatePosition(width, height)
            resolve({
              url,
              x,
              y,
              width,
              height,
              zIndex: Math.floor(Math.random() * 20)  // Random z-index for layering
            })
          }
          img.onerror = reject
          img.src = url
        })
      })

      processedImages = await Promise.all(imagePromises)
      
      // Add images one by one with delay
      processedImages.forEach((img, index) => {
        setTimeout(() => {
          setImages(prev => [...prev, img])
          if (index === processedImages.length - 1) {
            setTimeout(() => {
              setIsGenerating(false)
            }, 1000)
          }
        }, index * 500)  // 500ms delay between each image
      })
    } catch (error) {
      console.error('Error generating images:', error)
      setIsGenerating(false)
    }
  }

  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.collage-container')
      if (container) {
        setContainerDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const startGeneration = useCallback(() => {
    setShowLoadingAnimation(true)
    setIsGenerating(true)
    setImages([])
    
    // Loading animation duration: 5 seconds
    setTimeout(() => {
      setShowLoadingAnimation(false)
      fetchAndGenerateImages()
    }, 5000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsGenerating])

  return (
    <div className="board-container">
      <div className="collage-container">
        {images.map((img, index) => (
          <img 
            key={`${img.url}-${index}`}
            src={img.url}
            className="collage-image"
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              width: `${img.width}px`,
              height: `${img.height}px`,
              zIndex: img.zIndex,
              '--delay': `${index * 500}ms`,
            } as React.CSSProperties}
            alt=""
          />
        ))}
      </div>
      <div className="controls">
        {!isGenerating && !showLoadingAnimation && (
          <ManifestButton onClick={startGeneration} />
        )}
        {showLoadingAnimation && (
          <LoadingAnimation />
        )}
        {isGenerating && !showLoadingAnimation && (
          <AgainButton onClick={startGeneration} />
        )}
      </div>
    </div>
  )
}

export default BoardContainer