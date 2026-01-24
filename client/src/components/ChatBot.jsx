import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

const TypewriterText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 15); // Adjust typing speed here
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return <span>{displayedText}</span>;
};

const ChatBot = ({ currentDiagnosis, detectionId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'assistant',
            content: `Hello! I'm your AgroScan AI Advisor. I see we have identified ${currentDiagnosis || 'a plant specimen'}. How can I help you manage this today?`,
            animated: true
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        };

        // Initial scroll
        scrollToBottom();

        // Create an observer to scroll when content changes (like during typewriter effect)
        const observer = new MutationObserver(scrollToBottom);
        if (scrollRef.current) {
            observer.observe(scrollRef.current, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [isOpen, isMinimized]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isTyping) return;

        const userMsg = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage('');
        setIsTyping(true);

        try {
            const res = await axios.post(`http://localhost:5000/api/chat/${detectionId || 'current'}`, {
                message: message,
                diseaseName: currentDiagnosis,
                history: chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }))
            });

            setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.response, animated: false }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: "I'm having a connection issue. Please ensure the backend server is running.", animated: false }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-[#1a2e1d] text-white p-5 rounded-full shadow-2xl hover:bg-[#6fb342] hover:scale-110 transition-all duration-300 z-50 animate-bounce"
            >
                <MessageSquare size={28} />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-8 right-8 w-[400px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col z-50 border border-gray-100 transition-all duration-500 overflow-hidden ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-[#1a2e1d] p-5 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6fb342] rounded-xl flex items-center justify-center">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest">AgroScan AI</h4>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold opacity-70 uppercase">Online Advisor</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition">
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition text-red-400">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50" ref={scrollRef}>
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#6fb342] text-white' : 'bg-white shadow-sm border border-gray-100 text-[#1a2e1d]'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-[#1a2e1d] text-white rounded-tr-none shadow-lg shadow-green-900/10' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'}`}>
                                        {msg.role === 'assistant' && !msg.animated ? (
                                            <TypewriterText
                                                text={msg.content}
                                                onComplete={() => {
                                                    const newHistory = [...chatHistory];
                                                    newHistory[i].animated = true;
                                                    setChatHistory(newHistory);
                                                }}
                                            />
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                                        <Bot size={16} className="text-[#1a2e1d]" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#6fb342] rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-[#6fb342] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-[#6fb342] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Ask about treatments, prevention..."
                            className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#6fb342] rounded-2xl px-5 py-3 text-sm outline-none transition font-medium"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isTyping}
                            className="bg-[#1a2e1d] text-white p-3.5 rounded-2xl hover:bg-[#6fb342] transition-all duration-300 disabled:opacity-50 disabled:scale-95"
                        >
                            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatBot;
