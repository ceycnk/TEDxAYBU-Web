import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import AdminPinModal from '../components/AdminPinModal';
import { 
    QrCode, 
    LogIn, 
    LogOut, 
    Camera, 
    CameraOff, 
    CheckCircle2, 
    AlertCircle, 
    Users, 
    BarChart3, 
    Send
} from 'lucide-react';

// Ses Efekti (Web Audio API Synthesizer)
const playBeep = (type = 'success') => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'success') {
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'checkout') {
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.08); // C5
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, audioCtx.currentTime);
            osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        }
    } catch (e) {
        // Otomatik ses engeli
    }
};

export default function GateScanner() {
    // Güvenlik & PIN Durumu
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem('tedx_admin_pin');
    });

    // Kamera ve Tarama Durumları
    const [isScanning, setIsScanning] = useState(false);
    const [scannerLoading, setScannerLoading] = useState(false);
    const html5QrCodeRef = useRef(null);
    const isProcessingRef = useRef(false);

    // Sonuç Kartı Durumu
    const [scanResult, setScanResult] = useState(null);
    const [manualCode, setManualCode] = useState('');
    const [manualLoading, setManualLoading] = useState(false);

    // Canlı İstatistikler
    const [stats, setStats] = useState({ insideCount: 0, maxCapacity: 600 });

    // 1. Canlı İstatistikleri Çek ve Dinle
    const fetchStats = async () => {
        try {
            const { data: settings } = await supabase
                .from('event_settings')
                .select('max_venue_capacity, registration_phase, phase_1_limit, phase_2_limit')
                .eq('id', 1)
                .single();

            const { count } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .eq('is_inside', true);

            const activeCap = settings?.registration_phase === 'phase_1'
                ? (settings?.phase_1_limit || 300)
                : (settings?.max_venue_capacity || settings?.phase_2_limit || 600);

            setStats({
                insideCount: count || 0,
                maxCapacity: activeCap
            });
        } catch (err) {
            console.error('İstatistik çekme hatası:', err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchStats();

        const channel = supabase
            .channel('gate_realtime_stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
                fetchStats();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'event_settings' }, () => {
                fetchStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated]);

    // 2. Kamera Başlatma / Durdurma (Kamera Görüntüsünü Görünür Kılan Yapı)
    const startScanner = async () => {
        setScannerLoading(true);
        setScanResult(null);
        setIsScanning(true); // Önce DOM kutusunu aç ki kamera elementi 0x0 olmasın!

        setTimeout(async () => {
            try {
                if (!html5QrCodeRef.current) {
                    html5QrCodeRef.current = new Html5Qrcode('reader');
                }

                const config = {
                    fps: 15,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const edgeSize = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.72);
                        return { width: edgeSize, height: edgeSize };
                    },
                    aspectRatio: 1.0
                };

                await html5QrCodeRef.current.start(
                    { facingMode: 'environment' }, // Arka kamera
                    config,
                    onScanSuccess,
                    () => {}
                );
            } catch (err) {
                console.error('Kamera başlatılamadı:', err);
                setIsScanning(false);
                alert('Kamera başlatılamadı. Lütfen kamera izinlerinizi kontrol edin.');
            } finally {
                setScannerLoading(false);
            }
        }, 150);
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error('Kamera durdurma hatası:', err);
            }
        } else {
            setIsScanning(false);
        }
    };

    // Sayfadan çıkılırsa kamerayı kapat
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(() => {});
            }
        };
    }, []);

    // 3. QR Kod Okunduğunda Çalışan İşlem (Debounced)
    const onScanSuccess = async (decodedText) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        const cleanCode = decodedText.trim();
        await processTicket(cleanCode);

        setTimeout(() => {
            isProcessingRef.current = false;
        }, 2000);
    };

    // 4. Bilet İşleme Fonksiyonu (Yalnızca Giriş / Check-in)
    const processTicket = async (ticketCode) => {
        if (navigator.vibrate) {
            navigator.vibrate([100]);
        }

        try {
            const { data, error } = await supabase.rpc('process_check_in', {
                p_ticket_code: ticketCode
            });

            if (error) {
                playBeep('error');
                setScanResult({
                    status: 'error',
                    message: error.message || 'Giriş işlemi başarısız oldu.',
                    ticketCode,
                    timestamp: new Date().toLocaleTimeString('tr-TR')
                });
            } else {
                playBeep('success');
                setScanResult({
                    status: 'success',
                    message: 'Giriş Başarılı',
                    participant: data,
                    ticketCode,
                    timestamp: new Date().toLocaleTimeString('tr-TR')
                });
                fetchStats();
            }
        } catch (err) {
            playBeep('error');
            setScanResult({
                status: 'error',
                message: err.message || 'Bilet sorgulanırken bir hata oluştu.',
                ticketCode,
                timestamp: new Date().toLocaleTimeString('tr-TR')
            });
        }
    };

    // Manuel Kod Girilerek İşlem Yapma
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualCode.trim()) return;
        setManualLoading(true);
        await processTicket(manualCode.trim().toUpperCase());
        setManualCode('');
        setManualLoading(false);
    };

    // Çıkış Yap (PIN oturumunu kapat)
    const handleLogout = () => {
        sessionStorage.removeItem('tedx_admin_pin');
        setIsAuthenticated(false);
        stopScanner();
    };

    // PIN Kontrolü
    if (!isAuthenticated) {
        return <AdminPinModal onAuthenticated={() => setIsAuthenticated(true)} />;
    }

    const isFull = stats.insideCount >= stats.maxCapacity;

    return (
        <div 
            style={{ backgroundColor: 'var(--bg-primary)' }} 
            className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-lg mx-auto theme-transition"
        >
            {/* Kamera Video Öğesi İçin Özel Stil (Tam Ekran ve Görünür Canlı Yayın) */}
            <style>{`
                #reader {
                    border: none !important;
                }
                #reader video {
                    width: 100% !important;
                    height: auto !important;
                    max-height: 380px !important;
                    object-fit: cover !important;
                    border-radius: 18px !important;
                    display: block !important;
                }
                #reader__scan_region {
                    background: transparent !important;
                }
                #reader__dashboard_section {
                    padding: 0 !important;
                }
                #reader__dashboard_section_csr button {
                    display: none !important;
                }
            `}</style>

            {/* ÜST BAR & TAB GEÇİŞLERİ */}
            <div 
                style={{ borderColor: 'var(--border-color)' }} 
                className="flex items-center justify-between border-b pb-3 mb-4 theme-transition"
            >
                <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--text-primary)' }} className="font-black text-lg tracking-tight">
                        TEDx<span className="text-[#EB0028]">AYBU</span>
                    </span>
                    <span 
                        style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                        className="text-xs border px-2 py-0.5 rounded-full font-mono font-medium"
                    >
                        Kapı Modu
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <Link
                        to="/admin/doluluk"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold shadow-sm hover:opacity-80 transition-all"
                    >
                        <BarChart3 className="w-3.5 h-3.5 text-[#EB0028]" />
                        Doluluk Paneli
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ color: 'var(--text-muted)' }}
                        className="p-1.5 rounded-lg hover:text-red-500 transition-all cursor-pointer"
                        title="Oturumu Kapat"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ANLIK İÇERİDEKİ KİŞİ SAYAÇ KARTI */}
            <div 
                style={{ 
                    backgroundColor: isFull ? 'rgba(235, 0, 40, 0.1)' : 'var(--bg-card)', 
                    borderColor: isFull ? '#EB0028' : 'var(--border-color)' 
                }}
                className="p-4 rounded-2xl border shadow-sm transition-all mb-4 theme-transition"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Users className={`w-5 h-5 ${isFull ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`} />
                        <div>
                            <p style={{ color: 'var(--text-muted)' }} className="text-[11px] uppercase tracking-wider font-bold">Salondaki Kişi</p>
                            <div className="flex items-baseline gap-1.5">
                                <span style={{ color: isFull ? '#ef4444' : 'var(--text-primary)' }} className="text-2xl font-black">
                                    {stats.insideCount}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">/ {stats.maxCapacity}</span>
                            </div>
                        </div>
                    </div>
                    {isFull ? (
                        <span className="px-2.5 py-1 bg-red-600/20 text-red-500 border border-red-500/40 rounded-lg text-xs font-bold uppercase animate-pulse">
                            KAPASİTE DOLU
                        </span>
                    ) : (
                        <div className="text-right">
                            <p style={{ color: 'var(--text-muted)' }} className="text-[11px] uppercase tracking-wider font-bold">Boş Koltuk</p>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                {Math.max(0, stats.maxCapacity - stats.insideCount)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* KAPI GİRİŞ BİLGİ BANDI */}
            <div 
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                className="flex items-center justify-between mb-4 px-4 py-3 border rounded-2xl shadow-sm theme-transition"
            >
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Giriş / Kapı Kontrolü</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <LogIn className="w-4 h-4 text-emerald-500" />
                    <span>Bilet Okutma Aktif</span>
                </div>
            </div>

            {/* SONUÇ KARTI (GİRİŞ BİLDİRİMİ) */}
            {scanResult && (
                <div className={`p-4 sm:p-5 rounded-2xl border-2 mb-4 animate-in fade-in zoom-in-95 duration-200 shadow-lg ${
                    scanResult.status === 'success'
                        ? 'bg-emerald-950 border-emerald-500 text-white'
                        : 'bg-red-950 border-red-500 text-white'
                }`}>
                    <div className="flex items-start gap-3">
                        {scanResult.status === 'success' ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-lg tracking-tight">
                                    {scanResult.message}
                                </h3>
                                <span className="text-[11px] opacity-80 font-mono">
                                    {scanResult.timestamp}
                                </span>
                            </div>

                            {scanResult.participant && (
                                <div className="mt-2.5 pt-2.5 border-t border-white/20 space-y-1">
                                    <p className="text-base font-bold text-white">
                                        {scanResult.participant.full_name}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs opacity-90 font-mono">
                                        {scanResult.participant.student_number && (
                                            <span>Öğr: {scanResult.participant.student_number}</span>
                                        )}
                                        <span>Kod: {scanResult.participant.ticket_code}</span>
                                    </div>
                                </div>
                            )}

                            {scanResult.status === 'error' && (
                                <p className="text-xs mt-1.5 opacity-90 font-mono">
                                    Kod: {scanResult.ticketCode}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CANLI KAMERA GÖRÜNTÜ ALANI */}
            <div 
                style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-card)'
                }}
                className="border rounded-3xl p-4 sm:p-5 text-center relative overflow-hidden mb-4 theme-transition"
            >
                {/* HTML5 QR Container (Kamera görüntüsü burada akar) */}
                <div 
                    id="reader" 
                    className={`w-full overflow-hidden rounded-2xl bg-black border border-zinc-700/50 shadow-inner ${
                        !isScanning ? 'hidden' : 'block'
                    }`}
                ></div>

                {/* Kamera Açıkken Canlı Tarama Rozeti */}
                {isScanning && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-emerald-500 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Kamera Canlı Yayında — QR Kodu Vizöre Yaklaştırın</span>
                    </div>
                )}

                {/* Kamera Kapalıyken Bekleme Ekranı */}
                {!isScanning && (
                    <div className="py-12 px-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <QrCode className="w-8 h-8" />
                        </div>
                        <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-base theme-transition">Kamera Beklemede</h4>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 max-w-xs theme-transition">
                            Katılımcının QR biletini okutmak için aşağıdaki butondan kamerayı başlatın.
                        </p>
                    </div>
                )}

                {/* Kamera Başlat / Durdur Butonu */}
                <button
                    onClick={isScanning ? stopScanner : startScanner}
                    disabled={scannerLoading}
                    className={`w-full mt-3 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-md ${
                        isScanning
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                    }`}
                >
                    {scannerLoading ? (
                        'Kamera Hazırlanıyor...'
                    ) : isScanning ? (
                        <>
                            <CameraOff className="w-4 h-4" />
                            Kamerayı Durdur
                        </>
                    ) : (
                        <>
                            <Camera className="w-4 h-4" />
                            Kamerayı Başlat
                        </>
                    )}
                </button>
            </div>

            {/* YEDEK MANUEL KOD GİRİŞİ */}
            <form 
                onSubmit={handleManualSubmit}
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                className="border rounded-2xl p-3.5 shadow-sm theme-transition"
            >
                <label style={{ color: 'var(--text-muted)' }} className="block text-[11px] font-bold uppercase tracking-wider mb-2">
                    Manuel Bilet Kodu Girişi
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Örn: TEDX-AB12CD"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        className="flex-1 border rounded-xl px-3 py-2.5 text-sm uppercase font-mono focus:outline-none focus:border-[#EB0028] theme-transition"
                    />
                    <button
                        type="submit"
                        disabled={manualLoading || !manualCode.trim()}
                        className="px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Send className="w-3.5 h-3.5" />
                        Onayla
                    </button>
                </div>
            </form>
        </div>
    );
}
