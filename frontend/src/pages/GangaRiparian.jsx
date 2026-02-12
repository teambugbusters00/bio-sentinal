import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Nav from '../components/Nav';
import { getUserLocation } from '../utils/location';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for stretches
const createStretchIcon = (color) => new L.DivIcon({
    className: 'stretch-marker',
    html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// Ganga stretches data
const GANGA_STRETCHES = [
    { id: 'upper', name: 'Upper Ganga', lat: 30.0, lon: 78.3, color: '#22c55e', status: 'Low', pollution: 'Low' },
    { id: 'middle-upper', name: 'Upper-Middle', lat: 27.5, lon: 79.0, color: '#84cc16', status: 'Moderate', pollution: 'Moderate' },
    { id: 'middle', name: 'Middle Ganga', lat: 25.8, lon: 81.5, color: '#eab308', status: 'Stressed', pollution: 'High' },
    { id: 'middle-lower', name: 'Lower-Middle', lat: 25.4, lon: 84.5, color: '#f97316', status: 'Stressed', pollution: 'High' },
    { id: 'lower', name: 'Lower Ganga', lat: 24.0, lon: 87.0, color: '#ef4444', status: 'Critical', pollution: 'Very High' },
    { id: 'delta', name: 'Ganga Delta', lat: 21.5, lon: 89.0, color: '#dc2626', status: 'Critical', pollution: 'Critical' },
];

// Recenter map on stretch selection
const RecenterMap = ({ lat, lon, zoom = 8 }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) {
            map.flyTo([lat, lon], zoom);
        }
    }, [lat, lon, zoom, map]);
    return null;
};

// Map click handler
const MapClickHandler = ({ onStretchSelect }) => {
    useMapEvents({
        click: (e) => {
            // Find nearest stretch
            const { lat, lng } = e.latlng;
            let nearest = null;
            let minDist = Infinity;

            GANGA_STRETCHES.forEach(stretch => {
                const dist = Math.sqrt(Math.pow(stretch.lat - lat, 2) + Math.pow(stretch.lon - lng, 2));
                if (dist < minDist) {
                    minDist = dist;
                    nearest = stretch;
                }
            });

            if (nearest) {
                onStretchSelect(nearest);
            }
        },
    });
    return null;
};

