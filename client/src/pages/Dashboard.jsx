import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, X, Sprout, Loader2, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
// Use a simple custom SVG icon or fix the default path
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
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FieldCard = ({ field, onDelete }) => {
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
        >
            <div className="p-8 pb-4 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 group-hover:text-[#6fb342] transition-colors">{field.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                            <MapPin size={14} className="text-[#6fb342]" />
                            <span className="text-xs font-bold uppercase tracking-widest">{field.location}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowMap(!showMap)}
                            className={`p-3 rounded-2xl transition-all duration-300 ${showMap ? 'bg-[#6fb342] text-white shadow-lg shadow-green-200' : 'bg-green-50 text-[#6fb342] hover:bg-green-100'}`}
                            title={showMap ? "Show Details" : "Show Map"}
                        >
                            <MapPin size={20} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(field._id)}
                            className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300"
                            title="Delete Field"
                        >
                            <Trash2 size={20} />
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!showMap ? (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Crop Variety</p>
                                <div className="flex flex-wrap gap-2">
                                    {field.crops.map(crop => (
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            key={crop}
                                            className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100 flex items-center gap-2"
                                        >
                                            <Sprout size={12} />
                                            {crop}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Healthy
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Scan</p>
                                    <p className="text-sm font-bold text-gray-600">Today</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-[200px] w-full rounded-[30px] overflow-hidden border-2 border-green-100 shadow-inner relative z-0"
                        >
                            <MapContainer
                                center={[field.latitude || 20.5937, field.longitude || 78.9629]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                />
                                <Marker position={[field.latitude || 20.5937, field.longitude || 78.9629]} icon={markerIcon} />
                            </MapContainer>
                            <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                                <p className="text-[10px] font-black text-[#2d5a27] uppercase tracking-tighter">Live Geo-Data</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-8 pb-8 mt-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/forecast', { state: { fieldId: field._id } })}
                    className="w-full bg-[#1a2e1d] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-[#6fb342] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    Enter Field Dashboard
                </motion.button>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newField, setNewField] = useState({
        name: '',
        location: '',
        crops: '',
        latitude: '',
        longitude: ''
    });

    // Map state for modal
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fields');
            setFields(res.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
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
                setNewField({
                    ...newField,
                    latitude: newLat.toFixed(6),
                    longitude: newLng.toFixed(6)
                });
                if (!newField.location) {
                    setNewField(prev => ({ ...prev, location: display_name.split(',')[0] }));
                }
            } else {
                alert('Location not found');
            }
        } catch (e) {
            console.error('Search failed', e);
        }
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const cropsList = newField.crops.split(',').map(c => c.trim());
            const payload = {
                ...newField,
                crops: cropsList,
                latitude: parseFloat(newField.latitude) || 20.5937,
                longitude: parseFloat(newField.longitude) || 78.9629
            };

            const res = await axios.post('http://localhost:5000/api/fields', payload);
            setFields([...fields, res.data]);
            setIsModalOpen(false);
            setNewField({ name: '', location: '', crops: '', latitude: '', longitude: '' });
            setSearchQuery('');
        } catch (err) {
            alert('Failed to add field: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteField = async (id) => {
        if (window.confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/fields/${id}`);
                setFields(fields.filter(f => f._id !== id));
            } catch (err) {
                alert('Failed to delete field: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleMapClick = (latlng) => {
        setNewField({
            ...newField,
            latitude: latlng.lat.toFixed(6),
            longitude: latlng.lng.toFixed(6)
        });
    };

    return (
        <div className="min-h-screen p-6 md:p-12 font-[Montserrat] bg-[#f8faf7]">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-[#1a2e1d] mb-2 leading-tight">
                        Welcome, <span className="text-[#6fb342]">{user?.name?.split(' ')[0] || 'Farmer'}</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Precision Agricultural Intelligence</p>
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-[#6fb342] text-white px-10 py-5 rounded-[30px] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-green-200 hover:bg-[#2d5a27] transition-all duration-500"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    Register New Field
                </motion.button>
            </header>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {fields.map((field) => (
                        <FieldCard key={field._id} field={field} onDelete={handleDeleteField} />
                    ))}
                </AnimatePresence>

                {fields.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full border-4 border-dashed border-gray-200 rounded-[60px] p-20 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                            <Plus size={48} className="text-[#6fb342] opacity-50" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 mb-4">No Active Fields</h3>
                        <p className="text-gray-400 font-medium max-w-md mx-auto mb-10 text-lg">
                            Begin your digital farming journey by registering your first agricultural plot.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-[#6fb342] font-black uppercase tracking-widest text-sm hover:underline"
                        >
                            Get Started Now &rarr;
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#1a2e1d]/80 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[50px] w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Modal Left - Image/Design Side */}
                            <div className="hidden md:flex md:w-1/3 bg-[#6fb342] p-12 flex-col justify-between text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <Sprout size={64} className="mb-8" />
                                    <h2 className="text-4xl font-black leading-tight mb-4">Expand Your Horizon.</h2>
                                    <p className="text-green-100 font-medium opacity-80">Add coordinates to enable satellite monitoring and pest forecasting.</p>
                                </div>
                                <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Real-time GPS</span>
                                    </div>
                                    <p className="text-xs font-bold">Accuracy: ± 2.4m</p>
                                </div>
                                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Modal Right - Form Side */}
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition duration-300"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>

                                <div className="mb-10">
                                    <h2 className="text-2xl font-black text-[#1a2e1d]">Register New Field</h2>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Field Configuration Protocol</p>
                                </div>

                                <form onSubmit={handleAddField} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#6fb342]">Field Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-6 py-4 outline-none transition duration-300 font-bold text-gray-700"
                                                placeholder="e.g. Emerald Valley"
                                                value={newField.name}
                                                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#6fb342]">Location Area</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-6 py-4 outline-none transition duration-300 font-bold text-gray-700"
                                                placeholder="City or Region"
                                                value={newField.location}
                                                onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6fb342] flex justify-between">
                                            <span>Geospatial Alignment</span>
                                            <span className="text-gray-400 opacity-60">Search or Click Map</span>
                                        </label>

                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-6 py-4 outline-none transition duration-300 font-bold text-gray-700 text-sm pl-12"
                                                    placeholder="Search city, region, or landmark..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                                                />
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={handleSearchLocation}
                                                className="bg-[#1a2e1d] text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#6fb342] transition-colors duration-500 shadow-lg shadow-gray-200"
                                            >
                                                Locate
                                            </motion.button>
                                        </div>

                                        <div className="h-64 w-full rounded-[40px] overflow-hidden border-4 border-gray-50 shadow-2xl relative z-0">
                                            <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                                <MapRecenter center={mapCenter} />
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                                />
                                                <LocationMarker
                                                    position={newField.latitude && newField.longitude ? [newField.latitude, newField.longitude] : null}
                                                    setPosition={handleMapClick}
                                                />
                                            </MapContainer>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected: {newField.latitude ? `${parseFloat(newField.latitude).toFixed(3)}, ${parseFloat(newField.longitude).toFixed(3)}` : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6fb342]">Crop Inventory</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-6 py-4 outline-none transition duration-300 font-bold text-gray-700"
                                            placeholder="e.g. Maize, Soybean, Wheat (comma separated)"
                                            value={newField.crops}
                                            onChange={(e) => setNewField({ ...newField, crops: e.target.value })}
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1a2e1d] text-white py-6 rounded-[30px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-[#6fb342] transition-colors duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Authorize & Create Field'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default Dashboard;
