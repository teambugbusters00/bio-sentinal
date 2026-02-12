import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Nav from '../components/Nav';
import { getUserLocation } from '../utils/location'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const GBIF_API_URL = import.meta.env.VITE_GBIF_API_URL || 'http://localhost:8000';
const AI_ANALYSIS_URL = import.meta.env.VITE_AI_ANALYSIS_URL || 'http://localhost:3000/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const neonIcon = new L.DivIcon({
    className: 'custom-neon-marker',
    html: `<span class="material-symbols-outlined text-neon-green text-4xl drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" style="font-size: 40px;">location_on</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lon], 18);
    }, [lat, lon, map]);
    return null;
};

const Report = () => {
    const [obsType, setObsType] = useState('Species');
    const [speciesName, setSpeciesName] = useState('');
    const [expertVerify, setExpertVerify] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [riskResult, setRiskResult] = useState(null);
    
    const [location, setLocation] = useState({ lat: 0, lon: 0 });
    const [address, setAddress] = useState('Initializing Sensors...');
    const [gpsLoading, setGpsLoading] = useState(true);
    const [gpsError, setGpsError] = useState(null);
    const [scanStatus, setScanStatus] = useState('IDLE');

    const [uploadedImages, setUploadedImages] = useState([]);
    
    const [showUploadConfirm, setShowUploadConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);
    
    const [selectedImage, setSelectedImage] = useState(null);
    
    const [scanningImage, setScanningImage] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);
    
    const [gbifSuggestions, setGbifSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchingGbif, setSearchingGbif] = useState(false);
    const searchTimeoutRef = useRef(null);
    
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const getLocation = async () => {
        setGpsLoading(true);
        setGpsError(null);
        setAddress("Triangulating signal...");

        try {
            const coords = await getUserLocation();
            const { latitude, longitude } = coords;

            setLocation({ lat: latitude, lon: longitude });
            fetchAddress(latitude, longitude);
            
            return { latitude, longitude };
        } catch (error) {
            console.error("Location Error:", error);
            setGpsError("GPS Signal Lost");
            setAddress("Unable to retrieve location");
            throw error;
        } finally {
            setGpsLoading(false);
        }
    };

    const fetchSpecies = (lat, lon) => {
        console.log(`Scanning local species for: ${lat}, ${lon}`);
    };

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'BioSentinel-App/1.0' } }
            );
            const data = await response.json();
            
            let displayAddress = "Unknown Territory";
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.county;
                const state = data.address.state || data.address.country;
                displayAddress = `${city ? city + ', ' : ''}${state}`;
            }
            
            setAddress(displayAddress);
        } catch {
            setAddress(`${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
        } finally {
            setGpsLoading(false);
        }
    };

    useEffect(() => {
        getLocation().catch(err => console.log("Initial GPS silent fail", err));
    }, []);

    const searchGbifSpecies = async (query) => {
        if (!query || query.length < 2) {
            setGbifSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setSearchingGbif(true);
        try {
            const response = await fetch(
                `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(query)}`,
                { headers: { 'User-Agent': 'BioSentinel-App/1.0' } }
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const suggestions = data.results.slice(0, 5).map(s => ({
                    scientificName: s.scientificName,
                    canonicalName: s.canonicalName,
                    kingdom: s.kingdom,
                    taxonomicStatus: s.taxonomicStatus
                }));
                setGbifSuggestions(suggestions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('GBIF search error:', error);
            setGbifSuggestions([]);
        } finally {
            setSearchingGbif(false);
        }
    };

    const handleSpeciesChange = (e) => {
        const value = e.target.value;
        setSpeciesName(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchGbifSpecies(value);
        }, 300);
    };

    const selectSuggestion = (suggestion) => {
        setSpeciesName(suggestion.canonicalName || suggestion.scientificName);
        setGbifSuggestions([]);
        setShowSuggestions(false);
    };

    const analyzeImage = async (file) => {
        const endpoint = `${AI_ANALYSIS_URL}/classify/image/analyze`;
        console.log('Starting image analysis:', file.name);
        console.log('API endpoint:', endpoint);
        
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Analysis result:', result);
                return result;
            } else {
                const errorText = await response.text();
                console.error('Analysis failed with status:', response.status, errorText);
            }
        } catch (error) {
            console.error('Image analysis fetch error:', error);
        }
        return null;
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
        
        if (validFiles.length > 0) {
            setPendingFiles(validFiles);
            setShowUploadConfirm(true);
        }
    };

    const confirmUpload = async () => {
        setShowUploadConfirm(false);
        
        for (let i = 0; i < pendingFiles.length; i++) {
            const file = pendingFiles[i];
            const imageUrl = URL.createObjectURL(file);
            
            setScanningImage({
                id: Date.now() + i,
                name: file.name,
                size: file.size,
                data: imageUrl
            });
            setScanProgress(0);
            
            for (let p = 0; p <= 100; p += 10) {
                await new Promise(resolve => setTimeout(resolve, 50));
                setScanProgress(p);
            }
            
            const analysisResult = await analyzeImage(file);
            
            const isValid = !analysisResult?.ai_detection?.is_suspicious && 
                           !analysisResult?.pixel_analysis?.is_suspicious &&
                           analysisResult?.overall_assessment?.is_accepted !== false;
            
            setUploadedImages(prev => [...prev, {
                id: Date.now() + i,
                name: file.name,
                size: file.size,
                data: imageUrl,
                analysis: analysisResult,
                is_valid: isValid
            }]);
            
            setScanningImage(null);
            setScanProgress(0);
            
            if (!isValid) {
                alert(`⚠️ AI-GENERATED IMAGE DETECTED: "${file.name}"\n\nThis image cannot be used for biodiversity reporting as it appears to be AI-generated.\n\nPlease upload authentic photos of wildlife.`);
            }
        }
        
        setPendingFiles([]);
    };
    
    const cancelUpload = () => {
        setShowUploadConfirm(false);
        setPendingFiles([]);
    };

    const removeImage = (id) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const openCamera = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const classifyWithGBIF = async (species, lat, lon) => {
        try {
            const response = await fetch(`${GBIF_API_URL}/gbif/classify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ species, lat, lon, radius: 25 })
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('GBIF classification error:', error);
        }
        return null;
    };

    const hasRejectedImages = () => {
        return uploadedImages.some(img => img.is_valid === false);
    };
    
    const getValidImageCount = () => {
        return uploadedImages.filter(img => img.is_valid !== false).length;
    };

    const handleSubmitClick = () => {
        if (hasRejectedImages()) {
            alert('Some images have been rejected due to AI-generated content detection. Please upload authentic photos.');
            return;
        }
        
        setShowSubmitConfirm(true);
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);
        setSubmitting(true);
        
        let riskData = null;
        if (speciesName && location.lat !== 0) {
            riskData = await classifyWithGBIF(speciesName, location.lat, location.lon);
        }
        
        const reportData = {
            type: obsType,
            species: speciesName,
            verificationRequested: expertVerify,
            location: location,
            address: address,
            timestamp: new Date().toISOString(),
            images: uploadedImages,
            riskAssessment: riskData
        };
        
        console.log("Submitting Report Payload:", reportData);
        setRiskResult(riskData);
        setSubmitting(false);
        
        alert('Report submitted successfully!');
    };

    const cancelSubmit = () => {
        setShowSubmitConfirm(false);
    };

    const getRiskColor = (level) => {
        switch(level) {
            case 'Critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'High': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
            case 'At Risk': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            default: return 'bg-green-500/20 border-green-500/50 text-green-400';
        }
    };
    
    const getAnalysisBadge = (analysis) => {
        if (!analysis) return null;
        
        const isSuspicious = analysis.ai_detection?.is_suspicious || 
                             analysis.pixel_analysis?.is_suspicious ||
                             analysis.overall_assessment?.is_accepted === false;
        
        if (isSuspicious) {
            return (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white" title="AI-generated content detected">
                    <span className="material-symbols-outlined text-white text-[10px]">close</span>
                </div>
            );
        }
        
        return (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center border border-white" title="Analyzed - Authentic">
                <span className="material-symbols-outlined text-black text-[10px]">check</span>
            </div>
        );
    };
    
    const openAnalysisDetails = (img) => {
        if (img.analysis) {
            setSelectedImage(img);
        }
    };
    
    const closeAnalysisDetails = () => {
        setSelectedImage(null);
    };
    
    const getAIDetectionReasons = (analysis) => {
        const reasons = [];
        
        if (analysis.ai_detection) {
            if (analysis.ai_detection.ai_probability !== undefined) {
                reasons.push({
                    type: 'AI Probability',
                    value: `${(analysis.ai_detection.ai_probability * 100).toFixed(1)}%`,
                    detail: analysis.ai_detection.ai_probability > 0.7 ? 'High AI likelihood' : 
                           analysis.ai_detection.ai_probability > 0.4 ? 'Moderate AI likelihood' : 'Low AI likelihood'
                });
            }
            if (analysis.ai_detection.is_suspicious && analysis.ai_detection.reasons) {
                analysis.ai_detection.reasons.forEach(r => reasons.push({ type: 'AI Detection', detail: r }));
            }
        }
        
        if (analysis.pixel_analysis) {
            if (analysis.pixel_analysis.anomaly_score !== undefined) {
                reasons.push({
                    type: 'Pixel Anomaly Score',
                    value: `${(analysis.pixel_analysis.anomaly_score * 100).toFixed(1)}%`,
                    detail: analysis.pixel_analysis.anomaly_score > 0.5 ? 'Significant pixel anomalies detected' : 
                           analysis.pixel_analysis.anomaly_score > 0.2 ? 'Minor pixel irregularities' : 'No significant pixel anomalies'
                });
            }
            if (analysis.pixel_analysis.is_suspicious && analysis.pixel_analysis.reasons) {
                analysis.pixel_analysis.reasons.forEach(r => reasons.push({ type: 'Pixel Analysis', detail: r }));
            }
        }
        
        if (analysis.overall_assessment) {
            reasons.push({
                type: 'Overall Assessment',
                value: analysis.overall_assessment.is_accepted ? 'Accepted' : 'Rejected',
                detail: analysis.overall_assessment.summary || 'Based on all detection methods'
            });
            if (analysis.overall_assessment.recommendations) {
                analysis.overall_assessment.recommendations.forEach(r => reasons.push({ type: 'Recommendation', detail: r }));
            }
        }
        
        return reasons;
    };

    const scanStyle = {
        animation: 'scan 1.5s ease-in-out infinite'
    };

    return (
        <div className="text-white/90 font-sans min-h-screen bg-bg-gradient-start selection:bg-neon-green/30">
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
            <div className="max-w-md mx-auto min-h-screen relative z-10 pb-32">
                
                <div className="flex items-center p-6 justify-between">
                    <div className="flex-1 flex flex-col items-center">
                        <h2 className="frosted-text text-lg font-bold tracking-tight">Bio Sentinal</h2>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-neon-green font-bold">Report Observation</span>
                    </div>
                </div>

                <form className="px-5 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    
                    <section>
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Observation Type</h3>
                        <div className="flex h-12 w-full items-center glass-panel p-1.5 gap-1 rounded-2xl">
                            {['Species', 'Sacred Grove', 'Threat'].map((type) => (
                                <label key={type} className="flex-1 h-full cursor-pointer relative">
                                    <input 
                                        type="radio" 
                                        name="obs_type" 
                                        value={type} 
                                        checked={obsType === type}
                                        onChange={() => setObsType(type)}
                                        className="hidden peer" 
                                    />
                                    <div className={`h-full flex items-center justify-center rounded-[10px] text-xs font-bold transition-all ${
                                        obsType === type 
                                            ? `bg-white/10 ${type === 'Threat' ? 'text-hard-pink' : 'text-neon-green'} shadow-sm` 
                                            : 'text-white/50'
                                    }`}>
                                        {type === 'Sacred Grove' ? 'Grove' : type}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Evidence</h3>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <input
                            type="file"
                            ref={cameraInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                        />
                        
                        <div 
                            onClick={openFilePicker}
                            className="glass-panel border-dashed border-white/20 p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group rounded-3xl"
                        >
                            <div className="w-14 h-14 bg-neon-green/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                                <span className="material-symbols-outlined text-neon-green text-3xl">add_a_photo</span>
                            </div>
                            <p className="frosted-text font-bold text-sm">Upload Evidence</p>
                            <p className="text-white/30 text-[10px] mt-1 font-medium tracking-wide">High-resolution preferred</p>
                            <div className="flex gap-4 mt-3">
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openCamera(); }}
                                    className="text-[10px] text-neon-green hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                                    Camera
                                </button>
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
                                    className="text-[10px] text-neon-green hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">folder</span>
                                    Gallery
                                </button>
                            </div>
                        </div>
                        
                        {uploadedImages.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {uploadedImages.map((img) => (
                                    <div 
                                        key={img.id} 
                                        className={`relative w-16 h-16 rounded-lg overflow-hidden border cursor-pointer group ${img.is_valid === false ? 'border-red-500/50 opacity-60' : 'border-white/20'}`}
                                        onClick={() => openAnalysisDetails(img)}
                                    >
                                        <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                                        {getAnalysisBadge(img.analysis)}
                                        <div className={`absolute inset-0 ${img.is_valid === false ? 'bg-red-500/20' : 'bg-black/0'} group-hover:bg-black/30 transition-colors flex items-center justify-center`}>
                                            {img.is_valid === false && (
                                                <span className="material-symbols-outlined text-red-500 text-xs">block</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                            className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] py-0.5 truncate hover:bg-red-500/80 transition-colors"
                                        >
                                            {img.name.length > 12 ? img.name.substring(0, 12) + '...' : img.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 ml-1">Identification</h3>
                        <div className="flex flex-col">
                            <div className="relative">
                                <input 
                                    className="glass-input w-full h-14 pr-12 pl-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 text-white placeholder-white/30 text-sm font-medium outline-none transition-all" 
                                    placeholder="Species Name (e.g. Panthera tigris)" 
                                    type="text" 
                                    value={speciesName}
                                    onChange={handleSpeciesChange}
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                                    {searchingGbif ? 'hourglass_empty' : 'search'}
                                </span>
                                
                                {showSuggestions && gbifSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 shadow-xl">
                                        {gbifSuggestions.map((suggestion, index) => (
                                            <div 
                                                key={index}
                                                onClick={() => selectSuggestion(suggestion)}
                                                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-none transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-white font-medium">
                                                        {suggestion.canonicalName || suggestion.scientificName}
                                                    </span>
                                                    <span className="text-[10px] text-white/40 px-2 py-0.5 bg-white/10 rounded-full">
                                                        {suggestion.kingdom}
                                                    </span>
                                                </div>
                                                {suggestion.taxonomicStatus !== 'ACCEPTED' && (
                                                    <span className="text-[10px] text-yellow-400">
                                                        {suggestion.taxonomicStatus}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="glass-panel p-4 bg-white/[0.03] rounded-2xl">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div className="flex flex-col">
                                    <span className="frosted-text text-sm font-bold">Expert Verification</span>
                                    <span className="text-white/40 text-[11px]">Request AI & specialist identification</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={expertVerify}
                                        onChange={(e) => setExpertVerify(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green shadow-inner"></div>
                                </div>
                            </label>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em]">Location</h3>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${gpsLoading ? 'bg-yellow-400' : 'bg-neon-green'} animate-pulse`}></div>
                                <span className={`${gpsLoading ? 'text-yellow-400' : 'text-neon-green'} text-[10px] font-bold uppercase tracking-wider`}>
                                    {scanStatus === 'LOCATING USER...' ? 'LOCATING...' : (gpsLoading ? 'FETCHING...' : 'SYNCED')}
                                </span>
                            </div>
                        </div>

                        <div className="relative w-full h-44 rounded-3xl overflow-hidden border border-white/10 glass-panel z-0">
                            {location.lat !== 0 ? (
                                <MapContainer 
                                    center={[location.lat, location.lon]} 
                                    zoom={18} 
                                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                                    zoomControl={false}
                                    dragging={false} 
                                    attributionControl={false}
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                    <RecenterMap lat={location.lat} lon={location.lon} />
                                    <Marker position={[location.lat, location.lon]} icon={neonIcon} />
                                </MapContainer>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-black/60">
                                    <span className="text-white/30 text-xs">Waiting for GPS signal...</span>
                                </div>
                            )}

                            <div className="absolute bottom-3 left-3 right-3 glass-panel px-3 py-2 bg-black/80 border-white/20 rounded-xl backdrop-blur-md flex items-center justify-between z-[400]">
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] font-mono text-neon-green font-bold mb-0.5">
                                        {location.lat.toFixed(4)}° N, {location.lon.toFixed(4)}° E
                                    </span>
                                    <span className="text-[10px] text-white/70 truncate w-full">
                                        {gpsError ? gpsError : address}
                                    </span>
                                </div>
                                <span className="material-symbols-outlined text-neon-green text-lg animate-pulse ml-2">target</span>
                            </div>
                        </div>
                        
                        <button 
                            type="button"
                            onClick={async () => {
                                try {
                                    setScanStatus("LOCATING USER...");
                                    const { latitude, longitude } = await getLocation();
                                    fetchSpecies(latitude, longitude);
                                    setScanStatus("IDLE");
                                } catch (err) {
                                    console.error(err);
                                    setScanStatus("LOCATION ACCESS DENIED");
                                }
                            }}
                            disabled={gpsLoading}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 glass-panel border-white/5 text-neon-green text-xs font-bold bg-white/[0.02] rounded-2xl hover:bg-white/5 transition-colors active:scale-95 disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined text-[16px] ${gpsLoading ? 'animate-spin' : ''}`}>
                                {gpsLoading ? 'refresh' : 'my_location'}
                            </span>
                            {gpsLoading ? 'FETCHING...' : 'REFETCH ADDRESS'}
                        </button>
                    </section>

                    <div className="p-4 glass-panel border-hard-pink/20 bg-hard-pink/5 rounded-2xl">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-hard-pink text-[20px]">verified_user</span>
                            <p className="text-[10px] text-white/50 leading-relaxed italic">
                                Certified BioSentinel report. Data encryption active. Encrypted transit to biodiversity central node.
                            </p>
                        </div>
                    </div>
                </form>

                <div className="max-w-md mx-auto p-6 z-70 relative">
                    <div className="absolute inset-0 bg-linear-to-t from-bg-gradient-end via-bg-gradient-end/90 to-transparent pointer-events-none -mt-10"></div>
                    
                    {riskResult && (
                        <div className={`mb-4 p-4 rounded-2xl border ${getRiskColor(riskResult.riskLevel)}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider">GBIF Risk Assessment</span>
                                <span className="text-sm font-bold">{riskResult.riskLevel}</span>
                            </div>
                            <div className="text-xs text-white/80 space-y-1">
                                <p>Score: {riskResult.riskScore}</p>
                                <p>Observations: {riskResult.observations} ({riskResult.trendRatio?.toFixed(1) || 1}x avg)</p>
                                {riskResult.reason && riskResult.reason.map((r, i) => (
                                    <p key={i}>• {r}</p>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleSubmitClick}
                        disabled={submitting || getValidImageCount() === 0}
                        className="relative w-full glass-panel bg-neon-green hover:bg-neon-green/90 text-black font-black h-16 flex items-center justify-center neon-glow transition-all active:scale-95 uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                                ANALYZING...
                            </>
                        ) : (
                            <span>Submit Observation</span>
                        )}
                    </button>
                </div>
            </div>
            <Nav />
            
            {showUploadConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="glass-panel bg-gray-900/95 border border-white/20 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-neon-green text-2xl">image</span>
                            <h3 className="text-lg font-bold text-white">Confirm Upload</h3>
                        </div>
                        <p className="text-white/70 text-sm mb-6">
                            {pendingFiles.length} image(s) selected for analysis. Images will be scanned for AI-generated content.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={cancelUpload}
                                className="flex-1 py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmUpload}
                                className="flex-1 py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-neon-green/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">check</span>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {scanningImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
                    <div className="glass-panel bg-gray-900/95 border border-neon-green/30 p-6 rounded-2xl max-w-sm w-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-neon-green text-2xl animate-pulse">psychology</span>
                                <h3 className="text-lg font-bold text-white">Scanning Image</h3>
                            </div>
                            <span className="text-neon-green font-mono">{scanProgress}%</span>
                        </div>
                        
                        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 border border-white/20">
                            <img 
                                src={scanningImage.data} 
                                alt="Scanning" 
                                className="w-full h-full object-contain bg-black/50"
                            />
                            <div 
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/50 to-transparent"
                                style={{
                                    ...scanStyle,
                                    height: '4px',
                                    top: `${scanProgress}%`,
                                    opacity: 0.8
                                }}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        </div>
                        
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-neon-green transition-all duration-100"
                                style={{ width: `${scanProgress}%` }}
                            ></div>
                        </div>
                        
                        <p className="text-white/60 text-xs mt-3 text-center">Analyzing for AI-generated content...</p>
                    </div>
                </div>
            )}
            
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="glass-panel bg-gray-900/95 border border-white/20 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-neon-green text-2xl">send</span>
                            <h3 className="text-lg font-bold text-white">Submit Report?</h3>
                        </div>
                        <p className="text-white/70 text-sm mb-6">
                            This will submit {uploadedImages.length} image(s) to the biodiversity database.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={cancelSubmit}
                                className="flex-1 py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmSubmit}
                                className="flex-1 py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-neon-green/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">check</span>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {selectedImage && selectedImage.analysis && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={closeAnalysisDetails}>
                    <div className="glass-panel bg-gray-900/95 border border-white/20 p-6 rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined ${selectedImage.analysis.overall_assessment?.is_accepted === false ? 'text-red-500' : 'text-neon-green'} text-2xl`}>
                                    {selectedImage.analysis.overall_assessment?.is_accepted === false ? 'warning' : 'verified'}
                                </span>
                                <h3 className="text-lg font-bold text-white">Image Analysis</h3>
                            </div>
                            <button 
                                onClick={closeAnalysisDetails}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 border border-white/20">
                            <img src={selectedImage.data} alt="Analyzed" className="w-full h-full object-contain bg-black/50" />
                        </div>
                        
                        <div className={`p-3 rounded-xl mb-4 ${selectedImage.analysis.overall_assessment?.is_accepted === false ? 'bg-red-500/20 border border-red-500/30' : 'bg-neon-green/20 border border-neon-green/30'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">Status</span>
                                <span className={`text-sm font-bold ${selectedImage.analysis.overall_assessment?.is_accepted === false ? 'text-red-400' : 'text-neon-green'}`}>
                                    {selectedImage.analysis.overall_assessment?.is_accepted === false ? 'AI-GENERATED DETECTED' : 'AUTHENTIC'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Analysis Details</h4>
                            {getAIDetectionReasons(selectedImage.analysis).map((reason, index) => (
                                <div key={index} className="glass-panel bg-white/[0.03] p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-neon-green">{reason.type}</span>
                                        {reason.value && (
                                            <span className="text-xs font-bold text-white/80">{reason.value}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/50">{reason.detail}</p>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={closeAnalysisDetails}
                            className="w-full mt-4 py-3 glass-panel border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Report;
