import React, { useState, useEffect } from 'react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    id?: string;
}

const COUNTRY_CODES = [
    { code: '+91', country: 'IN', label: 'India (+91)' },
];

export function PhoneInput({
    value,
    onChange,
    disabled = false,
    placeholder = '98765 43210',
    className = '',
    id,
}: PhoneInputProps) {
    const [countryCode, setCountryCode] = useState('+91');
    const [localNumber, setLocalNumber] = useState('');

    // Initialize state from value prop
    useEffect(() => {
        if (!value) {
            setLocalNumber('');
            return;
        }

        // Check if value starts with any known country code
        const matchedCountry = COUNTRY_CODES.find(c => value.startsWith(c.code));

        if (matchedCountry) {
            setCountryCode(matchedCountry.code);
            setLocalNumber(value.slice(matchedCountry.code.length));
        } else {
            // If no match (or legacy 10-digit number), assume India (+91) if it looks like an Indian number,
            // otherwise just keep it as is or default to +91
            if (/^[6-9]\d{9}$/.test(value)) {
                setCountryCode('+91');
                setLocalNumber(value);
            } else {
                // Fallback: if it has a +, try to extract, else just set local
                if (value.startsWith('+')) {
                    // Try to find best match again or just default
                    setLocalNumber(value);
                } else {
                    setLocalNumber(value);
                }
            }
        }
    }, [value]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCode = e.target.value;
        setCountryCode(newCode);
        triggerChange(newCode, localNumber);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawInput = e.target.value;
        // Remove non-digits
        const cleaned = rawInput.replace(/\D/g, '');
        setLocalNumber(cleaned);
        triggerChange(countryCode, cleaned);
    };

    const triggerChange = (code: string, number: string) => {
        if (!number) {
            onChange('');
            return;
        }
        onChange(`${code}${number}`);
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <div className="relative min-w-[120px]">
                <select
                    value={countryCode}
                    onChange={handleCountryChange}
                    disabled={disabled}
                    className="w-full h-full appearance-none rounded-lg border border-[#262626] bg-[#141414] px-3 py-2.5 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 text-sm"
                >
                    {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.label}
                        </option>
                    ))}
                </select>
                {/* Custom arrow icon could go here if appearance-none is used */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>

            <div className="relative flex-1">
                <input
                    id={id}
                    type="tel"
                    value={localNumber}
                    onChange={handleNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full rounded-lg border border-[#262626] bg-[#141414] px-4 py-2.5 text-white placeholder-gray-600 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 text-sm md:text-base"
                />
            </div>
        </div>
    );
}
