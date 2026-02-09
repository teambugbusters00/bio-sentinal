import React from 'react';
import '../css/alert.css';
import Nav from '../components/Nav';

const Alerts = () => {
    return (
        <div className="text-white/90 font-sans min-h-screen bg-bg-dark selection:bg-neon-green/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-neon-green/20 p-2 rounded-xl border border-neon-green/30 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                            <span className="material-symbols-outlined text-neon-green text-xl">shield_with_heart</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">BioSentinel</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-white/70">search</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 relative hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-white/70">notifications</span>
                            <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-hard-pink shadow-[0_0_8px_rgba(255,0,127,0.6)] animate-pulse"></span>
                        </button>
                    </div>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex gap-2 px-6 pb-4 overflow-x-auto no-scrollbar">
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 px-5 text-xs font-bold text-white uppercase tracking-wider hover:bg-white/20 transition-all">
                        All Alerts
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-hard-pink/10 border border-hard-pink/30 px-5 text-xs font-bold text-hard-pink uppercase tracking-wider hover:bg-hard-pink/20 transition-all">
                        Critical
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 px-5 text-xs font-bold text-white/40 uppercase tracking-wider hover:bg-white/10 transition-all">
                        At Risk
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-neon-green/10 border border-neon-green/30 px-5 text-xs font-bold text-neon-green uppercase tracking-wider hover:bg-neon-green/20 transition-all">
                        Positive
                    </button>
                </div>
            </header>

            <main className="p-6 space-y-6 max-w-md mx-auto pb-32">
                <div className="flex items-center justify-between">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Real-time Feed</h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neon-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#39FF14] animate-pulse"></span>
                        LIVE MONITORING
                    </div>
                </div>

                {/* Card 1: Critical (Animated) */}
                <div className="glass-card pulse-border-pink relative flex flex-col gap-4 rounded-3xl bg-hard-pink/[0.08] p-5 shadow-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-hard-pink text-sm">local_fire_department</span>
                                <span className="text-hard-pink text-[10px] font-black uppercase tracking-[0.15em]">Critical Alert</span>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Active Wildfire Expansion</h3>
                            <p className="text-sm text-white/60 mt-1 leading-relaxed">Rapid spread detected near conservation zone. Immediate intervention required.</p>
                        </div>
                        <span className="text-[10px] font-bold text-white/30 whitespace-nowrap uppercase">2m ago</span>
                    </div>
                    <div className="flex items-center gap-5 py-3 border-y border-white/5">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white/40 text-sm">location_on</span>
                            <span className="text-xs font-semibold text-white/80">Amazon Basin, Brazil</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white/40 text-sm">verified</span>
                            <span className="text-xs font-semibold text-white/80">98% Confidence</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            <img alt="Ranger 1" className="h-7 w-7 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVlY8Q_KjzHX4pZO43jVR36ebLk8vnxnFV3GjAsabG-1HKMWn69P0MBbs2bkAWUG9gFPhCf9NDld8yzPbyWJSBC0Jy8V6FIBGktsEb7gkmCekVGiD7wCy57B5i35bWhUxsG0oUoBDKUmmQw2ZNtyviuPwMBoNE6erL3FU4X0_-CfsOj5wovFaEMjH-SgR8csO1ZV4T38tie6O2wPKBJe_FHMzDtvz2SPAC3bNHxf_oYTuR-cDgoTlpZFKfXJVTDBQ_SYOqsmvCs3pK" />
                            <img alt="Ranger 2" className="h-7 w-7 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb8_zqfjnhdhwX4lB40TmdmceJNBfv_jM1OfSPX_ZD8XsIOg17OJKLcQRJAyM71e-y6VJuL7NBbo6lbcXUM_1Cw0BMhvuUToCqM2ZmHcZ5eBn_QG6xM8b8GliBcTedQwLFvY483H_K9FCHEXFnft-hU5Mv-Fcp84dd_WfUhg8cpL_ffNQEu13C1EZ0apIpyel5q11ti1IJ1zdrJ_avmgsmyJ8Ev43a8d_260scl-KEFS1jR5EDO_9xt2HEDNU80fhWWw75uCZSqGWO" />
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/20 text-[9px] font-bold text-white">
                                +12
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
                            View Data
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Card 2: At Risk (Image) */}
                <div className="glass-card relative flex flex-col gap-4 rounded-3xl bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-white/40 text-sm">agriculture</span>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">At Risk</span>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Illegal Logging Activity</h3>
                            <p className="text-sm text-white/60 mt-1">Heavy machinery acoustic signatures detected.</p>
                        </div>
                        <span className="text-[10px] font-bold text-white/30 uppercase">45m ago</span>
                    </div>
                    
                    {/* Fixed Style Object */}
                    <div 
                        className="w-full h-32 rounded-2xl overflow-hidden relative border border-white/10" 
                        style={{ 
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnVByCpSFRx28yda30qEwY997afkz2BiOjtC73UPOnU2Brq99FGiXqMY7XLLu6hgb5mpnbZIFRGR-EfxOV-TZXx_QN7lmKklqvGLMbSIxBbmXLRCufrehFVLNMm5_n9Mo3NH-j6XbmR3R2YjxlNAZ2onOa33RHGdYsx_GI6iipQ2KJzCsipXM1sRiiSgzFKmhgXYdLkIKrc3WbOo3L8jIc-z2LxTT0-OW6zLOc_uWv0WgAI9EyNIvbZBw1mOb5SLdPhPzOb6F_F1gf")', 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-[9px] text-white/90 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[12px]">satellite_alt</span>
                            Satellite · 09:14 UTC
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white/40 text-sm">location_on</span>
                            <span className="text-xs font-semibold text-white/80">Boreal, Canada</span>
                        </div>
                        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
                            Deploy Drone
                            <span className="material-symbols-outlined text-sm">flight_takeoff</span>
                        </button>
                    </div>
                </div>

                {/* Card 3: Positive (Green Glow) */}
                <div className="glass-card relative flex flex-col gap-4 rounded-3xl bg-neon-green/[0.05] p-5 shadow-[0_0_30px_rgba(57,255,20,0.05)] border-neon-green/20">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-neon-green text-sm">eco</span>
                                <span className="text-neon-green text-[10px] font-black uppercase tracking-[0.15em]">Positive Event</span>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Snow Leopard Sightings</h3>
                            <p className="text-sm text-white/60 mt-1 leading-relaxed">Multiple individuals recorded on trail cameras in protected sector.</p>
                        </div>
                        <span className="text-[10px] font-bold text-white/30 uppercase">3h ago</span>
                    </div>
                    <div className="flex items-center gap-5 py-3 border-y border-white/5">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white/40 text-sm">location_on</span>
                            <span className="text-xs font-semibold text-white/80">Himalayas, Nepal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white/40 text-sm">groups</span>
                            <span className="text-xs font-semibold text-white/80">Citizen Science</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="px-2.5 py-1 bg-neon-green/10 text-neon-green text-[9px] font-black rounded-lg border border-neon-green/20 uppercase">Rare Species</span>
                            <span className="px-2.5 py-1 bg-white/5 text-white/40 text-[9px] font-black rounded-lg border border-white/10 uppercase">Verified</span>
                        </div>
                        <button className="flex items-center gap-2 bg-neon-green text-black px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95 transition-all hover:bg-neon-green/90">
                            Contribute
                            <span className="material-symbols-outlined text-sm">add_a_photo</span>
                        </button>
                    </div>
                </div>
            </main>

            <Nav />
        </div>
    );
};

export default Alerts;