import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/alert.css';
import Nav from '../components/Nav';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. Fetch & Filter Logic ---
    useEffect(() => {
        const fetchSatelliteData = async () => {
            try {
                // Fetch more events (100) to increase chances of finding Indian events
                const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', {
                    params: {
                        status: 'open',
                        limit: 100, 
                    }
                });

                const rawEvents = response.data.events;
                
                // --- FILTER FOR INDIA ---
                // India Bounding Box (Approximate):
                // Lat: 6.0 to 37.0
                // Lon: 68.0 to 97.0
                const indianEvents = rawEvents.filter(event => {
                    const geometry = event.geometry[event.geometry.length - 1]; // Get latest point
                    // NASA Coordinates are [Longitude, Latitude]
                    const lon = Array.isArray(geometry.coordinates[0]) ? geometry.coordinates[0][0] : geometry.coordinates[0];
                    const lat = Array.isArray(geometry.coordinates[0]) ? geometry.coordinates[0][1] : geometry.coordinates[1];

                    return (lat >= 6 && lat <= 37) && (lon >= 68 && lon <= 97);
                });

                const formattedAlerts = indianEvents.map(event => processEventData(event));
                setAlerts(formattedAlerts);
                setLoading(false);
            } catch (err) {
                console.error("NASA API Error:", err);
                setError("Indian Satellite Uplink Failed");
                setLoading(false);
            }
        };

        fetchSatelliteData();
    }, []);

    // --- 2. Helper: Process Raw NASA Data ---
    const processEventData = (event) => {
        const categoryId = event.categories[0]?.id || 'unknown';
        const lastGeometry = event.geometry[event.geometry.length - 1];
        const date = new Date(lastGeometry.date);
        
        // Calculate "Time Ago"
        const now = new Date();
        const diffMs = now - date;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const timeString = diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs / 24)}d ago`;

        // Format Location
        const coordinates = Array.isArray(lastGeometry.coordinates[0]) 
            ? lastGeometry.coordinates[0] 
            : lastGeometry.coordinates;
        
        const locString = `${coordinates[1].toFixed(2)}° N, ${coordinates[0].toFixed(2)}° E`;

        return {
            id: event.id,
            title: event.title,
            description: event.description || `Active ${event.categories[0].title.toLowerCase()} detected in Indian sector.`,
            type: categoryId,
            categoryLabel: event.categories[0].title,
            timestamp: timeString,
            location: locString,
            link: event.sources[0]?.url,
            style: getCategoryStyle(categoryId)
        };
    };

    // --- 3. Helper: Style Mapper ---
    const getCategoryStyle = (id) => {
        if (['wildfires', 'volcanoes', 'severeStorms'].includes(id)) {
            return {
                card: "glass-card pulse-border-pink bg-hard-pink/[0.08]",
                icon: "local_fire_department",
                iconColor: "text-hard-pink",
                labelColor: "text-hard-pink",
                label: "Critical Alert"
            };
        }
        if (['seaLakeIce', 'snow', 'floods'].includes(id)) {
            return {
                card: "glass-card bg-neon-green/[0.05] border-neon-green/20",
                icon: "flood",
                iconColor: "text-neon-green",
                labelColor: "text-neon-green",
                label: "Environmental Watch"
            };
        }
        return {
            card: "glass-card bg-white/[0.03] hover:bg-white/[0.05]",
            icon: "warning",
            iconColor: "text-white/40",
            labelColor: "text-white/40",
            label: "Active Event"
        };
    };

    return (
        <div className="text-white/90 font-sans min-h-screen bg-bg-dark selection:bg-neon-green/30">
            {/* Header */}
            <div className="flex items-center pt-6 justify-between px-6">
                <div className="flex-1 flex flex-col items-center">
                    <h2 className="frosted-text text-lg font-bold tracking-tight">Indian Sector</h2>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neon-green font-bold">BioSentinel Network</span>
                </div>
            </div>

            <main className="p-6 space-y-6 max-w-md mx-auto pb-32">
                
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-neon-green rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-white/50 animate-pulse">SCANNING INDIAN SUBCONTINENT...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 text-xs font-bold">{error}</p>
                    </div>
                )}

                {/* Alerts List */}
                {!loading && !error && alerts.map((alert) => (
                    <div key={alert.id} className={`relative flex flex-col gap-4 rounded-3xl p-5 shadow-2xl transition-all duration-300 ${alert.style.card}`}>
                        
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`material-symbols-outlined text-sm ${alert.style.iconColor}`}>
                                        {alert.style.icon}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${alert.style.labelColor}`}>
                                        {alert.style.label}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight leading-tight pr-4">
                                    {alert.title}
                                </h3>
                                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 w-fit">
                                    {alert.categoryLabel}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-white/30 whitespace-nowrap uppercase">
                                {alert.timestamp}
                            </span>
                        </div>

                        <div className="flex items-center gap-5 py-3 border-y border-white/5">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-white/40 text-sm">satellite_alt</span>
                                <span className="text-xs font-semibold text-white/80">{alert.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-white/40 italic">
                                Source: NASA EONET
                            </p>
                            <a 
                                href={alert.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                            >
                                Satellite View
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>
                    </div>
                ))}

                {/* Empty State Specific to India */}
                {!loading && alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-60">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <span className="material-symbols-outlined text-3xl text-neon-green">verified_user</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Sector Secure</h3>
                            <p className="text-white/50 text-xs mt-1 max-w-[200px] mx-auto">No active NASA alerts detected over the Indian Subcontinent at this time.</p>
                        </div>
                    </div>
                )}

            </main>

            <Nav />
        </div>
    );
};

export default Alerts;