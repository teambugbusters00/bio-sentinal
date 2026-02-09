import React from 'react';
import Nav from '../components/Nav';

const Report = () => {
    return (
        <div className="text-white/90 font-sans min-h-screen bg-bg-gradient-start selection:bg-neon-green/30">
            {/* Status Bar */}
            <div className="h-12 w-full flex items-center justify-between px-8 sticky top-0 z-[60] backdrop-blur-md bg-black/20">
                <div className="font-bold text-sm frosted-text">9:41</div>
                <div className="flex gap-1.5 opacity-80">
                    <span className="material-symbols-outlined text-[18px]">signal_cellular_4_bar</span>
                    <span className="material-symbols-outlined text-[18px]">wifi</span>
                    <span className="material-symbols-outlined text-[18px]">battery_full</span>
                </div>
            </div>

            <div className="max-w-md mx-auto min-h-screen relative z-10 pb-32">
                {/* Header */}
                <div className="flex items-center p-6 justify-between">
                    <div className="flex size-10 items-center justify-center glass-panel rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-white/70">close</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <h2 className="frosted-text text-lg font-bold tracking-tight">Report Observation</h2>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-neon-green font-bold">BioSentinel Core</span>
                    </div>
                    <div className="flex w-10 items-center justify-end">
                        <p className="text-neon-green text-sm font-bold cursor-pointer hover:text-white transition-colors">Help</p>
                    </div>
                </div>

                <form className="px-5 space-y-6">
                    {/* Observation Type */}
                    <section>
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Observation Type</h3>
                        <div className="flex h-12 w-full items-center glass-panel p-1.5 gap-1 rounded-2xl">
                            <label className="flex-1 h-full cursor-pointer relative">
                                <input defaultChecked className="hidden peer" name="obs_type" type="radio" value="Species" />
                                <div className="h-full flex items-center justify-center rounded-[10px] text-white/50 text-xs font-bold transition-all peer-checked:bg-white/10 peer-checked:text-neon-green peer-checked:shadow-sm">
                                    Species
                                </div>
                            </label>
                            <label className="flex-1 h-full cursor-pointer relative">
                                <input className="hidden peer" name="obs_type" type="radio" value="Sacred Grove" />
                                <div className="h-full flex items-center justify-center rounded-[10px] text-white/50 text-xs font-bold transition-all peer-checked:bg-white/10 peer-checked:text-neon-green peer-checked:shadow-sm">
                                    Grove
                                </div>
                            </label>
                            <label className="flex-1 h-full cursor-pointer relative">
                                <input className="hidden peer" name="obs_type" type="radio" value="Threat" />
                                <div className="h-full flex items-center justify-center rounded-[10px] text-white/50 text-xs font-bold transition-all peer-checked:bg-white/10 peer-checked:text-hard-pink peer-checked:shadow-sm">
                                    Threat
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Evidence Upload */}
                    <section>
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Evidence</h3>
                        <div className="glass-panel border-dashed border-white/20 p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group rounded-3xl">
                            <div className="w-14 h-14 bg-neon-green/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                                <span className="material-symbols-outlined text-neon-green text-3xl">add_a_photo</span>
                            </div>
                            <p className="frosted-text font-bold text-sm">Upload Evidence</p>
                            <p className="text-white/30 text-[10px] mt-1 font-medium tracking-wide">High-resolution preferred</p>
                        </div>
                    </section>

                    {/* Identification */}
                    <section className="space-y-4">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Identification</h3>
                        <div className="flex flex-col">
                            <div className="relative">
                                <input 
                                    className="glass-input w-full h-14 pr-12 pl-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 text-white placeholder-white/30 text-sm font-medium outline-none transition-all" 
                                    placeholder="Species Name (e.g. Panthera tigris)" 
                                    type="text" 
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/30">search</span>
                            </div>
                        </div>
                        <div className="glass-panel p-4 bg-white/[0.03] rounded-2xl">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div className="flex flex-col">
                                    <span className="frosted-text text-sm font-bold">Expert Verification</span>
                                    <span className="text-white/40 text-[11px]">Request AI & specialist identification</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green shadow-inner"></div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em]">Location</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                                <span className="text-neon-green text-[10px] font-bold uppercase tracking-wider">GPS Live</span>
                            </div>
                        </div>
                        <div className="relative w-full h-44 rounded-3xl overflow-hidden border border-white/10 glass-panel">
                            {/* Map Image Placeholder */}
                            <img 
                                className="w-full h-full object-cover brightness-50 contrast-125 grayscale-[0.5]" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANFK8iKLOInl85hCjHRP1uiEx29hqJC4eXlC8WN5R8scJMLdVHRFX54Wxc_MEWdXW1eEIxoN5Keas-N9vG4Y2U0HmZGPxjvGBqntWT79XYm-ynU3FE-6k6EVjQorp4dMCtbSMnpxy2iT02IVF-tDurFh4jjRu_4bVerrX5GOxkICtF9TKLIMglJUM3KAkgkHl8ZrPLS_sX68IbZO_ve0QFV1mnUdgog7zY5Z1u_aVvSXeVIYTpSOuYhzaKYjgJqeIevygVC8_v01-f" 
                                alt="Map Location" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="material-symbols-outlined text-neon-green text-5xl opacity-80 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">location_on</span>
                            </div>
                            <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 bg-black/60 border-white/20 rounded-lg backdrop-blur-md">
                                <span className="text-[10px] font-mono text-white/80">12.9716° N, 77.5946° E</span>
                            </div>
                        </div>
                        <button className="w-full mt-3 flex items-center justify-center gap-2 py-3 glass-panel border-white/5 text-neon-green text-xs font-bold bg-white/[0.02] rounded-2xl hover:bg-white/5 transition-colors" type="button">
                            <span className="material-symbols-outlined text-[16px]">my_location</span>
                            RECALIBRATE SENSORS
                        </button>
                    </section>

                    {/* Disclaimer */}
                    <div className="p-4 glass-panel border-hard-pink/20 bg-hard-pink/5 rounded-2xl">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-hard-pink text-[20px]">verified_user</span>
                            <p className="text-[10px] text-white/50 leading-relaxed italic">
                                Certified BioSentinel report. Data encryption active. Encrypted transit to biodiversity central node.
                            </p>
                        </div>
                    </div>
                    <div className="h-16"></div>
                </form>

                {/* Submit Button (Fixed) */}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 z-[70]">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-gradient-end via-bg-gradient-end/90 to-transparent pointer-events-none -mt-10"></div>
                    <button className="relative w-full glass-panel bg-neon-green hover:bg-neon-green/90 text-black font-black h-16 flex items-center justify-center neon-glow transition-all active:scale-95 uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                        Submit Observation
                    </button>
                </div>
            </div>
            <Nav />
        </div>
    )
}

export default Report;