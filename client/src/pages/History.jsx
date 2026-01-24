import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Search, ArrowLeft, Trash2, Calendar, ShieldCheck, Zap, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DetectionHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/detections/history');
            setHistory(res.data);
        } catch (e) {
            console.error('Failed to fetch history', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this record?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/detections/history/${id}`);
            setHistory(history.filter(h => h._id !== id));
        } catch (e) {
            console.error('Delete failed', e);
        }
    };

    const filteredHistory = history.filter(item =>
        item.diseaseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8faf8] p-6 lg:p-10 font-[Montserrat]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-[#2d5a27] font-bold hover:opacity-70 transition mb-4"
                        >
                            <ArrowLeft size={20} /> Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-[#2d5a27] flex items-center gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500"><History size={32} /></div>
                            Health History
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Timeline of all AI-powered plant diagnostics</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6fb342] transition" />
                        <input
                            type="text"
                            placeholder="Search by diagnosis..."
                            className="bg-white border-2 border-transparent focus:border-[#6fb342] rounded-[20px] pl-14 pr-8 py-4 w-full md:w-[350px] shadow-sm outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[400px] bg-gray-100 rounded-[40px]"></div>)}
                    </div>
                ) : filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHistory.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500 border border-gray-100 group"
                            >
                                <div className="relative h-56">
                                    <img
                                        src={`http://localhost:5000/${item.imagePath}`}
                                        alt={item.diseaseName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${item.isHealthy ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                        {item.isHealthy ? 'Healthy' : 'Diseased'}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-3 text-gray-300 mb-4 font-bold text-xs uppercase tracking-tighter">
                                        <Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-800 mb-2 truncate group-hover:text-[#2d5a27] transition">{item.diseaseName}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">"{item.description}"</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <button
                                            className="flex items-center gap-2 text-[#6fb342] font-black uppercase text-xs tracking-widest hover:opacity-70"
                                            onClick={() => navigate(`/detect`, { state: { result: item } })}
                                        >
                                            View Data <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[50px] p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-32 h-32 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-8">
                            <Activity size={64} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4">No History Records</h2>
                        <p className="text-gray-500 max-w-md mx-auto text-lg">You haven't performed any diagnostics yet. Run your first detection to build a health timeline for your crops.</p>
                        <button
                            onClick={() => navigate('/detect')}
                            className="mt-10 bg-[#6fb342] text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-200 hover:bg-green-600 transition"
                        >
                            Detect First Disease
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetectionHistory;
