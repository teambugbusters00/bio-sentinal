import React from 'react';
import '../css/map.css';
import Nav from '../components/Nav';

const Map = () => {
  return (
    <div className="font-sans bg-black text-slate-100 antialiased overflow-hidden h-screen w-full">
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        
        {/* --- Background Layer --- */}
        <div className="absolute inset-0 z-0">
          {/* Main Map Background */}
          <div 
            className="w-full h-full bg-cover bg-center brightness-[0.4] saturate-[0.8] contrast-[1.1]" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsgg9ZBLUq59BgWoWEXc4HzrT-ObFSIoiZzDbXBFiuqJwExQLdilWi5pfVOzkJgl8Q12taWxwV1Ku997J9Zw5rFaSpZmmUTRqD6YSHYofcGacznmeDt8FohDJslv5R9tXxcB84nI7S71_-CZIrWVOswiGd4U26VnJ6tuDMq0N1SE7tgbHXj2XFJQOIGU6Cly4UQrfL8-l0eM04MyYnSD-yrEy-KuIuzwtnx7zacnzdfjHufh2XuZU8yMb2BAchzIxypba0t47oPuxF")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            
            {/* Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ 
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }}
            ></div>

            {/* Map Marker: Verified (Green) */}
            <div className="absolute top-[28%] left-[20%] flex flex-col items-center">
              <div className="size-6 bg-primary rounded-full neon-glow-green border border-white/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-[14px] font-bold">check</span>
              </div>
            </div>

            {/* Map Marker: Question (Amber) */}
            <div className="absolute top-[48%] right-[35%] flex flex-col items-center">
              <div className="size-6 bg-warning rounded-full neon-glow-amber border border-white/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-[14px] font-bold">question_mark</span>
              </div>
            </div>

            {/* Map Marker: Warning (Pink/Accent) */}
            <div className="absolute bottom-[42%] right-[22%] flex flex-col items-center">
              <div className="size-8 bg-accent rounded-full neon-glow-pink border border-white/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px] filled-icon">warning</span>
              </div>
            </div>

            {/* Map Marker: Active Scan (Pulse) */}
            <div className="absolute top-[44%] left-[54%] flex flex-col items-center">
              <div className="size-9 bg-primary rounded-full neon-glow-green border-2 border-white/50 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full ring-4 ring-primary/20 scale-125 animate-pulse"></div>
                <span className="material-symbols-outlined text-black text-[20px] filled-icon">sensors</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- UI Layer: Header --- */}
        <div className="absolute top-0 left-0 w-full z-20 p-4 pt-14">
          <div className="flex items-center gap-3">
            <div className="flex-1 glass-panel h-12 rounded-2xl flex items-center px-4">
              <span className="material-symbols-outlined text-primary mr-3 text-xl">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-500 font-medium text-white focus:outline-none" placeholder="SCANNING FOR BIOSIGNATURES..." type="text" />
            </div>
            <button className="size-12 glass-panel rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-slate-300">tune</span>
            </button>
          </div>
        </div>

        {/* --- UI Layer: Right Controls --- */}
        <div className="absolute top-36 right-4 z-20 flex flex-col gap-4">
          <div className="flex flex-col glass-capsule p-1.5 gap-1">
            <button className="size-10 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">layers</span>
            </button>
            <div className="h-[1px] w-6 mx-auto bg-white/10"></div>
            <button className="size-10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined filled-icon">satellite_alt</span>
            </button>
            <div className="h-[1px] w-6 mx-auto bg-white/10"></div>
            <button className="size-10 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">terrain</span>
            </button>
          </div>
          <div className="flex flex-col glass-capsule p-1.5 gap-1">
            <button className="size-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="h-[1px] w-6 mx-auto bg-white/10"></div>
            <button className="size-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
          <button className="size-12 glass-capsule flex items-center justify-center text-primary neon-glow-green border-primary/30 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined filled-icon">my_location</span>
          </button>
        </div>

        {/* --- UI Layer: Legend --- */}
        <div className="absolute bottom-[38%] left-4 z-20 glass-panel p-3 rounded-xl min-w-[130px]">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 font-mono">Registry Legend</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-primary neon-glow-green"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Verified</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-warning neon-glow-amber"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Pending</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-accent neon-glow-pink"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Threat</span>
            </div>
          </div>
        </div>

        {/* --- UI Layer: Filter Toggles --- */}
        <div className="absolute bottom-[30%] left-0 w-full z-20">
          <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2">
            <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
              <span className="material-symbols-outlined text-[16px]">monitoring</span> Data Overlay
            </button>
            <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 glass-capsule text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[16px]">shield</span> Sanctuaries
            </button>
            <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 glass-capsule text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span> Thermal
            </button>
            <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 glass-capsule text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[16px]">radar</span> Bio-Pings
            </button>
          </div>
        </div>

        {/* --- UI Layer: Detail Card --- */}
        <div className="absolute bottom-0 left-0 w-full z-30 px-4 pb-10">
          <div className="glass-panel rounded-[2rem] overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 blur-3xl -ml-16 -mb-16"></div>
            
            {/* Drag Handle */}
            <div className="h-1.5 w-10 bg-white/10 rounded-full mx-auto mt-3 mb-1"></div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 border border-accent/50 bg-accent/10 text-accent text-[9px] font-bold rounded uppercase tracking-[0.15em]">CRITICAL: ENDANGERED</span>
                    <span className="text-slate-500 text-[10px] font-mono tracking-tighter">ID-X8821</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight text-white font-sans tracking-tight">Panthera tigris</h2>
                  <p className="text-slate-400 text-xs font-mono tracking-wide mt-1">BENGAL TIGER • FEMALE</p>
                </div>
                {/* Thumbnail Image */}
                <div 
                  className="size-20 rounded-2xl bg-cover bg-center border border-white/10 relative overflow-hidden" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC129rLoC1aevX4lPQtm0JuGdXqUxV_EO3RX_oy7ZI7TGE_Ro2Dc6EV809wR8BBr7UdqTVV4pxtXYqlVIyQ3jbrGWg9xvGTLxXZiHdGExWu7iQ-X1D4F_D5GY0_TCUAbfqSOBg_wMUWVGvUb-eJtaHEiL5eSokC4OJDjUaitLBPQx_yrb5u7ej1a7lmB1iKqjxXeIPAJuMh6KbYzR5b6UI0x8eew79p40ZN_MvPt8BS1eQGLb1GWp51-DzVveUHi-2S5CeUSjWz72G")' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1 font-mono">GIS COORDS</p>
                  <p className="text-[11px] font-mono font-medium text-slate-200">3°24'12"N, 64°12'05"W</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1 font-mono">STATUS</p>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[14px] filled-icon">verified</span>
                    <p className="text-[11px] font-bold text-primary tracking-wide">VERIFIED</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 h-14 bg-primary text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 uppercase tracking-tighter text-sm neon-glow-green hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined font-bold">query_stats</span>
                  Sync Analytics
                </button>
                <button className="size-14 glass-panel border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-white/10">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
          <Nav />
        </div>
        
        </div>
    </div>
  );
};

export default Map;