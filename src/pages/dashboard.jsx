import React from 'react';
import '../css/dashboard.css';

const Dashboard = () => {
    return (
        // Added a dark background wrapper so the glass effects are visible
        <div className="min-h-screen bg-slate-900 text-slate-200 pb-28 font-sans selection:bg-primary/30">
            
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel border-b-0 rounded-b-2xl">
                <div className="flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary glow-text-primary text-2xl">biotech</span>
                        <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">BioSentinel</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border-white/5 hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </button>
                        <div className="relative">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border-white/5 hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-xl">notifications</span>
                            </button>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_#ff007f]"></span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-5 py-6 flex flex-col gap-8">
                
                {/* Profile Card */}
                <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-5 mb-8">
                        <div className="relative">
                            <div 
                                className="w-20 h-20 rounded-2xl bg-slate-800 bg-cover bg-center neon-outline border-primary" 
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDFwRs2DKyPXq9HwAvITLZUyA8Bz80U4V0FtP2aLogFqA3xwCuz3cnSWuF55fSgEdH56zqf7T0yopaINIL8Kus8fQF_hpcipL7qnidbPoZJog9IlyzdunEWCT7qI6jTILdEAc5NTZnCIUgZD-De05h--CTO-2X-ys-I2vHV6qZnj-BrszTvGbnINtqRJkmCgu7W0iHKWiciW6Xnq4LvgOm-o4i2yq8bGwmVwKrKLYibqU5SbTvCKYNuWHpdgHx1AL2qBzWKBnqtIQu')" }}
                            ></div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-black w-6 h-6 flex items-center justify-center rounded-lg shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                                <span className="material-symbols-outlined text-[14px] font-bold">verified</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white">Dr. Elias Vance</h2>
                            <p className="text-white/50 text-xs font-medium tracking-wide">Senior Field Observer</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Lvl 14</span>
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.1em]">BS-88421</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="glass-pill flex flex-col items-center justify-center py-3">
                            <p className="text-lg font-bold text-white leading-none">1,240</p>
                            <p className="text-[9px] text-white/40 font-bold uppercase mt-1.5 tracking-tighter">Reports</p>
                        </div>
                        <div className="glass-pill flex flex-col items-center justify-center py-3 border-primary/30">
                            <p className="text-lg font-bold text-primary glow-text-primary leading-none">982</p>
                            <p className="text-[9px] text-primary/60 font-bold uppercase mt-1.5 tracking-tighter">Verified</p>
                        </div>
                        <div className="glass-pill flex flex-col items-center justify-center py-3">
                            <p className="text-lg font-bold text-white leading-none">15.4k</p>
                            <p className="text-[9px] text-white/40 font-bold uppercase mt-1.5 tracking-tighter">Points</p>
                        </div>
                    </div>
                </section>

                {/* Badges Scroll */}
                <section>
                    <div className="flex items-center justify-between mb-5 px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mastery Badges</h3>
                        <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Market</button>
                    </div>
                    <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
                        <div className="flex flex-col items-center min-w-[72px] gap-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center neon-outline bg-primary/5">
                                <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/60 tracking-tight">Soil Expert</p>
                        </div>
                        <div className="flex flex-col items-center min-w-[72px] gap-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center neon-outline-pink bg-accent/5">
                                <span className="material-symbols-outlined text-accent text-3xl">water_drop</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/60 tracking-tight">Hydrology</p>
                        </div>
                        <div className="flex flex-col items-center min-w-[72px] gap-3 opacity-40 grayscale">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white/10">
                                <span className="material-symbols-outlined text-white/40 text-3xl">bug_report</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/30 tracking-tight">Entomology</p>
                        </div>
                        <div className="flex flex-col items-center min-w-[72px] gap-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center neon-outline bg-primary/5">
                                <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/60 tracking-tight">Scout</p>
                        </div>
                        <div className="flex flex-col items-center min-w-[72px] gap-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white/20 bg-white/5">
                                <span className="material-symbols-outlined text-white/70 text-3xl">military_tech</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/60 tracking-tight">Veteran</p>
                        </div>
                    </div>
                </section>

                {/* Live Feed List */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">Live Feed</h3>
                    
                    {/* Item 1 */}
                    <div className="glass-panel bg-white/[0.03] border-white/5 p-4 rounded-2xl flex gap-4 hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <div 
                            className="w-16 h-16 rounded-xl bg-slate-800 shrink-0 bg-cover bg-center border border-white/10" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPhllnFaU8taGCz8Fzto_W9qo7iAJ6C6AQcGXtw_SQ8s3CoZsq4zbOoZhNbICEjFBPNe1RT2DxBoJd3ivPmmfVT50qKf4JBf_rkbi3iUUWmjSogKLLgWuUzYC-1dUzuzA_XiNpmpcj9xnYCrvaavXyw8m6j4D6z7TLBQI4IJQaQzCzSSch6ybgCTtsY1g6wAOBQ24eAWHqx-3gEOW26kHdsj0I0brtQq6or4mfbOMzf0KFcE0GUK3HdFJq9La0afRV-lZAKMpIpD0n')" }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-white/90">Monarch Migration</h4>
                                    <span className="text-[9px] text-white/30 font-medium">2H</span>
                                </div>
                                <p className="text-[11px] text-white/50 mt-1 line-clamp-1 font-light">12 adults moving South observed.</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[12px] text-white/30">location_on</span>
                                    <span className="text-[9px] text-white/40 font-medium">North Park, NY</span>
                                </div>
                                <span className="flex items-center gap-1 text-[9px] text-primary font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[10px]">verified</span> Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="glass-panel bg-white/[0.03] border-white/5 p-4 rounded-2xl flex gap-4 hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <div 
                            className="w-16 h-16 rounded-xl bg-slate-800 shrink-0 bg-cover bg-center border border-white/10" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlSgWEonTa0QDduw4hAuWlY29kgKn_mjxRHUt5c5w48iIBhuK4yOrlY6vywqI96ah56uu1to4yjIp6WNtXXwl6JOAfqd_2vSruDqsRtoLo4RllVb09AbcsxE7I3rBDobaZHGRxXFdAkq6XbHwmXOss7Srqo2j3yPnezkeEYDoiSKLwVezvSE6LCjYcx6cKSkyUTVfGkKLjJfzmp5morHf-_lm_wfV3LkzX9ets6Rcds-DGaCIZhzpHGvRYs65ahSWUXt_VLZKuCi5I')" }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-white/90">Soil Sample #82A</h4>
                                    <span className="text-[9px] text-white/30 font-medium">5H</span>
                                </div>
                                <p className="text-[11px] text-white/50 mt-1 line-clamp-1 font-light">pH Level 6.2 recorded in sector D-4.</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[12px] text-white/30">location_on</span>
                                    <span className="text-[9px] text-white/40 font-medium">West Basin</span>
                                </div>
                                <span className="flex items-center gap-1 text-[9px] text-accent font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[10px]">pending</span> Review
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="glass-panel bg-white/[0.03] border-white/5 p-4 rounded-2xl flex gap-4 hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <div 
                            className="w-16 h-16 rounded-xl bg-slate-800 shrink-0 bg-cover bg-center border border-white/10" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxh1maHlOWDTbGbR2sOKJR2-oFJ00LsFS9uU_eB_tMky-RZ6c-8oOjN41GYyMEO2CUOnIEnHw8SeSSlQOoQamuqVYjFiIPJspPwNzAguwD8nXsmksnOk4E7WAI_0-WMzUCLNljKBvEZltKrXtx5YfhKegKJZe8184wIobCDX0aYewXtFtXlTJBljdPzwVYf0eTDZChueGJUzQdPj0SAmETQV4mKU4jkRvkHSA_QiYDMs3cz5XBr1B4GvsoQ8JyPzzEtztOi0DJMQ7P')" }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-white/90">Oak Blight Scouting</h4>
                                    <span className="text-[9px] text-white/30 font-medium">1D</span>
                                </div>
                                <p className="text-[11px] text-white/50 mt-1 line-clamp-1 font-light">No signs of infection found in zone 2.</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[12px] text-white/30">location_on</span>
                                    <span className="text-[9px] text-white/40 font-medium">Ridgeview Preserve</span>
                                </div>
                                <span className="flex items-center gap-1 text-[9px] text-primary font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[10px]">verified</span> Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t-0 rounded-t-3xl pt-3 pb-8 px-8 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <button className="flex flex-col items-center gap-1 text-white/30 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">explore</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/30 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">map</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">Map</span>
                    </button>
                    <div className="-mt-12">
                        <button className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] border-4 border-slate-900 active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-4xl font-bold">add</span>
                        </button>
                    </div>
                    <button className="flex flex-col items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-2xl glow-text-primary">monitoring</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/30 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">person</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Dashboard;