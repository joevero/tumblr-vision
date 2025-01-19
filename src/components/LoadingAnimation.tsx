import { useState, useEffect } from 'react'
import './LoadingAnimation.css'

const manifestationWords = [
  "BREATHE",
  "VISUALIZE",
  "BELIEVE",
  "RECEIVE",
  "TRUST"
]

const LoadingAnimation = () => {
  const [currentWord, setCurrentWord] = useState(manifestationWords[0])
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Word change animation
    const wordInterval = setInterval(() => {
      if (progress < 100) {
        const currentIndex = Math.floor((progress / 100) * manifestationWords.length)
        setCurrentWord(manifestationWords[currentIndex])
      }
    }, 1000)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true)
          return 100
        }
        return prev + 1
      })
    }, 50) // 5000ms / 100 steps = 50ms per step

    return () => {
      clearInterval(wordInterval)
      clearInterval(progressInterval)
    }
  }, [progress])

  return (
    <div className="loading-animation">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="loading-text">
        {isComplete ? "MANIFESTING..." : currentWord}
      </div>
    </div>
  )
}

export default LoadingAnimation