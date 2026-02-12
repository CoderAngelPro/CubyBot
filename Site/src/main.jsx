import { render } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import './styles/index.css'
import { Cube } from './components/cube.jsx'
import { Sidebar } from './components/sidebar.jsx'
import { Prompt } from './components/prompt.jsx'

const App = () => {
  const [chatVisible, setChatVisible] = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [history, setHistory] = useState([])
  const [token, setToken] = useState(null)

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token])

  useEffect(() => {
    const storedToken = localStorage.token || null
    setToken(storedToken)

    if (storedToken) {
      fetch('/history', { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(r => (r.ok ? r.json() : []))
        .then(historyItems => setHistory(historyItems.map(m => ({ prompt: m.prompt, reply: m.reply }))))
        .catch(console.error)
    }
  }, [])

  const addHistoryCard = (prompt, reply) => {
    setHistory(prev => [{ prompt, reply }, ...prev])
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    location.reload()
  }

  const handleClearHistory = async () => {
    if (!confirm('Erase your entire chat history?')) return
    if (!token) return

    const res = await fetch('/history', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.ok) {
      setHistory([])
      location.reload()
    } else {
      alert('Failed to clear history')
    }
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations()
        .then(regs => Promise.all(regs.map(reg => reg.unregister())))
        .catch(console.error)
      return
    }

    navigator.serviceWorker.register('/sw.js')
      .catch(console.error)
  }, [])

  return (
    <>
      <Sidebar
        history={history}
        isAuthed={!!token}
        onLogout={handleLogout}
        onClearHistory={handleClearHistory}
      />
      <Cube chatVisible={chatVisible} bubbleText={bubbleText} />
      <Prompt
        authHeaders={authHeaders}
        onNewHistory={addHistoryCard}
        onShowChat={() => setChatVisible(true)}
        setBubbleText={setBubbleText}
      />
    </>
  )
}

render(
  <App />,
  document.getElementById('app')
)
