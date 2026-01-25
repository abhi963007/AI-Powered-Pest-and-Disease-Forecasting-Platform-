import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, Leaf, ChevronRight } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsError(false);
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage('A password reset code has been sent to your email.');
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.error || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-[Montserrat]">
            <div className="flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-40 relative overflow-hidden">
                <div className="absolute top-20 left-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 max-w-sm w-full mx-auto">
                    <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-10 font-bold transition">
                        <ArrowLeft size={18} /> Back to Login
                    </Link>

                    <div className="flex items-center gap-3 mb-10 group">
                        <div className="bg-[#6fb342] text-white p-2 rounded-xl">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-black text-[#2d5a27] tracking-tighter">AGRO SCAN</span>
                    </div>

                    <h1 className="text-4xl font-black text-gray-800 mb-2">Forgot Password?</h1>
                    <p className="text-gray-400 font-medium mb-10">Enter your email and we'll send you a code to reset your password.</p>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${isError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {message}
                        </div>
                    )}

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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#6fb342] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-green-900/20 hover:-translate-y-1 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : 'Send Reset Code'}
                            {!isLoading && <ChevronRight size={18} />}
                        </button>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-[#1a237e] p-20 items-center justify-center">
                <div className="max-w-md text-white text-center">
                    <div className="mb-10 flex justify-center">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                            <Mail size={40} className="text-blue-300" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black mb-6">Need help?</h2>
                    <p className="text-blue-100/60 text-lg font-medium">No worries, it happens to the best of us. We'll get you back into your account in no time.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
