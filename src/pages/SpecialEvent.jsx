import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Calendar, MapPin, Sparkles, CheckCircle2, Ticket, Heart, Dumbbell, ShieldAlert, ArrowRight } from 'lucide-react';

const SpecialEvent = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen pt-20 theme-transition">

            {/* Dekoratif arka plan ışık efektleri */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ted-red/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ted-red/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Header / Başlık Bölümü */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-16 sm:py-20 relative overflow-hidden theme-transition">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ted-red/5 rounded-full blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    
                    {/* Üst Rozet */}
                    <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase"
                        style={{ backgroundColor: 'rgba(235,0,40,0.1)', border: '1px solid rgba(235,0,40,0.4)', color: '#EB0028' }}>
                        <Sparkles className="w-4 h-4 text-[#EB0028]" />
                        <span>Özel Etkinlik Deneyimi</span>
                        <Sparkles className="w-4 h-4 text-[#EB0028]" />
                    </div>

                    <h1 style={{ color: 'var(--text-primary)' }} className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter uppercase theme-transition">
                        TEDxAYBU <span className="text-ted-red">×</span><br />
                        Athletic House Academy
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mx-auto mb-6"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-lg md:text-xl font-light max-w-2xl mx-auto theme-transition">
                        Güne hareket, enerji, zihinsel farkındalık ve iyi yaşamla hazırlanın 🧘🏻‍♀️
                    </p>
                </div>
            </div>

            {/* İçerik Bölümü */}
            <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* ⚠️ KONTENJAN DOLDU BİLDİRİM KARTI (DİKKAT ÇEKİCİ) */}
                    <div 
                        style={{ 
                            backgroundColor: 'rgba(235, 0, 40, 0.05)', 
                            border: '2px solid rgba(235, 0, 40, 0.4)',
                            boxShadow: '0 10px 30px -10px rgba(235, 0, 40, 0.15)'
                        }}
                        className="rounded-3xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-300 theme-transition"
                    >
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#EB0028] text-white mb-4 shadow-md shadow-red-600/30">
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-black uppercase tracking-tight mb-2 theme-transition">
                            Bu Etkinliğin Kontenjanı Dolmuştur
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6 theme-transition">
                            Yoğun ilginiz için teşekkür ederiz! Athletic House Academy iş birliğiyle gerçekleştireceğimiz özel pilates ve hareket seansımızın katılımcı kontenjanı kısa sürede <strong>tamamen dolmuştur</strong>.
                        </p>

                        {/* Ana Konferansa Yönlendirme Kartı / Butonu */}
                        <div 
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm theme-transition"
                        >
                            <div>
                                <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm flex items-center gap-2 theme-transition">
                                    <Ticket className="w-4 h-4 text-[#EB0028]" />
                                    <span>TEDxAYBU 2026 Konferans Biletinizi Aldınız mı?</span>
                                </h4>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 theme-transition">
                                    16 Ekim'deki ana konuşmacı ve sahne performansları için konferans kayıtlarımız devam etmektedir.
                                </p>
                            </div>
                            <Link
                                to="/bilet-al"
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EB0028] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                            >
                                <span>Konferans Biletini Al</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* ETKİNLİK TANITIM KARTI */}
                    <div 
                        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        className="rounded-3xl p-6 sm:p-10 shadow-sm theme-transition"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-[#EB0028]/10 text-[#EB0028]">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold uppercase tracking-tight theme-transition">
                                    Özel Deneyim Hakkında
                                </h2>
                                <p style={{ color: 'var(--text-muted)' }} className="text-xs">
                                    TEDxAYBU 2026 "Beyond the Surface" Kapsamında
                                </p>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)' }} className="text-base sm:text-lg leading-relaxed mb-8 theme-transition">
                            TEDxAYBU ve Athletic House Academy iş birliğiyle,{' '}
                            <strong style={{ color: 'var(--text-primary)' }}>16 Ekim Cuma günü Ankara Yıldırım Beyazıt Üniversitesi Doğu Kampüsü'nde (Milli İrade Yerleşkesi)</strong>{' '}
                            güne hareket, yüksek enerji ve zihinsel dinginlikle başlayacağımız sıra dışı bir deneyim gerçekleştiriyoruz.
                        </p>

                        {/* Pilates ve Seans Detay Kutusu */}
                        <div 
                            className="flex items-start gap-5 p-6 rounded-2xl mb-8 theme-transition"
                            style={{ backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border-color)' }}
                        >
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-base sm:text-lg mb-2 uppercase tracking-wide theme-transition">
                                    Pilates & Hareket Seansı
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed mb-3 theme-transition">
                                    Athletic House Academy profesyonel eğitmenleri eşliğinde,{' '}
                                    <strong style={{ color: 'var(--text-primary)' }}>beden farkındalığını artıran, duruşu güçlendiren ve zihinsel yenilenmeyi</strong>{' '}
                                    destekleyen özel bir seans yürütülecektir.
                                </p>
                                <ul style={{ color: 'var(--text-secondary)' }} className="text-xs space-y-1.5 list-disc list-inside">
                                    <li>Her seviyeden katılımcıya uygun tempolu hareket akışı</li>
                                    <li>Derin nefes, esneme ve omurga rahatlatma çalışmaları</li>
                                    <li>Güne enerjik bir başlangıç ve motivasyon artışı</li>
                                </ul>
                            </div>
                        </div>

                        {/* Bilgi Kartları Tablosu */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: '📅', label: 'Tarih', value: '16 Ekim 2026 Cuma' },
                                { icon: '📍', label: 'Konum', value: 'AYBÜ Milli İrade Yerleşkesi' },
                                { icon: '🆓', label: 'Katılım', value: 'Ücretsiz (Kayıtlı Katılımcılar)' },
                                { icon: '🔒', label: 'Kontenjan Durumu', value: 'Doldu (Kayıtlar Kapandı)', highlight: true },
                            ].map(({ icon, label, value, highlight }) => (
                                <div 
                                    key={label} 
                                    className="flex items-center gap-3.5 p-4 rounded-2xl theme-transition"
                                    style={{ 
                                        backgroundColor: highlight ? 'rgba(235,0,40,0.06)' : 'var(--bg-secondary)', 
                                        border: highlight ? '1px solid rgba(235,0,40,0.3)' : '1px solid var(--border-color)' 
                                    }}
                                >
                                    <span className="text-2xl">{icon}</span>
                                    <div>
                                        <p style={{ color: 'var(--text-muted)' }} className="text-[11px] uppercase tracking-wider font-bold theme-transition">
                                            {label}
                                        </p>
                                        <p style={{ color: highlight ? '#EB0028' : 'var(--text-primary)' }} className="font-bold text-sm theme-transition">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
                            <p style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed">
                                Bu özel etkinliğe kayıt yaptıran katılımcılarımızla 16 Ekim sabahı yerleşkemizde buluşmak üzere sabırsızlanıyoruz!
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpecialEvent;
