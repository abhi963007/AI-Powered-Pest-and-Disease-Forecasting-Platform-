import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Check } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, placeholder = "Select Field" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt._id === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-[1001]" ref={dropdownRef}>
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border-2 border-green-100 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-sm hover:border-green-400 transition-all duration-300 min-w-[220px] justify-between group"
            >
                <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-[#6fb342] group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[#2d5a27] text-sm tracking-tight">
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "anticipate" }}
                >
                    <ChevronDown size={18} className="text-[#6fb342]" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-full bg-white border border-green-50 rounded-3xl shadow-2xl shadow-green-900/10 overflow-hidden"
                    >
                        <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <motion.button
                                    key={option._id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between transition-colors ${value === option._id
                                            ? 'bg-green-50 text-[#2d5a27]'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="font-bold text-sm">{option.name}</span>
                                    {value === option._id && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <Check size={16} className="text-[#6fb342]" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
