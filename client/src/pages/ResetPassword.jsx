import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, Lock, ArrowLeft, Leaf, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-500 mb-4">No email session found.</p>
                <Link to="/forgot-password" size={18} className="text-[#6fb342] font-bold">Back to Forgot Password</Link>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
            setMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setIsLoading(false);
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

                    <h1 className="text-4xl font-black text-gray-800 mb-2">Set New Password</h1>
                    <p className="text-gray-400 font-medium mb-10">We've sent a code to {email}. Enter it below along with your new password.</p>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${isError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">Reset Code (OTP)</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition font-black tracking-widest"
                                    placeholder="000000"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-[#2d5a27] mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6fb342] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1a237e] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/20 hover:-translate-y-1 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Resetting...' : 'Update Password'}
                            {!isLoading && <CheckCircle2 size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
