import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/sidebar.css';
import cubeFace from '../assets/icons/happy_robot.png';

export function Sidebar({ history, isAuthed, onLogout, onClearHistory }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const profileRef = useRef(null)
  const modalContentRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (!modalContentRef.current || !profileRef.current) return
      if (!modalContentRef.current.contains(e.target) && !profileRef.current.contains(e.target)) {
        setModalOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>  
      <button id="sidebar-button" onClick={() => setOpen(prev => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 25 25" fill="none" stroke="#0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      
      <div id="sidebar" className={open ? 'open' : ''}>
        <button id="close" onClick={() => setOpen(prev => !prev)}>
          <svg viewBox="-5 -5 110 110" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="5" width="90" height="90" rx="20" stroke="#00FFFF" strokeWidth="11" fill="none" />
            <line x1="30" y1="15" x2="30" y2="85" stroke="#00fefe" strokeWidth="11" />
            <polyline points="65 35 50 50 65 65" stroke="#00fefe" strokeWidth="11" />
          </svg>
        </button>

        <div id="sidebar-scroll">
          <div id="sidebar-container">
            {history.map((item, index) => (
              <div className="history-card" key={`${item.prompt}-${item.reply}-${index}`}>
                <strong>{item.prompt}</strong><br />
                <span>{item.reply}</span>
              </div>
            ))}

            {!isAuthed && (
              <>
                <p id="loginmsg">Login to save chat history</p>
                <img id="loginimg" src={cubeFace} />
                <a id="loginBtn" href="login.html">
                  <p>Login</p>
                </a>
              </>
            )}
          </div>  
        </div>

        <div id="profile" ref={profileRef} onClick={() => setModalOpen(prev => !prev)}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" id="profile-svg">
            <circle cx="50" cy="50" r="50" fill="#00FFFF" />
            <circle cx="50" cy="35" r="20" fill="#123638" />
            <path d="M20 75 c0-15 15-25 30-25 s30 10 30 25 v10 H20 Z" fill="#123638" />
          </svg>
          <p>Profile</p>

          <div id="Modal" style={{ display: modalOpen ? 'block' : 'none', top: isAuthed ? undefined : '-100px' }}>
            <div id="Modal-content" ref={modalContentRef}>
              <button className="modal-option">Settings</button>
              <a href="contact.html" className="modal-option">Contact Us</a>
              {isAuthed && (
                <button className="modal-option" id="clearBtn" onClick={onClearHistory}>Clear History</button>
              )}
              {isAuthed && (
                <button className="modal-option" id="logoutBtn" onClick={onLogout}>Log Out</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}