import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminPinModal({ onAuthenticated }) {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        if (!pin.trim()) {
            setError('Lütfen 4 haneli PIN kodunu giriniz.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error: fetchError } = await supabase
                .from('event_settings')
                .select('admin_pin')
                .eq('id', 1)
                .single();

            if (fetchError) throw fetchError;

            const expectedPin = data?.admin_pin;

            if (pin.trim() === expectedPin) {
                sessionStorage.setItem('tedx_admin_pin', pin.trim());
                onAuthenticated(pin.trim());
            } else {
                setError('Hatalı PIN kodu! Lütfen tekrar deneyiniz.');
            }
        } catch (err) {
            console.error('PIN doğrulama hatası:', err);
            setError('Doğrulama sırasında bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleNumClick = (digit) => {
        if (pin.length < 6) {
            setPin(prev => prev + digit);
            setError('');
        }
    };

    const handleClear = () => {
        setPin('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md transition-all">
            <div 
                style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-lg)'
                }}
                className="w-full max-w-sm border rounded-3xl p-6 sm:p-8 text-center theme-transition"
            >
                {/* İkon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#EB0028]/10 border border-[#EB0028]/25 flex items-center justify-center text-[#EB0028]">
                    <Lock className="w-8 h-8" />
                </div>

                <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-black tracking-tight theme-transition">
                    Yetkili Girişi
                </h2>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 mb-6 theme-transition">
                    Kapı kontrolü ve yönetim paneline erişmek için 4 haneli PIN kodunu giriniz.
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* PIN Gösterge Noktaları */}
                <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map((idx) => (
                        <div
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                pin.length > idx 
                                    ? 'bg-[#EB0028] border-[#EB0028] scale-110 shadow-md shadow-red-500/40' 
                                    : 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850'
                            }`}
                        />
                    ))}
                </div>

                {/* Nümerik Tuş Takımı */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => handleNumClick(num.toString())}
                            style={{ 
                                backgroundColor: 'var(--bg-card-alt)', 
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                            className="h-14 rounded-2xl border text-xl font-bold transition-all active:scale-95 active:bg-[#EB0028] active:text-white flex items-center justify-center cursor-pointer shadow-sm hover:opacity-90 theme-transition"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{ color: 'var(--text-muted)' }}
                        className="h-14 rounded-2xl text-xs font-semibold hover:opacity-80 flex items-center justify-center cursor-pointer"
                    >
                        Temizle
                    </button>
                    <button
                        type="button"
                        onClick={() => handleNumClick('0')}
                        style={{ 
                            backgroundColor: 'var(--bg-card-alt)', 
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                        className="h-14 rounded-2xl border text-xl font-bold transition-all active:scale-95 active:bg-[#EB0028] active:text-white flex items-center justify-center cursor-pointer shadow-sm hover:opacity-90 theme-transition"
                    >
                        0
                    </button>
                    <button
                        type="button"
                        onClick={handleVerify}
                        disabled={loading || pin.length < 4}
                        className="h-14 rounded-2xl bg-[#EB0028] hover:opacity-90 active:scale-95 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-all shadow-md shadow-red-600/30 cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
