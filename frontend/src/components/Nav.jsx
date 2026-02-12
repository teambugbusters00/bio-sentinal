import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from './ChatInterface';

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center px-2 py-1 transition-all duration-300 min-w-[60px] ${isActive
        ? 'text-primary-green scale-105 drop-shadow-[0_0_8px_rgba(34,255,136,0.5)]'
        : 'text-white/40 hover:text-white/70'
      }`
    }
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </NavLink>
);

const Nav = ({ species }) => {
  const { logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-close chat if user navigates away
  useEffect(() => {
    setIsChatOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleCloseChat = () => setIsChatOpen(false);
  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const navItems = [
    { to: "/", icon: "home", label: "Home" },
    { to: "/map", icon: "map", label: "Map" },
    { to: "/alerts", icon: "notifications", label: "Alerts" },
    { to: "/satellite", icon: "satellite", label: "Sat" },
    { to: "/riparian", icon: "eco", label: "Riparian" },
    { to: "/team", icon: "groups", label: "Team" },
    { to: "/dashboard", icon: "dashboard", label: "Dash" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col justify-end pb-4 sm:pb-8">
      <nav className="pointer-events-auto relative mx-auto w-[95%] sm:w-[90%] max-w-md">

        {/* Ask Kaya Button */}
        {!isChatOpen && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex bg-dark-start h-12 sm:h-14 w-24 sm:w-28 items-center justify-center gap-2 rounded-full border border-primary-green/60 bg-bg-dark shadow-[0_0_30px_rgba(34,255,136,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 hover:cursor-pointer group"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl text-primary-green group-hover:animate-pulse">
                nest_eco_leaf
              </span>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[7px] sm:text-[8px] text-white/60 font-medium uppercase">Ask</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white">Kaya</span>
              </div>
            </button>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="glass-panel flex items-center justify-between rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 px-3 sm:px-6 py-2 sm:py-3 shadow-2xl backdrop-blur-xl">
          
          {/* Regular Nav Items - Left Side */}
          <div className="flex items-center gap-1">
            {navItems.slice(0, 3).map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </div>

          {/* Floating Report Button - Center */}
          <div className="relative mx-1">
            <NavLink
              to="/report"
              aria-label="Report Issue"
              className={({ isActive }) =>
                `glass-button-primary flex h-12 w-16 sm:h-14 sm:w-20 items-center justify-center rounded-full border border-primary-green/60 shadow-[0_0_20px_rgba(34,255,136,0.3)] transition-all duration-300 ${isActive
                  ? 'bg-primary-green text-white scale-110 shadow-[0_0_30px_rgba(34,255,136,0.6)]'
                  : 'bg-black/40 text-white/80 hover:scale-105'
                }`
              }
            >
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-2xl sm:text-3xl leading-none">report</span>
                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest mt-0.5">Report</span>
              </div>
            </NavLink>
          </div>

          {/* Regular Nav Items - Right Side */}
          <div className="flex items-center gap-1">
            {navItems.slice(3).map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Nav;
