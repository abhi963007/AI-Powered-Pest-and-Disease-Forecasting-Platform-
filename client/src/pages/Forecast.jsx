import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, MapPin, ChevronDown, ChevronUp, ArrowLeft, HeartPulse, ShieldAlert } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

const Forecast = () => {
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [weather, setWeather] = useState(null);
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTips, setExpandedTips] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fields');
            setFields(res.data);

            const fieldIdFromState = location.state?.fieldId;
            const fieldToSelect = fieldIdFromState
                ? res.data.find(f => f._id === fieldIdFromState)
                : res.data[0];

            if (fieldToSelect) {
                handleFieldSelect(fieldToSelect);
            } else if (res.data.length > 0) {
                handleFieldSelect(res.data[0]);
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleFieldSelect = async (field) => {
        setSelectedField(field);
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/weather/${field._id}/forecast`);
            setWeather(res.data.weather);
            setRisks(res.data.risks);
        } catch (e) {
            console.warn("Backend weather endpoint failed, using demo mode");
            const demoWeather = {
                temperature: "--", humidity: "--", condition: "No Data",
                wind_speed: "--", rain_chance: "--", location: field.location || "Your Farm",
                isDemo: true
            };
            setWeather(demoWeather);
            setRisks([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleTips = (idx) => {
        setExpandedTips(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="min-h-screen bg-[#f8faf8] p-6 lg:p-10 font-[Montserrat]">
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-[#2d5a27] font-bold hover:opacity-70 transition text-lg"
                >
                    <ArrowLeft size={24} /> Dashboard
                </button>

                {fields.length > 0 && (
                    <CustomSelect
                        options={fields}
                        value={selectedField?._id}
                        onChange={handleFieldSelect}
                    />
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <CloudSun size={64} className="text-green-300 animate-bounce mb-4" />
                    <h2 className="text-2xl font-bold text-green-900/40 tracking-widest uppercase">Analyzing Atmosphere...</h2>
                </div>
            ) : weather ? (
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Weather Section */}
                    {weather.isDemo ? (
                        <div className="bg-white border-4 border-dashed border-blue-100 rounded-[50px] p-12 text-center flex flex-col items-center justify-center group hover:border-blue-300 transition-all duration-500">
                            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[35px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all">
                                <ShieldAlert size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 mb-4">Weather API Connection Required</h2>
                            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                                Our diagnostic engines require a live connection to <span className="text-blue-600 font-bold">OpenWeather</span>. Please add your API key to the <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">.env</code> file to enable local forecasting.
                            </p>
                            <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" className="bg-[#1a2e1d] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all">
                                Get a Free API Key
                            </a>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#4facfe] to-[#00f2fe] rounded-[50px] p-10 text-white shadow-2xl shadow-blue-500/20">
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="flex items-center gap-8">
                                    <div className="p-8 bg-white/20 rounded-[40px] backdrop-blur-xl border border-white/30">
                                        <CloudSun size={80} />
                                    </div>
                                    <div>
                                        <div className="text-7xl font-black">{weather.temperature}°C</div>
                                        <div className="text-2xl font-bold opacity-90">{weather.condition}</div>
                                        <div className="mt-2 flex items-center gap-2 font-medium opacity-80">
                                            <MapPin size={18} /> {weather.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/10 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center">
                                        <Droplets className="mb-2" />
                                        <span className="text-2xl font-black">{weather.humidity}%</span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Humidity</span>
                                    </div>
                                    <div className="bg-black/10 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center">
                                        <Wind className="mb-2" />
                                        <span className="text-2xl font-black">{weather.wind_speed} <small className="text-sm">m/s</small></span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Wind</span>
                                    </div>
                                    <div className="bg-black/10 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center">
                                        <CloudRain className="mb-2" />
                                        <span className="text-2xl font-black">{weather.rain_chance}%</span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Rain</span>
                                    </div>
                                    <div className="bg-black/10 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center text-center">
                                        <HeartPulse className="mb-2" />
                                        <span className="text-lg font-black leading-tight">GOOD</span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Air Health</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Forecast Section */}
                    {risks.length > 0 && !weather.isDemo && (
                        <div className="bg-white rounded-[50px] p-10 shadow-xl shadow-green-900/5">
                            <header className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                    <HeartPulse size={30} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#2d5a27]">AI Disease Forecast</h3>
                                    <p className="text-gray-500 font-medium">Predictive analysis based on biological threshold models</p>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {risks.map((risk, idx) => (
                                    <div key={idx} className="bg-[#fcfdfc] border border-green-100 p-8 rounded-[40px] hover:shadow-lg transition duration-500">
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-xl font-black text-[#2d5a27]">{risk.name}</h4>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${risk.risk_level === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                                risk.risk_level === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {risk.risk_level} Risk
                                            </span>
                                        </div>

                                        <p className="text-gray-600 font-medium leading-relaxed mb-6 italic">"{risk.reason}"</p>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {risk.crops.map(crop => (
                                                <span key={crop} className="bg-white px-3 py-1 rounded-xl text-xs font-bold text-gray-500 border border-gray-100">
                                                    #{crop}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${risk.risk_level === 'high' ? 'bg-red-500' :
                                                    risk.risk_level === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${risk.risk_score}%` }}
                                            ></div>
                                        </div>

                                        <button
                                            onClick={() => toggleTips(idx)}
                                            className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-green-50 transition flex items-center justify-center gap-2 group"
                                        >
                                            Prevention Protocol {expandedTips[idx] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>

                                        {expandedTips[idx] && (
                                            <ul className="mt-6 space-y-3 px-2 animate-in slide-in-from-top-2 duration-300">
                                                {risk.prevention.map((tip, tIdx) => (
                                                    <li key={tIdx} className="flex gap-3 text-gray-600 font-medium">
                                                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-40">
                    <MapPin size={64} className="text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400">Add a field to see forecasts</h3>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 bg-[#6fb342] text-white px-8 py-3 rounded-full font-bold shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Forecast;
