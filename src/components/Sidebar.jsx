import { HomeIcon, GridIcon, ActivityIcon, SunIcon, MoonIcon } from './Icons'

export default function Sidebar({ activeView, onNavigate, darkMode, onToggleDark }) {
  return (
    <aside className="sidebar">
      <div className="sb-top">
        <div className="nav-sec-label">Workspace</div>
        <div className="ws-user">
          <div className="avatar">R</div>
          <div className="ws-name">Rahul's Workspace</div>
        </div>
      </div>

      <nav className="sb-nav">
        <div className="nav-sec">
          <div className="nav-sec-label">Navigation</div>
          <button
            className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <HomeIcon className="nav-icon" />
            Home
          </button>
          <button
            className={`nav-item ${activeView === 'kb' ? 'active' : ''}`}
            onClick={() => onNavigate('kb')}
          >
            <GridIcon className="nav-icon" />
            Knowledge Base
          </button>
        </div>

        <div className="nav-sec">
          <div className="nav-sec-label">System</div>
          <button
            className={`nav-item ${activeView === 'health' ? 'active' : ''}`}
            onClick={() => onNavigate('health')}
          >
            <ActivityIcon className="nav-icon" />
            Health Check
          </button>
        </div>
      </nav>

      <div className="sb-bottom">
        <button className="nav-item theme-toggle" onClick={onToggleDark}>
          {darkMode ? <SunIcon className="nav-icon" /> : <MoonIcon className="nav-icon" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  )
}
