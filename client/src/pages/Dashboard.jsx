import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, X, Sprout, Loader2 } from 'lucide-react';
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

const Dashboard = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [newField, setNewField] = useState({
        name: '',
        location: '',
        crops: '',
        latitude: '',
        longitude: ''
    });

    // Map state
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)

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
        }
    };

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;
        try {
            // Using OpenStreetMap Nominatim API for geocoding
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
                // Also auto-fill the location name if empty
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
                latitude: parseFloat(newField.latitude) || 12.9716,
                longitude: parseFloat(newField.longitude) || 77.5946
            };

            const res = await axios.post('http://localhost:5000/api/fields', payload);
            setFields([...fields, res.data]);
            setIsModalOpen(false);
            setNewField({ name: '', location: '', crops: '', latitude: '', longitude: '' });
        } catch (err) {
            alert('Failed to add field: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update lat/long inputs when map is clicked
    // Update lat/long inputs when map is clicked
    const handleMapClick = (latlng) => {
        setMapCenter([latlng.lat, latlng.lng]);
        setNewField({
            ...newField,
            latitude: latlng.lat.toFixed(6),
            longitude: latlng.lng.toFixed(6)
        });
    };

    return (
        <div className="p-10 font-[Montserrat] relative">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#2d5a27]">Welcome back, {user?.name || 'Farmer'}</h2>
                    <p className="text-gray-500 font-medium tracking-tight">Monitor your fields and protect your crops.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#6fb342] text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-xl shadow-green-200 hover:bg-green-600 transition"
                >
                    <Plus size={20} /> Add Field
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map(field => (
                    <div key={field._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition duration-500 group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-gray-800 group-hover:text-[#6fb342] transition">{field.name}</h3>
                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-[#6fb342] group-hover:text-white transition">
                                <MapPin size={20} />
                            </div>
                        </div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Location</p>
                        <p className="text-gray-600 font-medium mb-8 italic">"{field.location}"</p>
                        <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                            {field.crops.map(crop => (
                                <span key={crop} className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border border-green-100">
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {fields.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 bg-white rounded-[50px] border-4 border-dashed border-gray-50 flex flex-col items-center">
                        <Plus className="mx-auto text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-400">No Fields Identified</h3>
                        <p className="text-gray-300 mt-2 font-medium">Add your first agricultural plot to start monitoring</p>
                    </div>
                )}
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4 overflow-y-auto">
                    <div className="bg-white p-8 rounded-[40px] w-full max-w-2xl shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition z-10"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-[#6fb342]">
                            <Sprout size={32} />
                            <h2 className="text-2xl font-black text-[#2d5a27]">Register New Field</h2>
                        </div>

                        <form onSubmit={handleAddField} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Field Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 outline-none transition font-medium"
                                        placeholder="e.g. North Wheat Plot"
                                        value={newField.name}
                                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Location Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 outline-none transition font-medium"
                                        placeholder="City or District"
                                        value={newField.location}
                                        onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Map Integration */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                                    <span>Pin Point Location</span>
                                    <span className="text-green-600 cursor-pointer hover:underline">Click on map to auto-fill</span>
                                </label>
                                {/* Search Bar */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-xl px-4 py-2 text-sm outline-none"
                                        placeholder="Search city, region (e.g. Paris)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchLocation}
                                        className="bg-[#2d5a27] text-white px-4 rounded-xl font-bold text-xs uppercase hover:bg-green-800 transition"
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner relative z-0">
                                    <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                                        <MapRecenter center={mapCenter} />
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker
                                            position={newField.latitude && newField.longitude ? [newField.latitude, newField.longitude] : null}
                                            setPosition={handleMapClick}
                                        />
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 outline-none transition font-medium"
                                        placeholder="12.97"
                                        value={newField.latitude}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 outline-none transition font-medium"
                                        placeholder="77.59"
                                        value={newField.longitude}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Crops Produced</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 outline-none transition font-medium"
                                    placeholder="Tomato, Potato, Wheat..."
                                    value={newField.crops}
                                    onChange={(e) => setNewField({ ...newField, crops: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#1a2e1d] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-[#6fb342] transition flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? <><Loader2 className="animate-spin" /> Saving...</> : 'Create Field'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
