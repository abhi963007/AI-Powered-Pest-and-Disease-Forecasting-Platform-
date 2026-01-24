import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, ShieldCheck, Bell, CloudSun, Leaf, ArrowRight, Github, Zap } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white font-[Montserrat] overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#6fb342] text-white p-2 rounded-xl">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-black text-[#2d5a27] tracking-tighter">AGRO SCAN</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                            <a href="#features" className="hover:text-[#6fb342] transition">Features</a>
                            <a href="#about" className="hover:text-[#6fb342] transition">Intelligence</a>
                            <a href="#community" className="hover:text-[#6fb342] transition">Community</a>
                        </div>
                        <Link to="/dashboard" className="bg-[#1a237e] text-white px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition shadow-lg shadow-blue-900/20">
                            Launch App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-green-50/50 to-white relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-green-100/50 text-[#2d5a27] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <Zap size={14} className="fill-current" /> Next Gen Crop Protection
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#2d5a27] leading-[0.9] tracking-tighter mb-8">
                            Identify <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6fb342] to-blue-500">Diseases</span> Instantly.
                        </h1>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg mb-12">
                            The world's first AI-powered health monitoring platform for micro-regions. Secure your harvest with clinical-grade AI diagnostics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/detect" className="bg-[#6fb342] text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-green-400/40 hover:-translate-y-1 transition">
                                Start Analysis <ArrowRight size={20} />
                            </Link>
                            <Link to="/forecast" className="bg-white text-gray-800 border-2 border-gray-100 px-10 py-5 rounded-[20px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                View Forecast
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                        <div className="relative z-10 bg-white p-4 rounded-[50px] shadow-2xl rotate-3 scale-110 border border-gray-50">
                            <img
                                src="/images/hero-plant.jpg"
                                className="rounded-[40px] w-full"
                                alt="AgroScan Analysis"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Microscope size={32} />,
                                title: "AI Analysis",
                                desc: "39+ diseases detected instantly with PyTorch neural networks.",
                                color: "bg-blue-50 text-blue-500"
                            },
                            {
                                icon: <CloudSun size={32} />,
                                title: "Geo Forecast",
                                desc: "Micro-region weather alerts linked directly to farm health risks.",
                                color: "bg-green-50 text-green-500"
                            },
                            {
                                icon: <Bell size={32} />,
                                title: "Smart Alerts",
                                desc: "Automatic community notification when outbreaks are identified.",
                                color: "bg-orange-50 text-orange-500"
                            },
                            {
                                icon: <ShieldCheck size={32} />,
                                title: "Trust Network",
                                desc: "Verify health across regions and build a safer harvest community.",
                                color: "bg-purple-50 text-purple-500"
                            }
                        ].map((f, i) => (
                            <div key={i} className="p-10 rounded-[40px] border border-gray-100 hover:border-green-200 hover:shadow-xl transition duration-500 group">
                                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-800 mb-4">{f.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 pt-20 pb-10 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                        <Leaf size={24} />
                        <span className="text-xl font-black tracking-tighter">AGRO SCAN</span>
                    </div>
                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
                        <a href="https://github.com" target="_blank" className="hover:text-gray-900 transition flex items-center gap-2"><Github size={16} /> Source</a>
                        <a href="#" className="hover:text-gray-900 transition">Contact</a>
                        <a href="#" className="hover:text-gray-900 transition">Privacy</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    &copy; 2026 AGRO SCAN INTELLIGENCE. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
