import { useState, useEffect, useRef } from 'react'
import './ScrollVelocity.css'

function ScrollVelocity({ texts = ['Feature', 'Brands', 'Family', 'Loves'], velocity = 1, className = '' }) {
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now()
      const timeDelta = currentTime - lastTime.current
      const scrollDelta = window.scrollY - lastScrollY.current
      
      if (timeDelta > 0) {
        const vel = Math.abs(scrollDelta / timeDelta) * 1000
        setScrollVelocity(vel)
      }

      lastScrollY.current = window.scrollY
      lastTime.current = currentTime
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate animation speed based on scroll velocity
  const baseSpeed = 20
  const speedMultiplier = 1 + (scrollVelocity * 0.01 * (velocity || 1))
  const animationSpeed = Math.max(10, Math.min(50, baseSpeed * speedMultiplier))

  // Create multiple copies of texts for seamless loop
  const textArray = texts.length > 0 ? texts : ['Feature', 'Brands', 'Family', 'Loves']
  const repeatedTexts = [...textArray, ...textArray, ...textArray]

  return (
    <div className={`scroll-velocity-container ${className}`}>
      <div 
        className="scroll-velocity-track"
        style={{
          '--animation-speed': `${animationSpeed}s`
        }}
      >
        <div className="scroll-velocity-content">
          {repeatedTexts.map((text, index) => (
            <span key={index} className="scroll-velocity-item">
              {text}
            </span>
          ))}
        </div>
        <div className="scroll-velocity-content" aria-hidden="true">
          {repeatedTexts.map((text, index) => (
            <span key={`duplicate-${index}`} className="scroll-velocity-item">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScrollVelocity

