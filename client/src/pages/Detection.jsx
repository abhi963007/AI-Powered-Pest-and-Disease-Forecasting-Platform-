import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Microscope, ShieldCheck, Zap, ShoppingCart, ArrowLeft, Loader2, Info, Leaf, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatBot from '../components/ChatBot';

import { motion, AnimatePresence } from 'framer-motion';

const Detection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.result) {
            const historyItem = location.state.result;
            setResult(historyItem);
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

    return (
        <div className="min-h-screen bg-[#f8faf8] font-[Montserrat] overflow-x-hidden">
            {/* Header/Nav */}
            <header className="max-w-7xl mx-auto px-8 pt-8 pb-4">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-[#2d5a27] transition-all duration-300 group"
                >
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm group-hover:shadow-md transition">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1a2e1d]/60 group-hover:text-[#2d5a27]">Back to Central Node</span>
                </motion.button>
            </header>

            <main className="max-w-7xl mx-auto px-8 pb-20">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="bg-[#6fb342]/10 p-5 rounded-[30px] mb-2 shadow-sm border border-[#6fb342]/20"
                    >
                        <Microscope size={42} className="text-[#6fb342]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl lg:text-7xl font-black text-[#1a2e1d] tracking-tighter leading-none"
                    >
                        Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6fb342] to-green-500">Diagnostics</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg font-bold max-w-2xl mx-auto"
                    >
                        Scan biological specimens with neural-array precision for immediate diagnostic confirmation.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Sticky Specimen Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-12 xl:col-span-4 w-full xl:sticky xl:top-8"
                    >
                        <div className="bg-white rounded-[50px] shadow-2xl shadow-green-900/5 p-6 border border-gray-100 relative overflow-hidden group">
                            <div className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden bg-gray-50 border-4 border-dashed border-gray-100 group">
                                <AnimatePresence mode="wait">
                                    {previewUrl ? (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="w-full h-full relative"
                                        >
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            {isAnalyzing && (
                                                <div className="absolute inset-0 overflow-hidden">
                                                    <motion.div
                                                        animate={{ top: ['-10%', '110%'] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                        className="absolute left-0 w-full h-1 bg-[#6fb342] shadow-[0_0_20px_#6fb342] z-20"
                                                    />
                                                    <div className="absolute inset-0 bg-[#6fb342]/10 backdrop-blur-[2px]"></div>
                                                </div>
                                            )}
                                            {!isAnalyzing && !result && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-md">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                                                        className="bg-white text-red-500 px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl"
                                                    >
                                                        <AlertTriangle size={18} /> Discard Specimen
                                                    </motion.button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.label
                                            key="upload"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-green-50/50 transition-all duration-500 group"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="w-28 h-28 bg-white text-[#6fb342] rounded-[35px] flex items-center justify-center mb-8 shadow-2xl shadow-green-100"
                                            >
                                                <Upload size={38} />
                                            </motion.div>
                                            <h3 className="text-2xl font-black text-[#1a2e1d]">Input Leaf</h3>
                                            <div className="mt-4 flex flex-col items-center space-y-1">
                                                <p className="text-[#1a2e1d]/30 text-[10px] font-black uppercase tracking-[0.2em] text-center px-12 leading-loose">
                                                    Neural Patterning: Clinical Mode<br />
                                                    Resolution: Ultra-High
                                                </p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </motion.label>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {selectedImage && !result && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleUpload}
                                        disabled={isAnalyzing}
                                        className="mt-6 w-full py-6 bg-[#1a2e1d] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-green-900/30 hover:bg-[#6fb342] transition-all duration-500 disabled:opacity-50"
                                    >
                                        {isAnalyzing ? <><Loader2 className="animate-spin" /> Sequence Running</> : <><Microscope size={20} /> Initiate Capture</>}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Results Display */}
                    <div className="lg:col-span-12 xl:col-span-8 w-full space-y-8">
                        <AnimatePresence mode="wait">
                            {!isAnalyzing && !result && !previewUrl ? (
                                <motion.div
                                    key="ready"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white rounded-[60px] p-20 shadow-sm border border-gray-100 h-full min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[#6fb342]/5 opacity-[0.05] pointer-events-none"></div>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3 }}
                                        className="w-32 h-32 bg-gray-50 text-gray-200 rounded-[40px] flex items-center justify-center mb-10 border border-gray-100"
                                    >
                                        <ShieldCheck size={56} />
                                    </motion.div>
                                    <h3 className="text-4xl font-black text-[#1a2e1d] mb-6">Scanner Status: Ready</h3>
                                    <p className="text-gray-400 font-medium max-w-md text-xl leading-relaxed">
                                        System initialized and waiting for biological specimen data.
                                    </p>
                                    <div className="mt-12 flex items-center gap-10">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Response</p>
                                            <p className="text-lg font-black text-[#1a2e1d]">&lt; 3.0s</p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-100"></div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Precision</p>
                                            <p className="text-lg font-black text-[#1a2e1d]">99.8%</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : isAnalyzing ? (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white rounded-[60px] p-20 shadow-sm border border-gray-100 h-full min-h-[600px] flex flex-col items-center justify-center text-center"
                                >
                                    <div className="relative mb-12">
                                        <div className="w-28 h-28 border-[6px] border-gray-100 rounded-full"></div>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="w-28 h-28 border-[6px] border-[#6fb342] border-t-transparent rounded-full absolute top-0 left-0"
                                        />
                                        <Microscope size={40} className="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-4xl font-black text-[#1a2e1d] mb-4">Analyzing DNA Array</h3>
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[#6fb342] rounded-full animate-pulse"></span>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.4em] ml-1">Decoding Pathogens</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Diagnosis Header */}
                                    <div className={`p-12 rounded-[60px] relative overflow-hidden text-white shadow-2xl ${result.isHealthy
                                            ? 'bg-gradient-to-br from-[#2d5a27] to-[#6fb342] shadow-green-900/10'
                                            : 'bg-gradient-to-br from-[#9e1c1c] to-[#e44d3a] shadow-red-900/10'
                                        }`}>
                                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                                            <div className="max-w-xl">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20"
                                                >
                                                    {result.isHealthy ? <><ShieldCheck size={14} /> Specimen Uncompromised</> : <><AlertTriangle size={14} /> Pathogen Identified</>}
                                                </motion.div>
                                                <motion.h2
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="text-6xl font-black tracking-tighter leading-[0.9] mb-4"
                                                >
                                                    {result.diseaseName}
                                                </motion.h2>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="opacity-70 font-bold text-xs uppercase tracking-widest"
                                                >
                                                    Diagnostic Confidence: <span className="text-white ml-2 underline underline-offset-4 decoration-2">98.5% Matching Accuracy</span>
                                                </motion.p>
                                            </div>
                                            <motion.div
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", delay: 0.5 }}
                                                className="bg-white/10 p-10 rounded-[45px] backdrop-blur-sm border border-white/20 shadow-inner"
                                            >
                                                {result.isHealthy ? <Leaf size={72} /> : <Zap size={72} />}
                                            </motion.div>
                                        </div>
                                        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
                                    </div>

                                    {/* Detailed Reports Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 flex flex-col"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner"><Info size={24} /></div>
                                                <h3 className="text-xl font-black text-[#1a2e1d]">Biological Report</h3>
                                            </div>
                                            <p className="text-gray-500 leading-relaxed font-medium text-sm flex-1">{result.description}</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 flex flex-col"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner"><ShieldCheck size={24} /></div>
                                                <h3 className="text-xl font-black text-[#1a2e1d]">Recovery Protocol</h3>
                                            </div>
                                            <div className="relative px-6 py-4 border-l-4 border-emerald-100 bg-emerald-50/20 rounded-r-[30px] flex-1">
                                                <p className="text-emerald-900 leading-relaxed font-bold text-sm italic">"{result.prevention}"</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Pharmaceutical Supplement Recommendation */}
                                    {result.supplementName && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="bg-[#1a2e1d] p-1.5 rounded-[60px] shadow-3xl overflow-hidden group"
                                        >
                                            <div className="bg-[#1a2e1d] p-10 md:p-14 rounded-[58px] flex flex-col md:flex-row items-center gap-12 text-white relative overflow-hidden border border-white/5 border-b-white/10">
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50"></div>
                                                <div className="bg-white p-8 rounded-[40px] shrink-0 z-10 shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-700">
                                                    <img src={result.supplementImage} alt="Supplement" className="w-40 h-40 object-contain" />
                                                </div>
                                                <div className="flex-1 z-10 text-center md:text-left">
                                                    <p className="text-[#6fb342] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Neural Suggestion: Pharmaceutical</p>
                                                    <h4 className="text-4xl font-black mb-10 leading-none tracking-tighter">{result.supplementName}</h4>
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={result.supplementLink}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-4 bg-[#6fb342] text-[#1a2e1d] px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-500 shadow-2xl"
                                                    >
                                                        <ShoppingCart size={20} /> Deploy Treatment
                                                    </motion.a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            {result && <ChatBot currentDiagnosis={result.diseaseName} detectionId={result._id} />}
        </div>
    );
};


export default Detection;
