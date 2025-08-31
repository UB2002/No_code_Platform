import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Settings } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>AI Workflow Builder</h2>
      </div>
      
      <div className="nav-actions">
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <Home size={16} />
          Dashboard
        </button>
      </div>
    </nav>
  )
}

export default Navbar