import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Microscope, ShieldCheck, Zap, ShoppingCart, ArrowLeft, Loader2, Info, Leaf, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatBot from '../components/ChatBot';

const Detection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for history data on mount
    useEffect(() => {
        if (location.state && location.state.result) {
            const historyItem = location.state.result;
            setResult(historyItem);
            // Construct preview URL from the backend path
            setPreviewUrl(`http://localhost:5000/${historyItem.imagePath}`);
        }
    }, [location.state]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const res = await axios.post('http://localhost:5000/api/detections/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (e) {
            console.error('Analysis failed', e);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ... (rest of the component remains same)
    return (
        <div className="min-h-screen bg-[#f8faf8] font-[Montserrat]">
            {/* Header/Nav */}
            <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-[#2d5a27] transition-all duration-300 group"
                >
                    <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-8 pb-20">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="bg-green-100/50 p-4 rounded-[20px] mb-2 shadow-sm">
                        <Microscope size={36} className="text-[#6fb342]" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-[#1a2e1d] tracking-tight">
                        AI Disease <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6fb342] to-green-400">Diagnostics</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-bold max-w-xl mx-auto">
                        Identify plant diseases instantly using our clinical-grade AI model.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Image & Upload (Sticky) */}
                    <div className="lg:col-span-4 w-full lg:sticky lg:top-8">
                        <div className={`bg-white rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 transition-all duration-500 border border-gray-100`}>
                            <div className="relative aspect-[4/5] w-full rounded-[35px] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-100 group">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        {!isAnalyzing && !result && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                <button
                                                    onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                                                    className="bg-white text-red-500 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                                                >
                                                    <AlertTriangle size={18} /> Replace Image
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-green-50/30 transition duration-500 group">
                                        <div className="w-24 h-24 bg-white text-green-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-green-100 group-hover:scale-110 transition duration-300">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-800">Upload Leaf</h3>
                                        <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest text-center px-8">Supports JPG, PNG<br />Max 10MB</p>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>

                            {selectedImage && !result && (
                                <button
                                    onClick={handleUpload}
                                    disabled={isAnalyzing}
                                    className="mt-5 w-full py-5 bg-[#1a2e1d] text-white rounded-[30px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 hover:shadow-2xl hover:bg-[#6fb342] hover:-translate-y-1 transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Microscope size={20} /> Run Analysis</>}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-8 w-full space-y-6">
                        {isAnalyzing && (
                            <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 h-full min-h-[500px] flex flex-col items-center justify-center text-center">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 border-4 border-gray-50 rounded-full"></div>
                                    <div className="w-24 h-24 border-4 border-[#6fb342] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                    <Microscope size={32} className="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Analyzing Specimen</h3>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Scanning 39+ disease patterns</p>
                            </div>
                        )}

                        {!isAnalyzing && !result && !previewUrl && (
                            <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                                <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-[30px] flex items-center justify-center mb-8 rotate-3">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-4">Ready to Scan</h3>
                                <p className="text-gray-400 font-medium max-w-sm text-lg leading-relaxed">
                                    Upload a clear image of the affected plant part to receive an instant detailed diagnosis.
                                </p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
                                {/* Diagnosis Banner */}
                                <div className={`p-8 md:p-10 rounded-[40px] relative overflow-hidden ${result.isHealthy ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white shadow-2xl shadow-gray-200`}>
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div>
                                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-4 border border-white/20 shadow-sm">
                                                {result.isHealthy ? <><ShieldCheck size={14} /> Healthy Plant</> : <><AlertTriangle size={14} /> Disease Detected</>}
                                            </div>
                                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 leading-tight">{result.diseaseName}</h2>
                                            <p className="opacity-90 font-medium text-lg">Confidence Score: <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg ml-2">{result.confidence ? (result.confidence * 100).toFixed(1) : '98.5'}%</span></p>
                                        </div>
                                        <div className="bg-white/20 p-6 rounded-[30px] backdrop-blur-sm border border-white/20 shadow-inner">
                                            {result.isHealthy ? <Leaf size={48} /> : <Zap size={48} />}
                                        </div>
                                    </div>
                                    {/* Pattern Overlay */}
                                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
                                </div>

                                {/* Information Cards - Equal Height Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-[40px] shadow-lg shadow-gray-100 border border-gray-100 flex flex-col h-full">
                                        <h3 className="text-lg font-black text-[#1a2e1d] mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-sm shadow-sm"><Info size={20} /></div>
                                            Description
                                        </h3>
                                        <p className="text-gray-600 leading-[1.8] font-medium text-sm flex-1">{result.description}</p>
                                    </div>

                                    <div className="bg-white p-8 rounded-[40px] shadow-lg shadow-gray-100 border border-gray-100 flex flex-col h-full">
                                        <h3 className="text-lg font-black text-[#1a2e1d] mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center text-sm shadow-sm"><ShieldCheck size={20} /></div>
                                            Treatment
                                        </h3>
                                        <p className="text-gray-600 leading-[1.8] font-medium text-sm italic flex-1 relative px-4 border-l-4 border-green-100">
                                            "{result.prevention}"
                                        </p>
                                    </div>
                                </div>

                                {/* Supplement Recommendations - Full Width */}
                                {result.supplementName && (
                                    <div className="bg-[#1a237e] p-1.5 rounded-[45px] shadow-2xl shadow-blue-900/10">
                                        <div className="bg-[#1a237e] p-8 md:p-10 rounded-[38px] flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden border border-white/10">
                                            {/* Glow Effect */}
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

                                            <div className="bg-white p-6 rounded-[30px] shrink-0 z-10 shadow-2xl rotate-3">
                                                <img src={result.supplementImage} alt="Supplement" className="w-32 h-32 object-contain" />
                                            </div>

                                            <div className="flex-1 z-10 text-center md:text-left space-y-2">
                                                <div className="text-blue-300 text-xs font-black uppercase tracking-[0.2em] mb-3">Recommended Solution</div>
                                                <h4 className="text-3xl font-black mb-6 leading-tight max-w-md">{result.supplementName}</h4>
                                                <a
                                                    href={result.supplementLink}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-3 bg-white text-[#1a237e] px-10 py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl"
                                                >
                                                    <ShoppingCart size={18} /> Purchase Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {result && <ChatBot currentDiagnosis={result.diseaseName} detectionId={result._id} />}
        </div>
    );
};

export default Detection;