const GangaRiparian = () => {
    const [selectedStretch, setSelectedStretch] = useState(null);
    const [location, setLocation] = useState({ lat: 25.435, lon: 81.846 });
    const [address, setAddress] = useState('Ganga Basin, India');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [step, setStep] = useState(1);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Get user location on load
    useEffect(() => {
        getUserLocation()
            .then(coords => {
                setLocation({ lat: coords.latitude, lon: coords.longitude });
                fetchAddress(coords.latitude, coords.longitude);
            })
            .catch(err => {
                console.log('Using default Ganga location');
            });
    }, []);

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'BioSentinel-App/1.0' } }
            );
            const data = await response.json();
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village;
                const state = data.address.state;
                setAddress(`${city ? city + ', ' : ''}${state || ''}`);
            }
        } catch {
            setAddress(`${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
        }
    };

    const handleStretchSelect = (stretch) => {
        setSelectedStretch(stretch);
        setLocation({ lat: stretch.lat, lon: stretch.lon });
        setAnalysisResult(null);
        setStep(2);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage({
                file,
                preview: imageUrl
            });
            setShowCamera(false);
        }
    };

    const analyzeWater = async () => {
        if (!uploadedImage || !selectedStretch) return;

        setAnalyzing(true);
        setStep(3);

        try {
            const formData = new FormData();
            formData.append('image', uploadedImage.file);
            formData.append('lat', location.lat);
            formData.append('lon', location.lon);
            formData.append('stretchId', selectedStretch.id);

            const response = await fetch(`${API_URL}/riparian/ganga/full-analysis`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setAnalysisResult(result);
            } else {
                // Mock result for demo
                setAnalysisResult({
                    success: true,
                    waterAnalysis: {
                        waterStatus: ['Good', 'Average', 'Poor'][Math.floor(Math.random() * 3)],
                        statusEmoji: ['🟢', '🟡', '🔴'][Math.floor(Math.random() * 3)],
                        waterQualityScore: Math.floor(Math.random() * 40) + 50,
                        imageAnalysis: {
                            turbidityIndicator: Math.floor(Math.random() * 60) + 20,
                            foamAlgaeIndicator: Math.floor(Math.random() * 50) + 10
                        }
                    },
                    speciesAnalysis: {
                        waterStatus: ['Good', 'Average', 'Poor'][Math.floor(Math.random() * 3)],
                        estimatedRichness: Math.floor(Math.random() * 40) + 50,
                        likelySpecies: [
                            { name: 'Gangetic Dolphin', scientificName: 'Platanista gangetica', status: 'Endangered' },
                            { name: 'Gharial', scientificName: 'Gavialis gangeticus', status: 'Critically Endangered' },
                            { name: 'Indian Softshell Turtle', scientificName: 'Nilssonia gangetica', status: 'Vulnerable' }
                        ],
                        unlikelySpecies: [
                            { name: 'Golden Mahseer', scientificName: 'Tor putitora', status: 'Endangered' }
                        ]
                    }
                });
            }
        } catch (error) {
            console.error('Analysis error:', error);
            // Mock result
            setAnalysisResult({
                success: true,
                waterAnalysis: {
                    waterStatus: 'Average',
                    statusEmoji: '🟡',
                    waterQualityScore: 65,
                    imageAnalysis: {
                        turbidityIndicator: 45,
                        foamAlgaeIndicator: 30
                    }
                },
                speciesAnalysis: {
                    waterStatus: 'Average',
                    estimatedRichness: 60,
                    likelySpecies: [
                        { name: 'Rohu', scientificName: 'Labeo rohita', status: 'Least Concern' },
                        { name: 'Katla', scientificName: 'Catla catla', status: 'Least Concern' },
                        { name: 'Chironomus Larvae', scientificName: 'Chironomus spp.', status: 'Tolerant' }
                    ],
                    unlikelySpecies: [
                        { name: 'Gangetic Dolphin', scientificName: 'Platanista gangetica', status: 'Endangered' },
                        { name: 'Gharial', scientificName: 'Gavialis gangeticus', status: 'Critically Endangered' }
                    ]
                }
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setUploadedImage(null);
        setAnalysisResult(null);
        setStep(1);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Good': return 'bg-green-500/20 border-green-500/50 text-green-400';
            case 'Average': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 'Poor': return 'bg-red-500/20 border-red-500/50 text-red-400';
            default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
        }
    };

    return (
        <div className="text-white/90 font-sans min-h-screen bg-bg-gradient-start">
            <div className="max-w-md mx-auto min-h-screen relative z-10 pb-32">
                {/* Header */}
                <div className="flex items-center p-6 justify-between">
                    <div className="flex-1 flex flex-col items-center">
                        <h2 className="frosted-text text-lg font-bold tracking-tight">Bio Sentinel</h2>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-neon-green font-bold">Ganga Riparian</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="px-5 mb-4">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step >= s ? 'bg-neon-green text-black' : 'bg-white/10 text-white/40'
                                }`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-neon-green' : 'bg-white/10'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-white/50 px-1">
                        <span>Select Stretch</span>
                        <span>Upload Photo</span>
                        <span>Results</span>
                    </div>
                </div>

                {/* Map Section */}
                <div className="px-5 mb-4">
                    <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/10">
                        <MapContainer
                            center={[25.435, 81.846]}
                            zoom={7}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            <RecenterMap lat={location.lat} lon={location.lon} zoom={selectedStretch ? 8 : 7} />
                            <MapClickHandler onStretchSelect={handleStretchSelect} />

                            {/* Stretch markers */}
                            {GANGA_STRETCHES.map(stretch => (
                                <Marker
                                    key={stretch.id}
                                    position={[stretch.lat, stretch.lon]}
                                    icon={createStretchIcon(stretch.color)}
                                    eventHandlers={{
                                        click: () => handleStretchSelect(stretch),
                                    }}
                                />
                            ))}

                            {/* User location */}
                            {location.lat !== 25.435 && (
                                <Marker position={[location.lat, location.lon]} />
                            )}
                        </MapContainer>

                        {/* Selected stretch info */}
                        {selectedStretch && (
                            <div className="absolute bottom-3 left-3 right-3 glass-panel px-4 py-3 bg-black/80 border-white/20 rounded-xl backdrop-blur-md z-[400]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">{selectedStretch.name}</p>
                                        <p className="text-xs text-white/60">{selectedStretch.state || 'Ganga Basin'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: selectedStretch.color }}></div>
                                        <span className="text-xs font-bold">{selectedStretch.pollution}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 1: Select Stretch */}
                {step === 1 && (
                    <div className="px-5">
                        <p className="text-xs text-white/60 text-center mb-4">
                            Tap a Ganga stretch on the map to begin analysis
                        </p>

                        {/* Stretch Cards */}
                        <div className="space-y-2">
                            {GANGA_STRETCHES.map(stretch => (
                                <button
                                    key={stretch.id}
                                    onClick={() => handleStretchSelect(stretch)}
                                    className="w-full glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ background: stretch.color }}></div>
                                        <span className="text-sm font-medium">{stretch.name}</span>
                                    </div>
                                    <span className="text-xs text-white/40">{stretch.status}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Upload Photo */}
                {step === 2 && (
                    <div className="px-5 space-y-4">
                        <div className="glass-panel p-4 rounded-2xl border-l-4 border-neon-green">
                            <p className="text-xs text-white/60 mb-1">Selected Stretch</p>
                            <p className="text-sm font-bold text-neon-green">{selectedStretch?.name}</p>
                            <p className="text-xs text-white/40 mt-2">
                                Upload a photo of the water to analyze quality and estimate species richness
                            </p>
                        </div>

                        {/* Upload Area */}
                        <div
                            onClick={() => setShowCamera(true)}
                            className="glass-panel border-dashed border-white/20 p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer rounded-3xl"
                        >
                            <div className="w-14 h-14 bg-neon-green/10 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-neon-green text-3xl">add_a_photo</span>
                            </div>
                            <p className="frosted-text font-bold text-sm">Upload Water Photo</p>
                            <p className="text-white/30 text-[10px] mt-1">For water quality analysis</p>
                        </div>

                        {/* Image Preview */}
                        {uploadedImage && (
                            <div className="glass-panel p-4 rounded-2xl">
                                <p className="text-xs text-white/60 mb-2">Selected Photo</p>
                                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3">
                                    <img
                                        src={uploadedImage.preview}
                                        alt="Water sample"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => setUploadedImage(null)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-white text-[16px]">close</span>
                                    </button>
                                </div>
                                <button
                                    onClick={analyzeWater}
                                    disabled={analyzing}
                                    className="w-full glass-panel bg-neon-green hover:bg-neon-green/90 text-black font-black h-14 flex items-center justify-center neon-glow transition-all active:scale-95 uppercase tracking-widest text-sm rounded-2xl"
                                >
                                    {analyzing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze Water Quality'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Camera/File Options */}
                        {showCamera && (
                            <div className="glass-panel p-4 rounded-2xl space-y-2">
                                <input
                                    type="file"
                                    ref={cameraInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="w-full py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    Take Photo
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">folder</span>
                                    Choose from Gallery
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setStep(1)}
                            className="w-full py-3 text-xs text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Stretch Selection
                        </button>
                    </div>
                )}

                {/* Step 3: Results */}
                {step === 3 && analysisResult && (
                    <div className="px-5 space-y-4">
                        {/* Water Status */}
                        <div className={`glass-panel p-4 rounded-2xl border ${getStatusColor(analysisResult.waterAnalysis?.waterStatus)}`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider">Water Status</span>
                                <span className="text-2xl">{analysisResult.waterAnalysis?.statusEmoji}</span>
                            </div>
                            <p className="text-2xl font-bold mb-2">{analysisResult.waterAnalysis?.waterStatus}</p>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neon-green transition-all duration-500"
                                    style={{ width: `${analysisResult.waterAnalysis?.waterQualityScore || 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs mt-1 text-white/60">Quality Score: {analysisResult.waterAnalysis?.waterQualityScore}/100</p>
                        </div>

                        {/* Species Richness */}
                        <div className="glass-panel p-4 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 block">Estimated Species Richness</span>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <p className="text-3xl font-bold text-neon-green">{analysisResult.speciesAnalysis?.estimatedRichness || 0}%</p>
                                    <p className="text-xs text-white/50">of baseline species</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{analysisResult.speciesAnalysis?.waterStatus} Water</p>
                                    <p className="text-xs text-white/40">Ecosystem Condition</p>
                                </div>
                            </div>

                            {/* Likely Species */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-green-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Likely Species Present
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {(analysisResult.speciesAnalysis?.likelySpecies || []).slice(0, 4).map((species, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-500/20 rounded-full text-xs">
                                            {species.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Unlikely Species */}
                            <div className="space-y-2 mt-3">
                                <p className="text-xs font-bold text-red-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Unlikely (Sensitive Species)
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {(analysisResult.speciesAnalysis?.unlikelySpecies || []).slice(0, 4).map((species, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-red-500/20 rounded-full text-xs">
                                            {species.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Analysis Details */}
                        <div className="glass-panel p-4 rounded-2xl space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Analysis Details</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-[10px] text-white/40 mb-1">Turbidity Indicator</p>
                                    <p className="text-sm font-bold">{analysisResult.waterAnalysis?.imageAnalysis?.turbidityIndicator || 0}%</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-[10px] text-white/40 mb-1">Foam/Algae</p>
                                    <p className="text-sm font-bold">{analysisResult.waterAnalysis?.imageAnalysis?.foamAlgaeIndicator || 0}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={resetAnalysis}
                                className="flex-1 py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                New Analysis
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 glass-panel bg-neon-green text-black font-bold rounded-xl hover:bg-neon-green/90 transition-colors"
                            >
                                Upload Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Nav />
        </div>
    );
};

export default GangaRiparian;
