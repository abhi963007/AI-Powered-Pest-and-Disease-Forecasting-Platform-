import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Leaf, ShieldAlert } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-[Montserrat]">
            <div className="flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-40 relative overflow-hidden">
                <div className="absolute top-20 left-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 max-w-sm w-full mx-auto">
                    <Link to="/" className="flex items-center gap-3 mb-10 group">
                        <div className="bg-[#6fb342] text-white p-2 rounded-xl group-hover:scale-110 transition">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-black text-[#2d5a27] tracking-tighter">AGRO SCAN</span>
                    </Link>

                    <h1 className="text-4xl font-black text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-400 font-medium mb-10">Access your agricultural intelligence network.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition"
                                    placeholder="name@farm.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1a237e] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/20 hover:-translate-y-1 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Authenticate Account'}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-400 font-bold text-sm">
                        New to the platform? <Link to="/signup" className="text-[#6fb342] hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-[#1a237e] p-20 items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="grid grid-cols-6 gap-2 rotate-12 -translate-y-20">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-white rounded-xl"></div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-md text-white">
                    <div className="bg-white/10 p-6 rounded-[40px] backdrop-blur-xl border border-white/10 mb-10 inline-block">
                        <ShieldAlert size={48} className="text-blue-400" />
                    </div>
                    <h2 className="text-5xl font-black leading-tight mb-8 tracking-tighter">Your crops, <br />protected by <span className="text-blue-400">Deep Learning.</span></h2>
                    <p className="text-blue-100/60 text-lg leading-relaxed font-medium">Join 5,000+ farmers across 12 countries who trust AgroScan for instant disease diagnostics and micro-region forecasting.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
