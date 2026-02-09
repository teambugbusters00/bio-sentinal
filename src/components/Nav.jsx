import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100]">
          <div className="glass-panel p-2 flex items-center justify-around border-white/10 shadow-2xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center transition-colors ${
                  isActive ? 'text-primary-green' : 'text-white/40'
                }`
              }
            >
              <span className="material-symbols-outlined">home</span>
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center transition-colors ${
                  isActive ? 'text-primary-green' : 'text-white/40'
                }`
              }
            >
              <span className="material-symbols-outlined">map</span>
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `w-14 h-14 -mt-12 rounded-full glass-button-primary flex items-center justify-center shadow-[0_0_30px_rgba(34,255,136,0.4)] border-primary-green/60 transition-colors ${
                  isActive ? 'text-primary-green' : 'text-white/40'
                }`
              }
            >
              <span className="material-symbols-outlined text-3xl leading-none">report</span>
            </NavLink>
            <NavLink
              to="/alert"
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center transition-colors ${
                  isActive ? 'text-primary-green' : 'text-white/40'
                }`
              }
            >
              <span className="material-symbols-outlined">info</span>
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center transition-colors ${
                  isActive ? 'text-primary-green' : 'text-white/40'
                }`
              }
            >
              <span className="material-symbols-outlined">dashboard</span>
            </NavLink>
          </div>
        </nav>
  )
}

export default Nav
