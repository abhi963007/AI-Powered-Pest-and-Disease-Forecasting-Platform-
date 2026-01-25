import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ShieldCheck, RefreshCw, Leaf } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-500 mb-4">No email provided for verification.</p>
                <Link to="/signup" className="text-[#6fb342] font-bold">Back to Signup</Link>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            alert('Verification successful!');
            window.location.href = '/dashboard';
        } catch (err) {
            setMessage(err.response?.data?.error || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
            alert('OTP has been resent to your email.');
        } catch (err) {
            alert('Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-[Montserrat]">
            <div className="flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-40 relative overflow-hidden">
                <div className="absolute top-20 left-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 max-w-sm w-full mx-auto">
                    <div className="flex items-center gap-3 mb-10 group">
                        <div className="bg-[#6fb342] text-white p-2 rounded-xl">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-black text-[#2d5a27] tracking-tighter">AGRO SCAN</span>
                    </div>

                    <h1 className="text-4xl font-black text-gray-800 mb-2">Verify Email</h1>
                    <p className="text-gray-400 font-medium mb-10">We've sent a 6-digit code to <span className="text-gray-800 font-bold">{email}</span></p>

                    {message && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-sm font-bold border border-red-100">{message}</div>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">Verification Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    maxLength="6"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition text-2xl tracking-[0.5em] font-black"
                                    placeholder="000000"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1a237e] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/20 hover:-translate-y-1 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            {!isLoading && <ShieldCheck size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 flex flex-col items-center gap-4">
                        <p className="text-gray-400 font-bold text-sm text-center">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            className="flex items-center gap-2 text-[#6fb342] font-black text-sm uppercase tracking-widest hover:underline"
                        >
                            <RefreshCw size={16} /> Resend OTP
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-green-50 p-20 items-center justify-center relative overflow-hidden">
                <div className="relative z-10 max-w-md">
                    <div className="bg-white p-12 rounded-[60px] shadow-2xl">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-8">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4">Security First.</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">Verification ensures that only you can access your farm data and agricultural forecasts. It takes just a second.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
