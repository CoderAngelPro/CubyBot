import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/prompt.css'

export function Prompt({ authHeaders, onNewHistory, onShowChat, setBubbleText }) {
  const promptRef = useRef(null)
  const formRef = useRef(null)
  const [titleText, setTitleText] = useState('')
  const [helperText, setHelperText] = useState('')
  const [titleVisible, setTitleVisible] = useState(true)

  useEffect(() => {
    let cancelled = false
    let helperTimer = 0

    const typeText = async (setter, text, delay = 50) => {
      for (const char of text) {
        if (cancelled) return
        setter(prev => prev + char)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    setTitleText('')
    setHelperText('')

    typeText(setTitleText, "Hello, I'm Cuby.")
      .then(() => {
        helperTimer = window.setTimeout(() => typeText(setHelperText, 'How can I help?'), 2000)
      })

    return () => {
      cancelled = true
      if (helperTimer) window.clearTimeout(helperTimer)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const prompt = promptRef.current?.value.trim() || ''
    if (promptRef.current) promptRef.current.value = ''

    if (!prompt) {
      setBubbleText('Please enter a valid prompt.')
      return
    }

    setTitleVisible(false)
    onShowChat()

    setBubbleText('Thinking…')

    try {
      const res = await fetch(`/generate?prompt=${encodeURIComponent(prompt)}`,
        { headers: authHeaders }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Rate limit reached')
      }

      const { text: reply } = await res.json()
      setBubbleText(reply)
      onNewHistory(prompt, reply)
    } catch (err) {
      setBubbleText(err.message)
      console.error('API Error:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return(
    <>  
      <div id="prompt-container">
        <h1 id="title" style={{ visibility: titleVisible ? 'visible' : 'hidden' }}>{titleText}</h1>
        <h2 id="prompt-helper" style={{ visibility: titleVisible ? 'visible' : 'hidden' }}>{helperText}</h2>
        <form id="prompt" ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor="prompt-text"></label>
          <textarea id="prompt-text" placeholder="Message Cuby" ref={promptRef} onKeyDown={handleKeyDown}></textarea>
          <div id="UI">
            <input type="checkbox" id="analysis" />
            <label htmlFor="analysis">&#x1F9E0;Cuby Analysis</label>
            <input type="checkbox" id="search" />
            <label htmlFor="search">&#x1F50D;Cuby Search</label>
          <button type="submit" id="submit"> 
            <svg  width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11" fill="#00baba"/>
              <line  x1="12" y1="16" x2="12" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="8,12 12,8 16,12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          </div>
        </form>
      </div>
    </>
  )
}