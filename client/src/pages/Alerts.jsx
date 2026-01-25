import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MapPin, Users, Bug, ShieldAlert, ArrowLeft, PlusCircle, AlertTriangle, X, Send, Navigation, Search, Loader2, Edit3, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import CustomSelect from '../components/CustomSelect';

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
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const Alerts = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [alertToEditId, setAlertToEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

    const [newAlert, setNewAlert] = useState({
        pestType: '',
        description: '',
        location: '',
        riskLevel: 'low',
        latitude: '',
        longitude: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/fields');
            setFields(res.data);
            if (res.data.length > 0) {
                handleFieldSelect(res.data[0]);
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error('Failed to fetch fields', e);
            setLoading(false);
        }
    };

    const handleFieldSelect = async (field) => {
        setSelectedField(field);
        setLoading(true);
        try {
            const queryParams = `?lat=${field.latitude}&lng=${field.longitude}`;
            const res = await axios.get(`http://localhost:5000/api/alerts${queryParams}`);
            setAlerts(res.data);
            setMapCenter([field.latitude, field.longitude]);

            if (!isEditing) {
                setNewAlert(prev => ({
                    ...prev,
                    location: field.location,
                    latitude: field.latitude,
                    longitude: field.longitude
                }));
            }
        } catch (e) {
            console.error('Fetch alerts error:', e);
        } finally {
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
                setNewAlert(prev => ({
                    ...prev,
                    latitude: newLat,
                    longitude: newLng,
                    location: display_name.split(',')[0]
                }));
            }
        } catch (e) {
            console.error('Search failed', e);
        }
    };

    const handleMapClick = (latlng) => {
        setMapCenter([latlng.lat, latlng.lng]);
        setNewAlert({
            ...newAlert,
            latitude: latlng.lat,
            longitude: latlng.lng
        });
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...newAlert,
                coordinates: {
                    type: 'Point',
                    coordinates: [parseFloat(newAlert.longitude), parseFloat(newAlert.latitude)]
                }
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/alerts/${alertToEditId}`, payload);
                alert('Report updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/alerts', payload);
                alert('Incident reported successfully to your community!');
            }

            if (selectedField) handleFieldSelect(selectedField);
            closeModal();
        } catch (err) {
            alert('Failed to process request: ' + (err.response?.data || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this alert?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/alerts/${id}`);
            if (selectedField) handleFieldSelect(selectedField);
        } catch (err) {
            alert("Delete failed: " + (err.response?.data || err.message));
        }
    };

    const openEditModal = (alert) => {
        setIsEditing(true);
        setAlertToEditId(alert._id);
        setNewAlert({
            pestType: alert.pestType,
            description: alert.description,
            location: alert.location,
            riskLevel: alert.riskLevel,
            latitude: alert.coordinates.coordinates[1],
            longitude: alert.coordinates.coordinates[0]
        });
        setMapCenter([alert.coordinates.coordinates[1], alert.coordinates.coordinates[0]]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setAlertToEditId(null);
        setNewAlert({
            pestType: '',
            description: '',
            location: selectedField?.location || '',
            riskLevel: 'low',
            latitude: selectedField?.latitude || '',
            longitude: selectedField?.longitude || ''
        });
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const getPestIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('bacteria')) return <ShieldAlert size={28} />;
        if (t.includes('fung') || t.includes('mildew')) return <AlertTriangle size={28} />;
        if (t.includes('pest') || t.includes('insect') || t.includes('aphid')) return <Bug size={28} />;
        return <Bell size={28} />;
    };

    return (
        <div className="min-h-screen bg-[#f8faf8] p-6 lg:p-10 font-[Montserrat]">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-[#2d5a27] font-bold hover:opacity-70 transition mb-4"
                        >
                            <ArrowLeft size={20} /> Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-[#2d5a27] flex items-center gap-4">
                            <div className="bg-[#6fb342]/10 p-3 rounded-2xl"><Bell className="text-[#6fb342]" size={32} /></div>
                            Community Alerts
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="text-gray-500 font-medium">Real-time outbreaks near you</p>
                            {selectedField && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-green-200">
                                    <Navigation size={10} className="fill-green-700" /> PROXIMITY MODE: 10km of {selectedField.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {fields.length > 0 && (
                            <CustomSelect
                                options={fields}
                                value={selectedField?._id}
                                onChange={handleFieldSelect}
                            />
                        )}

                        <button
                            onClick={() => { closeModal(); setIsModalOpen(true); }}
                            className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:bg-orange-600 transition h-fit w-full md:w-auto"
                        >
                            <PlusCircle size={22} /> Report
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 animate-pulse text-green-200">
                        <ShieldAlert size={64} className="mb-4" />
                        <h3 className="text-xl font-bold tracking-widest uppercase opacity-40">Scanning for Localized Threats...</h3>
                    </div>
                ) : alerts.length > 0 ? (
                    <div className="space-y-6">
                        {alerts.map((alert) => (
                            <div
                                key={alert._id}
                                className={`bg-white p-8 rounded-[40px] shadow-sm border-l-[12px] flex items-center gap-8 group hover:shadow-xl transition duration-500 ${alert.riskLevel === 'high' ? 'border-red-500 bg-red-50/10' :
                                    alert.riskLevel === 'medium' ? 'border-orange-400' : 'border-green-400'
                                    }`}
                            >
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner ${alert.riskLevel === 'high' ? 'bg-red-50 text-red-500' :
                                    alert.riskLevel === 'medium' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                                    }`}>
                                    {getPestIcon(alert.pestType)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-800 group-hover:text-green-800 transition">{alert.pestType}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm font-bold opacity-60">
                                                <span className="flex items-center gap-1 font-black text-green-600"><MapPin size={14} /> {alert.location}</span>
                                                {selectedField && (
                                                    <span className="text-orange-600">({calculateDistance(selectedField.latitude, selectedField.longitude, alert.coordinates.coordinates[1], alert.coordinates.coordinates[0])} km away)</span>
                                                )}
                                                <span>•</span>
                                                <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {user && alert.reportedBy === user._id && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <button onClick={() => openEditModal(alert)} className="p-2 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(alert._id)} className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${alert.riskLevel === 'high' ? 'bg-red-100 text-red-600 border-red-200' :
                                                alert.riskLevel === 'medium' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-green-100 text-green-600 border-green-200'
                                                }`}>
                                                {alert.riskLevel} Risk
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed font-medium">"{alert.description}"</p>

                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>)}
                                        </div>
                                        <span className="text-sm font-bold text-green-700/60 bg-green-50 px-3 py-1 rounded-lg flex items-center gap-2">
                                            <Users size={14} /> {alert.reportedBy === user?._id ? "Your Incident Report" : "Community Incident Report"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[50px] p-20 text-center shadow-sm border-2 border-dashed border-gray-100">
                        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShieldAlert size={64} className="text-green-200" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4">Localized Safe Zone</h2>
                        <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">No community outbreaks reported within 10km of <b>{selectedField?.name || 'your field'}</b>. Any reports you submit will appear here immediately.</p>
                    </div>
                )}
            </div>

            {/* Incident Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in p-4 overflow-y-auto">
                    <div className="bg-white p-8 md:p-10 rounded-[40px] w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition z-10"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-gray-800 mb-2">{isEditing ? 'Update Incident' : 'Report Incident'}</h2>
                            <p className="text-gray-500">{isEditing ? 'Modify your report details below.' : 'Tagging location for community awareness.'}</p>
                        </div>

                        <form onSubmit={handleReportSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pest / Disease Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl px-5 py-3 font-bold text-gray-700 outline-none"
                                        placeholder="e.g. Fall Armyworm"
                                        value={newAlert.pestType}
                                        onChange={(e) => setNewAlert({ ...newAlert, pestType: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Location Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl px-5 py-3 font-bold text-gray-700 outline-none"
                                        placeholder="e.g. North Fields"
                                        value={newAlert.location}
                                        onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Map Picker */}
                            {!isEditing && (
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                                        <span>Pin Incident Location</span>
                                        <span className="text-green-600 text-[10px] font-black uppercase">Click on map</span>
                                    </label>

                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-xl px-4 py-2 text-xs outline-none"
                                            placeholder="Search area..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSearchLocation}
                                            className="bg-green-800 text-white px-4 rounded-xl font-bold text-[10px] uppercase hover:bg-green-900 transition"
                                        >
                                            <Search size={14} />
                                        </button>
                                    </div>

                                    <div className="h-48 w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner relative z-0">
                                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                                            <MapRecenter center={mapCenter} />
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <LocationMarker
                                                position={newAlert.latitude && newAlert.longitude ? [newAlert.latitude, newAlert.longitude] : null}
                                                setPosition={handleMapClick}
                                            />
                                        </MapContainer>
                                    </div>
                                </div>
                            )}

                            {!isEditing && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Latitude</label>
                                        <input type="text" readOnly className="w-full bg-gray-100 border-none rounded-2xl px-5 py-2 text-xs font-mono text-gray-500" value={newAlert.latitude} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Longitude</label>
                                        <input type="text" readOnly className="w-full bg-gray-100 border-none rounded-2xl px-5 py-2 text-xs font-mono text-gray-500" value={newAlert.longitude} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Observations</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl px-5 py-3 font-medium text-gray-600 outline-none h-24 resize-none"
                                    placeholder="Describe the symptoms..."
                                    value={newAlert.description}
                                    onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Risk Severity</label>
                                <div className="flex gap-3">
                                    {['low', 'medium', 'high'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setNewAlert({ ...newAlert, riskLevel: level })}
                                            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border-2 transition ${newAlert.riskLevel === level
                                                ? level === 'high' ? 'bg-red-500 border-red-500 text-white' : level === 'medium' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-green-500 border-green-500 text-white'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white py-4 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition shadow-xl mt-2"
                            >
                                {isSubmitting ? <><Loader2 className="animate-spin" /> Processing...</> : <><Send size={18} /> {isEditing ? 'Confirm Changes' : 'Broadcast Locally'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alerts;
