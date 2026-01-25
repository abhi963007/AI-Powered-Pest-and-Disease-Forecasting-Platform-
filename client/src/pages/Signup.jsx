import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Sprout, Leaf, ArrowRight, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icon in Leaflet
const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const LocationMarker = ({ setPosition, position }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : (
        <Marker position={position} icon={markerIcon}></Marker>
    );
};

const MapRecenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
};

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '',
        field_name: '', field_location: '', field_crops: '',
        latitude: 12.9716, longitude: 77.5946
    });
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1`);
            if (res.data && res.data.length > 0) {
                const { lat, lon, display_name } = res.data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                setMapCenter([newLat, newLng]);
                setFormData(prev => ({
                    ...prev,
                    latitude: newLat,
                    longitude: newLng,
                    field_location: display_name.split(',')[0]
                }));
            }
        } catch (e) {
            console.error('Search failed', e);
        }
    };

    const handleMapClick = (latlng) => {
        setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signup(formData);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            alert('Registration failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-[Montserrat]">
            <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row min-h-[750px]">
                {/* Left Side Branding */}
                <div className="flex-1 bg-[#1a237e] p-12 text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <Leaf className="text-green-400" size={32} />
                            <span className="text-2xl font-black tracking-tighter">AGRO SCAN</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none mb-8">Establish your <br />digital farm.</h2>

                        <div className="space-y-6 mt-12 opacity-80">
                            <div className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5"></div>
                                <p className="text-blue-100 font-medium text-sm">Localized community alerts within 10km.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5"></div>
                                <p className="text-blue-100 font-medium text-sm">Real-time disease diagnostics by LLaMA 3.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2 font-black">Current Node</p>
                        <p className="text-xl font-bold font-mono">IDK-KTM REGION</p>
                    </div>
                </div>

                <div className="flex-[1.6] p-12 lg:p-16 overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-sm font-black text-[#6fb342] uppercase tracking-[0.2em] mb-4">Step 01 / 02</h3>
                                <h1 className="text-4xl font-black text-gray-800 mb-2">Personal Identity</h1>
                                <p className="text-gray-400 font-medium mb-10">Secure your profile on our decentralized node.</p>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input name="name" type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl py-4 pl-12 font-bold outline-none transition" placeholder="Full Name" required onChange={handleChange} value={formData.name} />
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input name="phone" type="tel" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl py-4 pl-12 font-bold outline-none transition" placeholder="Phone Number" required onChange={handleChange} value={formData.phone} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input name="email" type="email" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl py-4 pl-12 font-bold outline-none transition" placeholder="Email Address" required onChange={handleChange} value={formData.email} />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input name="password" type="password" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl py-4 pl-12 font-bold outline-none transition" placeholder="Create Password" required onChange={handleChange} value={formData.password} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full bg-[#1a237e] text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                                    >
                                        Configure Location <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-sm font-black text-[#6fb342] uppercase tracking-[0.2em] mb-4">Step 02 / 02</h3>
                                <h1 className="text-4xl font-black text-gray-800 mb-2">Field Mapping</h1>
                                <p className="text-gray-400 font-medium mb-8">Pin your field to enable 10km radius proximity alerts.</p>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input name="field_name" type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-xl py-3 pl-12 font-bold text-sm" placeholder="Plot Name" required onChange={handleChange} value={formData.field_name} />
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input name="field_location" type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-xl py-3 pl-12 font-bold text-sm" placeholder="City/Region" required onChange={handleChange} value={formData.field_location} />
                                        </div>
                                    </div>

                                    {/* Signup Map */}
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-xl px-4 py-2 text-xs outline-none"
                                                placeholder="Search your village/district..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                                            />
                                            <button type="button" onClick={handleSearchLocation} className="bg-gray-800 text-white px-4 rounded-xl font-bold text-[10px] uppercase shadow-lg"><Search size={14} /></button>
                                        </div>
                                        <div className="h-56 w-full rounded-2xl overflow-hidden border-2 border-gray-100 relative z-0">
                                            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                                                <MapRecenter center={mapCenter} />
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationMarker position={[formData.latitude, formData.longitude]} setPosition={handleMapClick} />
                                            </MapContainer>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input name="field_crops" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl py-4 px-6 font-bold text-sm" placeholder="Crops (Tomato, Wheat, etc.)" required onChange={handleChange} value={formData.field_crops} />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-8 py-5 border-2 border-gray-100 rounded-[20px] font-black uppercase tracking-widest text-xs text-gray-400"
                                        >
                                            Modify Identity
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-[#6fb342] text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-sm shadow-xl shadow-green-200 disabled:opacity-50 hover:bg-green-600 transition"
                                        >
                                            {isLoading ? 'Processing...' : 'Complete Registration'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-gray-400 font-bold text-sm">
                        Access Dashboard? <Link to="/login" className="text-blue-600 hover:underline">Authenticated Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
