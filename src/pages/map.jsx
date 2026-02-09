import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Nav from '../components/Nav';

// --- ICONS CONFIGURATION ---
// Custom Neon Marker Icon logic
const createNeonIcon = (color = '#39FF14') => {
  return new L.DivIcon({
    className: 'custom-neon-marker',
    html: `<span class="material-symbols-outlined text-[30px]" style="color: ${color}; text-shadow: 0 0 10px ${color};">location_on</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const userIcon = new L.DivIcon({
    className: 'user-marker',
    html: `<div class="w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// --- HELPER COMPONENTS ---
const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 2 });
        }
    }, [center, zoom, map]);
    return null;
};

// --- MAIN COMPONENT ---
const Map = () => {
    // --- STATES ---
    const [query, setQuery] = useState('');
    const [center, setCenter] = useState([22.5726, 88.3639]); // Default: Kolkata (based on your profile)
    const [zoom, setZoom] = useState(13);
    const [speciesList, setSpeciesList] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanStatus, setScanStatus] = useState("SYSTEM IDLE");

    // --- 1. SEARCH LOCATION & FETCH SPECIES ---
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && query.length > 2) {
            setLoading(true);
            setScanStatus("TRIANGULATING...");
            
            try {
                // A. Geocode Address
                const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                if (geoRes.data.length > 0) {
                    const { lat, lon } = geoRes.data[0];
                    const newCenter = [parseFloat(lat), parseFloat(lon)];
                    setCenter(newCenter);
                    setZoom(14);
                    
                    // B. Fetch Species from GBIF
                    fetchSpecies(lat, lon);
                } else {
                    setScanStatus("LOCATION NOT FOUND");
                }
            } catch (err) {
                console.error(err);
                setScanStatus("NETWORK ERROR");
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchSpecies = async (lat, lon) => {
        setScanStatus("SCANNING BIOSIGNATURES...");
        // Define a roughly 5km range box
        const range = 0.05; 
        try {
            const gbifUrl = `https://api.gbif.org/v1/occurrence/search`;
            const params = {
                decimalLatitude: `${lat - range},${parseFloat(lat) + range}`,
                decimalLongitude: `${lon - range},${parseFloat(lon) + range}`,
                taxonKey: '1', // Animals
                hasCoordinate: 'true',
                mediaType: 'StillImage', 
                limit: 20, 
            };
            
            const res = await axios.get(gbifUrl, { params });
            const results = res.data.results;
            
            setSpeciesList(results);
            
            if (results.length > 0) {
                setScanStatus(`${results.length} SIGNATURES DETECTED`);
                setSelectedSpecies(results[0]); // Auto-select first result
            } else {
                setScanStatus("NO LIFEFORMS DETECTED");
            }

        } catch (error) {
            setScanStatus("SENSOR FAILURE");
        }
    };

    // --- RENDER ---
    return (
        <div className="font-sans bg-black text-slate-100 antialiased overflow-hidden h-screen w-full relative">
            
            {/* --- MAP LAYER (Background) --- */}
            <div className="absolute inset-0 z-0">
                <MapContainer 
                    center={center} 
                    zoom={zoom} 
                    zoomControl={false} 
                    attributionControl={false}
                    style={{ height: "100%", width: "100%", background: "#050505" }}
                >
                    {/* Dark/Sci-Fi Tile Layer */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    
                    <MapController center={center} zoom={zoom} />

                    {/* Render Species Markers */}
                    {speciesList.map((s) => (
                        <Marker 
                            key={s.key}
                            position={[s.decimalLatitude, s.decimalLongitude]}
                            icon={createNeonIcon(s.iucnRedListCategory === 'CR' ? '#ff0055' : '#39FF14')}
                            eventHandlers={{
                                click: () => {
                                    setSelectedSpecies(s);
                                    setCenter([s.decimalLatitude, s.decimalLongitude]);
                                },
                            }}
                        />
                    ))}
                    
                    {/* User Location Marker (Simulated Center) */}
                    <Marker position={center} icon={userIcon} />
                </MapContainer>
                
                {/* Visual Overlay: Grid & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
                <div 
                    className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                    }}
                ></div>
            </div>

            {/* --- UI LAYER: Header & Search --- */}
            <div className="absolute top-0 left-0 w-full z-20 p-4 pt-14">
                <div className="flex items-center gap-3">
                    <div className="flex-1 glass-panel h-12 rounded-2xl flex items-center px-4 relative">
                        <span className="material-symbols-outlined text-primary mr-3 text-xl">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-500 font-medium text-white focus:outline-none uppercase" 
                            placeholder={scanStatus}
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        {loading && (
                            <div className="absolute right-4 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                    <button className="size-12 glass-panel rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-slate-300">tune</span>
                    </button>
                </div>
            </div>

            {/* --- UI LAYER: Right Controls --- */}
            <div className="absolute top-36 right-4 z-20 flex flex-col gap-4">
                <div className="flex flex-col glass-capsule p-1.5 gap-1">
                    <button className="size-10 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">layers</span>
                    </button>
                    <div className="h-[1px] w-6 mx-auto bg-white/10"></div>
                    <button className="size-10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined filled-icon">satellite_alt</span>
                    </button>
                </div>
                <div className="flex flex-col glass-capsule p-1.5 gap-1">
                    <button 
                        className="size-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        onClick={() => setZoom(z => z + 1)}
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <div className="h-[1px] w-6 mx-auto bg-white/10"></div>
                    <button 
                        className="size-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        onClick={() => setZoom(z => z - 1)}
                    >
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                </div>
                <button 
                    className="size-12 glass-capsule flex items-center justify-center text-primary neon-glow-green border-primary/30 hover:bg-primary/20 transition-colors"
                    onClick={() => {
                        // Reset to user location (simulated)
                        navigator.geolocation.getCurrentPosition(pos => {
                             const { latitude, longitude } = pos.coords;
                             setCenter([latitude, longitude]);
                             fetchSpecies(latitude, longitude);
                        });
                    }}
                >
                    <span className="material-symbols-outlined filled-icon">my_location</span>
                </button>
            </div>

            {/* --- UI LAYER: Registry Legend --- */}
            <div className="absolute bottom-[38%] left-4 z-20 glass-panel p-3 rounded-xl min-w-[130px]">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 font-mono">Registry Legend</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="size-2.5 rounded-full bg-primary neon-glow-green"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Safe</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-2.5 rounded-full bg-accent neon-glow-pink"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Endangered</span>
                    </div>
                </div>
            </div>

            {/* --- UI LAYER: Detail Card (Dynamic) --- */}
            <div className="absolute bottom-0 left-0 w-full z-30 px-4 pb-10">
                {selectedSpecies ? (
                    <div className="glass-panel rounded-[2rem] overflow-hidden relative transition-all duration-500">
                        {/* Ambient Background Glows */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 blur-3xl -ml-16 -mb-16"></div>
                        
                        <div className="h-1.5 w-10 bg-white/10 rounded-full mx-auto mt-3 mb-1"></div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 border text-[9px] font-bold rounded uppercase tracking-[0.15em] ${
                                            selectedSpecies.iucnRedListCategory === 'CR' || selectedSpecies.iucnRedListCategory === 'EN'
                                            ? 'border-accent/50 bg-accent/10 text-accent'
                                            : 'border-primary/50 bg-primary/10 text-primary'
                                        }`}>
                                            {selectedSpecies.iucnRedListCategory || 'DATA DEFICIENT'}
                                        </span>
                                        <span className="text-slate-500 text-[10px] font-mono tracking-tighter">ID-{selectedSpecies.key}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight text-white font-sans tracking-tight line-clamp-1">
                                        {selectedSpecies.species || selectedSpecies.scientificName}
                                    </h2>
                                    <p className="text-slate-400 text-xs font-mono tracking-wide mt-1 uppercase">
                                        {selectedSpecies.order} • {selectedSpecies.family}
                                    </p>
                                </div>
                                {/* Thumbnail Image */}
                                <div 
                                    className="size-20 rounded-2xl bg-cover bg-center border border-white/10 relative overflow-hidden shrink-0" 
                                    style={{ 
                                        backgroundImage: `url("${selectedSpecies.media?.[0]?.identifier || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC129rLoC1aevX4lPQtm0JuGdXqUxV_EO3RX_oy7ZI7TGE_Ro2Dc6EV809wR8BBr7UdqTVV4pxtXYqlVIyQ3jbrGWg9xvGTLxXZiHdGExWu7iQ-X1D4F_D5GY0_TCUAbfqSOBg_wMUWVGvUb-eJtaHEiL5eSokC4OJDjUaitLBPQx_yrb5u7ej1a7lmB1iKqjxXeIPAJuMh6KbYzR5b6UI0x8eew79p40ZN_MvPt8BS1eQGLb1GWp51-DzVveUHi-2S5CeUSjWz72G'}")` 
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1 font-mono">GIS COORDS</p>
                                    <p className="text-[11px] font-mono font-medium text-slate-200">
                                        {selectedSpecies.decimalLatitude.toFixed(4)}, {selectedSpecies.decimalLongitude.toFixed(4)}
                                    </p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1 font-mono">BASIS</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-[14px] filled-icon">verified</span>
                                        <p className="text-[11px] font-bold text-primary tracking-wide">
                                            {selectedSpecies.basisOfRecord?.replace('_', ' ') || 'OBSERVATION'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 h-14 bg-primary text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 uppercase tracking-tighter text-sm neon-glow-green hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined font-bold">query_stats</span>
                                    Analyze Data
                                </button>
                                <button className="size-14 glass-panel border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-white/10">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Default State when no species selected
                    <div className="glass-panel rounded-3xl p-6 text-center">
                        <span className="material-symbols-outlined text-white/30 text-4xl mb-2">travel_explore</span>
                        <p className="text-white/50 text-sm font-medium">Use the search bar or click "My Location" to scan for biodiversity.</p>
                    </div>
                )}
            </div>
            
            <Nav />
        </div>
    );
};

export default Map;