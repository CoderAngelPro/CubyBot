import { useEffect, useRef } from 'preact/hooks'
import cubeFace from '../assets/icons/happy_robot.png'
import '../styles/cube.css'


export function Cube({ chatVisible, bubbleText }) {
  const cubeRef = useRef(null)
  const bloomRef = useRef(null)
  const chatRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const cube = cubeRef.current
    const bloomGlow = bloomRef.current
    const img = imgRef.current

    if (!cube || !bloomGlow || !img) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let targetTranslateX = 0
    let currentTranslateX = 0

    let glitchTimer = 0

    const handleMouseMove = (e) => {
      const viewportOffset = currentTranslateX / 100
      const x = (e.clientX / window.innerWidth - (0.5 + viewportOffset))
      const y = (e.clientY / window.innerHeight - 0.5)
      currentTranslateX += (targetTranslateX - currentTranslateX) * 0.1

      targetX = y * -180
      targetY = x * 180
    }

    const glitchEffect = () => {
      if (glitchTimer <= 0) {
        if (Math.random() < 0.02) {
          glitchTimer = Math.floor(Math.random() * 10) + 5
        } else {
          img.style.transform = 'translate(0, 0)'
          img.style.filter = 'blur(0px)'
          return
        }
      }

      const shakeX = (Math.random() - 0.5) * 4
      const shakeY = (Math.random() - 0.5) * 4
      const blur = Math.random() < 0.5 ? '1px' : '0.5px'

      img.style.transform = `translate(${shakeX}px, ${shakeY}px)`
      img.style.filter = `blur(${blur})`

      glitchTimer--
    }

    let animationId = 0
    let running = true
    const animate = () => {
      if (!running) return
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1
      currentTranslateX += (targetTranslateX - currentTranslateX) * 0.1
      const idleWiggleZ = Math.sin(Date.now() * 0.002) * 5
      const idleWiggleX = Math.sin(Date.now() * 0.002) * 0.5
      const idleWiggleY = Math.sin(Date.now() * 0.002) * 1

      cube.style.transform = `
        translate3d(calc(-50% + ${currentTranslateX}vw), -50%, 0)
        rotateX(${currentX - idleWiggleX}deg)
        rotateY(${currentY + idleWiggleY}deg)
        rotateZ(${idleWiggleZ}deg)
      `

      bloomGlow.style.transform = `translate3d(calc(-50% + ${currentTranslateX}vw), -50%, 0)`

      const chatBubble = chatRef.current
      if (chatBubble) {
        const cubeRect = cube.getBoundingClientRect()
        const xOffset = 75
        const yOffset = -150

        chatBubble.style.transform = 'translate(-50%, -50%)'
        chatBubble.style.left = `${cubeRect.right + xOffset}px`
        chatBubble.style.top = `${cubeRect.top + yOffset}px`
      }

      glitchEffect()
      animationId = requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      running = !document.hidden
      if (running && !animationId) {
        animationId = requestAnimationFrame(animate)
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      running = false
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <div id="overlay"></div>
      <div id="bloom-glow" ref={bloomRef}></div>
      <div className="cube" id="cube" ref={cubeRef}>
        <div className="face front">
          <img src={cubeFace} ref={imgRef} />
        </div>
        <div className="face back"></div>
        <div className="face left"></div>
        <div className="face right"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
      {chatVisible && (
        <svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" id="chat-bubble" ref={chatRef}>
          <path fill="#00baba" d="M30,0 H270 A30,30 0 0 1 300,30 V170 A30,30 0 0 1 270,200 H120 L80,240 L80,200 H30 A30,30 0 0 1 0,170 V30 A30,30 0 0 1 30,0 Z"/>
          <foreignObject x="15" y="10" width="280" height="180">
            <div xmlns="http://www.w3.org/1999/xhtml" id="bubble-content">{bubbleText}</div>
          </foreignObject>
        </svg>
      )}
    </>
  )
}
