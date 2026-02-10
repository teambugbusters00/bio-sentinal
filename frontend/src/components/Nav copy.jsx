import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ChatInterface from './ChatInterface';

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-12 h-12 transition-colors duration-300 ${isActive ? 'text-primary-green' : 'text-white/40 hover:text-white/70'
      }`
    }
  >
    <span className="material-symbols-outlined mb-0.5">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </NavLink>
);

const Nav = () => {
  const location = useLocation();
  const [chatInterface, setChatInterface] = useState(false);
  const showAskKaya = location.pathname.startsWith('/species');

  return (
    <div className='h-full w-full'>

      <nav className="fixed bottom-8 left-1/2 z-100 w-[90%] max-w-sm -translate-x-1/2">
        
        {showAskKaya && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setChatInterface(true)}
              aria-label="Ask Kaya"
              className="hover:cursor-pointer flex h-14 w-25 bg-dark-start items-center justify-center rounded-full border border-primary-green/60 bg-bg-dark shadow-[0_0_30px_rgba(34,255,136,0.4)] transition-transform active:scale-95"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-3xl leading-none text-white">
                  nest_eco_leaf
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Ask Kaya
                </span>
              </div>
            </button>
          </div>
        )}
        {chatInterface && (
          <div className="absolute -top-140 w-full left-1/2 -translate-x-1/2">
            <ChatInterface />
            <button
              onClick={() => setChatInterface(false)}
              aria-label="Ask Kaya"
              className="hover:cursor-pointer flex h-14 w-25 bg-dark-start items-center justify-center rounded-full border border-primary-green/60 bg-bg-dark shadow-[0_0_30px_rgba(34,255,136,0.4)] transition-transform active:scale-95"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-3xl leading-none text-white">
                  nest_eco_leaf
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Ask alpha
                </span>
              </div>
            </button>
          </div>
        )}

        <div className="glass-panel flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-2 shadow-2xl backdrop-blur-md">

          <NavItem to="/" icon="home" label="Home" />
          <NavItem to="/map" icon="map" label="Map" />

          <div className="relative mx-2">
            <NavLink
              to="/report"
              aria-label="Report Issue"
              className={({ isActive }) =>
                `glass-button-primary flex h-14 w-20 items-center justify-center rounded-full border border-primary-green/60 shadow-[0_0_20px_rgba(34,255,136,0.3)] transition-all duration-300 ${isActive
                  ? 'bg-primary-green text-white scale-110 shadow-[0_0_30px_rgba(34,255,136,0.6)]'
                  : 'bg-black/40 text-white/80 hover:scale-105'
                }`
              }
            >
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-3xl leading-none">report</span>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Report</span>
              </div>
            </NavLink>
          </div>

          <NavItem to="/alert" icon="notifications" label="Alerts" />
          <NavItem to="/dashboard" icon="dashboard" label="Dash" />
        </div>
      </nav>
    </div>
  );
};

export default Nav;