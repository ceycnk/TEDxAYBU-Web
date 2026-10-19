import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminPinModal from '../components/AdminPinModal';
import { 
    Users, 
    UserCheck, 
    Ticket, 
    QrCode, 
    Sliders, 
    MinusCircle, 
    PlusCircle, 
    CheckCircle2, 
    AlertCircle, 
    LogOut, 
    RefreshCw, 
    Clock, 
    Layers,
    Download,
    Search,
    FileSpreadsheet,
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    User,
    ListFilter,
    RotateCcw,
    X
} from 'lucide-react';

export default function AdminDashboard() {
    // PIN ve Güvenlik
    const [pin, setPin] = useState(() => sessionStorage.getItem('tedx_admin_pin') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('tedx_admin_pin'));

    // Veriler
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [settings, setSettings] = useState({
        registration_phase: 'phase_1',
        is_registration_active: true,
        phase_1_limit: 300,
        phase_2_limit: 600,
        max_venue_capacity: 600,
        admin_pin: ''
    });

    const [totalRegistered, setTotalRegistered] = useState(0);
    const [currentInside, setCurrentInside] = useState(0);
    const [manualOffset, setManualOffset] = useState(() => {
        const saved = sessionStorage.getItem('tedx_manual_inside_offset');
        return saved ? parseInt(saved, 10) || 0 : 0;
    });
    const [recentMovements, setRecentMovements] = useState([]);
    const [allParticipants, setAllParticipants] = useState([]);

    // Filtreleme, Arama, Sekmeler ve QR Modal
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'movements'
    const [selectedQR, setSelectedQR] = useState(null);

    // 1. Verileri Çek
    const fetchData = async () => {
        try {
            // Ayarları çek
            const { data: setts, error: settErr } = await supabase
                .from('event_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (settErr) throw settErr;
            if (setts) setSettings(setts);

            // Toplam kayıtlı bilet
            const { count: regCount, error: regErr } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true });

            if (regErr) throw regErr;
            setTotalRegistered(regCount || 0);

            // Şu an içeride olanlar
            const { count: insideCount, error: insideErr } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .eq('is_inside', true);

            if (insideErr) throw insideErr;
            setCurrentInside(insideCount || 0);

            // Son 10 hareket
            const { data: moves, error: movesErr } = await supabase
                .from('tickets')
                .select('id, full_name, student_number, ticket_code, is_inside, last_status_change, participant_type')
                .order('last_status_change', { ascending: false })
                .limit(10);

            if (movesErr) throw movesErr;
            setRecentMovements(moves || []);

            // Tüm kayıtlı katılımcılar (eksiksiz liste - ilk bilet alan 1. sırada)
            const { data: allList, error: allListErr } = await supabase
                .from('tickets')
                .select('*')
                .order('created_at', { ascending: true });

            if (allListErr) throw allListErr;
            setAllParticipants(allList || []);

        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    // QR ile Giriş/Çıkış Yapan Katılımcı Kontrolü (Bilet kapıda taranmış mı?)
    const hasCheckedIn = (p) => {
        if (!p) return false;
        if (p.is_inside) return true;
        if (!p.last_status_change || !p.created_at) return false;
        return Math.abs(new Date(p.last_status_change).getTime() - new Date(p.created_at).getTime()) > 5000;
    };

    // 1. Sadece QR ile Giriş/Çıkış Yapanları Excel (CSV) Olarak İndir (İsim, Soyisim, E-posta ve Detaylar)
    const exportCheckedInToCSV = () => {
        const checkedInList = allParticipants.filter(hasCheckedIn);
        if (!checkedInList || checkedInList.length === 0) {
            alert('QR kodu okutularak giriş yapmış katılımcı bulunamadı.');
            return;
        }

        const BOM = '\uFEFF';
        const headers = [
            'Sıra No', 
            'Ad Soyad', 
            'E-posta Adresi', 
            'Öğrenci No', 
            'Telefon Numarası', 
            'Katılımcı Türü', 
            'Bölüm / Görev', 
            'Bilet Kodu', 
            'Kontenjan Grubu',
            'Son Kapı Durumu', 
            'Son Kapı İşlem Saati',
            'Bilet Kayıt Tarihi'
        ];

        const cutoffAsil = new Date('2026-10-10T23:59:59.999Z');
        const eventDayStart = new Date('2026-10-16T00:00:00.000+03:00');

        const rows = checkedInList.map((p, index) => {
            const createdAt = new Date(p.created_at);
            let quotaGroup = '1. Dönem Asıl Kontenjan (10 Ekim Öncesi)';
            if (createdAt >= eventDayStart) {
                quotaGroup = 'Etkinlik Günü Kaydı (16 Ekim)';
            } else if (createdAt > cutoffAsil) {
                quotaGroup = 'Ek Kontenjan';
            }

            const lastActionTime = p.last_status_change 
                ? new Date(p.last_status_change).toLocaleString('tr-TR')
                : '-';

            return [
                index + 1,
                `"${(p.full_name || '').replace(/"/g, '""')}"`,
                `"${(p.email || '').replace(/"/g, '""')}"`,
                `"${(p.student_number || '-').replace(/"/g, '""')}"`,
                `"${(p.phone || '-').replace(/"/g, '""')}"`,
                `"${(p.participant_type || 'Katılımcı').replace(/"/g, '""')}"`,
                `"${(p.department_or_role || '-').replace(/"/g, '""')}"`,
                `"${p.ticket_code || ''}"`,
                `"${quotaGroup}"`,
                p.is_inside ? 'İçeride (Salonda)' : 'Giriş Yapıldı / Çıktı',
                `"${lastActionTime}"`,
                `"${new Date(p.created_at).toLocaleString('tr-TR')}"`
            ];
        });

        const csvContent = BOM + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `TEDxAYBU_QR_Giris_Yapanlar_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 2. Tüm Başvuranları Excel (CSV) Olarak İndir (Türkçe karakter destekli UTF-8 BOM)
    const exportToCSV = () => {
        if (!allParticipants || allParticipants.length === 0) {
            alert('İndirilecek kayıtlı katılımcı bulunamadı.');
            return;
        }

        const BOM = '\uFEFF';
        const headers = [
            'Sıra No', 
            'Kontenjan Grubu',
            'Ad Soyad', 
            'Katılımcı Türü', 
            'Öğrenci No', 
            'E-posta Adresi', 
            'Telefon Numarası', 
            'Bölüm / Görev', 
            'Bilet Kodu', 
            'Salonda mı?', 
            'QR İle Giriş Yaptı mı?',
            'Son Kapı İşlem Saati',
            'Kayıt Tarihi'
        ];

        const cutoffAsil = new Date('2026-10-10T23:59:59.999Z');
        const eventDayStart = new Date('2026-10-16T00:00:00.000+03:00');

        const rows = allParticipants.map((p, index) => {
            const createdAt = new Date(p.created_at);
            let quotaGroup = '1. Dönem Asıl Kontenjan (10 Ekim Öncesi)';
            if (createdAt >= eventDayStart) {
                quotaGroup = 'Etkinlik Günü Kaydı (16 Ekim)';
            } else if (createdAt > cutoffAsil) {
                quotaGroup = 'Ek Kontenjan';
            }

            const wasCheckedIn = hasCheckedIn(p);
            const lastActionTime = wasCheckedIn && p.last_status_change 
                ? new Date(p.last_status_change).toLocaleString('tr-TR')
                : '-';

            return [
                index + 1,
                `"${quotaGroup}"`,
                `"${(p.full_name || '').replace(/"/g, '""')}"`,
                `"${(p.participant_type || 'Katılımcı').replace(/"/g, '""')}"`,
                `"${(p.student_number || '-').replace(/"/g, '""')}"`,
                `"${(p.email || '').replace(/"/g, '""')}"`,
                `"${(p.phone || '-').replace(/"/g, '""')}"`,
                `"${(p.department_or_role || '-').replace(/"/g, '""')}"`,
                `"${p.ticket_code || ''}"`,
                p.is_inside ? 'İçeride' : 'Dışarıda',
                wasCheckedIn ? 'Evet (Giriş Yaptı)' : 'Hayır',
                `"${lastActionTime}"`,
                `"${new Date(p.created_at).toLocaleString('tr-TR')}"`
            ];
        });

        const csvContent = BOM + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `TEDxAYBU_Tum_Basvuranlar_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();

        // Supabase Realtime Aboneliği
        const channel = supabase
            .channel('admin_dashboard_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'event_settings' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated]);

    // 2. Faz Değiştirme (Tek Tıkla)
    const handlePhaseChange = async (newPhase) => {
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const isActive = newPhase !== 'closed';
            const targetCapacity = newPhase === 'phase_1' ? 500 : 600;

            // Önce direct update
            const { error: directErr } = await supabase
                .from('event_settings')
                .update({
                    registration_phase: newPhase,
                    is_registration_active: isActive,
                    phase_1_limit: 500,
                    phase_2_limit: 600,
                    max_venue_capacity: targetCapacity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (directErr) {
                // RPC dene
                const activePin = pin || sessionStorage.getItem('tedx_admin_pin') || '';
                const { error: rpcErr } = await supabase.rpc('admin_update_phase', {
                    p_pin: activePin,
                    p_phase: newPhase
                });
                if (rpcErr) throw rpcErr;
            }

            setSettings(prev => ({
                ...prev,
                registration_phase: newPhase,
                is_registration_active: isActive,
                phase_1_limit: 500,
                phase_2_limit: 600,
                max_venue_capacity: targetCapacity
            }));

            setMessage({
                type: 'success',
                text: `Kayıt modu "${newPhase === 'phase_1' ? 'Ek Kontenjan Modu (500 Limit)' : newPhase === 'phase_2' ? 'Etkinlik Günü Kaydı (600 Limit)' : 'Kapalı'}" olarak güncellendi. Kontenjan: ${targetCapacity} kişi.`
            });
            await fetchData();
        } catch (err) {
            console.error('Faz değiştirme hatası:', err);
            setMessage({ type: 'error', text: 'Faz güncellenirken bir hata oluştu: ' + (err.message || '') });
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Manuel Sayaç Kalibrasyonu (+1 / -1)
    // Kesinlikle yeni bilet oluşturmaz veya veritabanındaki bilet kotasını doldurmaz;
    // Yalnızca salon içi kişi sayısını anlık olarak kalibre eder.
    const handleManualAdjust = (delta) => {
        setMessage({ type: '', text: '' });
        const newOffset = manualOffset + delta;
        setManualOffset(newOffset);
        sessionStorage.setItem('tedx_manual_inside_offset', newOffset.toString());

        setMessage({
            type: 'success',
            text: `Salondaki kişi sayısı ${delta > 0 ? '+1 arttırıldı' : '-1 azaltıldı'} (Yeni bilet oluşturulmadı, kota etkilenmedi).`
        });
    };

    // 4. Salondaki Kişi Sayısını Sıfırla (Onay Korumalı)
    const handleResetInside = async () => {
        const confirmed = window.confirm(
            'Salondaki kişi sayısını sıfırlamak istediğinize emin misiniz?\n\nBu işlem, içeride görünen tüm kayıtları dışarıda yapacak ve salondaki kişi sayısını 0\'a çekecektir.'
        );

        if (!confirmed) return;

        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Önce varsa RPC admin_reset_inside_count fonksiyonunu çağır (Atomik sıfırlama)
            let rpcSucceeded = false;
            try {
                const { error: rpcErr } = await supabase.rpc('admin_reset_inside_count');
                if (!rpcErr) {
                    rpcSucceeded = true;
                }
            } catch (e) {
                // RPC henüz tanımlı değilse devam et
            }

            // 2. Direct UPDATE dene
            try {
                await supabase
                    .from('tickets')
                    .update({ is_inside: false, last_status_change: new Date().toISOString() })
                    .eq('is_inside', true);
            } catch (e) {
                // RLS izin vermezse fallback'e geç
            }

            // 3. Fallback: Veritabanında SECURITY DEFINER yetkisine sahip olan process_check_out
            // fonksiyonunu içeride olan her bilet için çalıştır (RLS engelini kesin aşar)
            if (!rpcSucceeded) {
                const { data: insideTickets } = await supabase
                    .from('tickets')
                    .select('ticket_code')
                    .eq('is_inside', true);

                if (insideTickets && insideTickets.length > 0) {
                    await Promise.allSettled(
                        insideTickets.map(t =>
                            supabase.rpc('process_check_out', { p_ticket_code: t.ticket_code })
                        )
                    );
                }
            }

            // 4. Manuel sayaç sapmasını ve yerel durumları anında sıfırla
            setManualOffset(0);
            sessionStorage.removeItem('tedx_manual_inside_offset');
            setCurrentInside(0);
            setAllParticipants(prev => (prev || []).map(p => ({ ...p, is_inside: false })));
            setRecentMovements(prev => (prev || []).map(m => ({ ...m, is_inside: false })));

            setMessage({
                type: 'success',
                text: 'Salondaki kişi sayısı başarıyla 0 olarak sıfırlandı. İçerideki tüm katılımcılar dışarıda olarak güncellendi.'
            });

            // 5. Sunucudaki son veriyi tazele
            await fetchData();
        } catch (err) {
            console.error('Sıfırlama hatası:', err);
            setMessage({
                type: 'error',
                text: 'Salon sıfırlanırken bir hata oluştu: ' + (err.message || '')
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('tedx_admin_pin');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <AdminPinModal 
                onAuthenticated={(enteredPin) => {
                    setPin(enteredPin);
                    setIsAuthenticated(true);
                }} 
            />
        );
    }

    // Doluluk Hesaplamaları (Manuel sayaç ayarı bilet oluşturmaz, sadece anlık salondaki sayıyı revize eder)
    const effectiveInside = Math.max(0, currentInside + manualOffset);
    const capacity = settings.registration_phase === 'phase_1' 
        ? (settings.phase_1_limit || 500) 
        : (settings.max_venue_capacity || settings.phase_2_limit || 600);
    const occupancyPercent = Math.min(100, Math.round((effectiveInside / capacity) * 100));
    const emptySeats = Math.max(0, capacity - effectiveInside);
    // Katılımcı Filtreleme Mantığı
    const filteredParticipants = allParticipants.filter((p) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = !query || 
            (p.full_name && p.full_name.toLowerCase().includes(query)) ||
            (p.email && p.email.toLowerCase().includes(query)) ||
            (p.phone && p.phone.includes(query)) ||
            (p.student_number && p.student_number.includes(query)) ||
            (p.ticket_code && p.ticket_code.toLowerCase().includes(query)) ||
            (p.department_or_role && p.department_or_role.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        if (filterType === 'all') return true;
        if (filterType === 'checked_in') return hasCheckedIn(p);
        if (filterType === 'inside') return p.is_inside === true;
        if (filterType === 'outside') return p.is_inside === false;
        
        const cutoffDate = new Date('2026-10-10T23:59:59.999Z');
        const isExtra = new Date(p.created_at) > cutoffDate;

        if (filterType === 'main_quota') return !isExtra;
        if (filterType === 'extra_quota') return isExtra;

        const typeStr = (p.participant_type || '').toLowerCase();
        if (filterType === 'student') return typeStr.includes('öğrenci');
        if (filterType === 'academic') return typeStr.includes('akademisyen');
        if (filterType === 'staff') return typeStr.includes('personel');
        if (filterType === 'graduate') return typeStr.includes('mezun');
        if (filterType === 'guest') return typeStr.includes('misafir') || typeStr.includes('protokol');

        return true;
    });

    const cutoffDateObj = new Date('2026-10-10T23:59:59.999Z');
    const checkedInCount = allParticipants.filter(hasCheckedIn).length;
    const mainQuotaCount = allParticipants.filter(p => new Date(p.created_at) <= cutoffDateObj).length;
    const extraQuotaCount = allParticipants.filter(p => new Date(p.created_at) > cutoffDateObj).length;
    const studentCount = allParticipants.filter(p => (p.participant_type || '').toLowerCase().includes('öğrenci')).length;
    const academicCount = allParticipants.filter(p => (p.participant_type || '').toLowerCase().includes('akademisyen')).length;
    const staffCount = allParticipants.filter(p => (p.participant_type || '').toLowerCase().includes('personel')).length;
    const gradCount = allParticipants.filter(p => (p.participant_type || '').toLowerCase().includes('mezun')).length;

    return (
        <div 
            style={{ backgroundColor: 'var(--bg-primary)' }} 
            className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto theme-transition selection:bg-[#EB0028] selection:text-white"
        >
            {/* ÜST BAŞLIK & NAVİGASYON */}
            <div 
                style={{ borderColor: 'var(--border-color)' }} 
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-3 theme-transition"
            >
                <div>
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-primary)' }} className="font-black text-xl tracking-tight theme-transition">
                            TEDx<span className="text-[#EB0028]">AYBU</span>
                        </span>
                        <span 
                            style={{ 
                                backgroundColor: 'rgba(235, 0, 40, 0.08)', 
                                borderColor: 'rgba(235, 0, 40, 0.25)', 
                                color: '#EB0028' 
                            }}
                            className="text-xs border px-2.5 py-0.5 rounded-full font-bold"
                        >
                            Yönetici Paneli
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5 theme-transition">
                        Canlı salon doluluk takibi, katılımcı veritabanı ve kapı kontrolü
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                    <button
                        onClick={exportToCSV}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title="Tüm başvuranları Excel (CSV) formatında indir"
                    >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Excel İndir ({allParticipants.length})
                    </button>
                    <Link
                        to="/admin/kapi"
                        className="px-3.5 py-2 rounded-xl bg-[#EB0028] hover:opacity-90 active:scale-[0.98] text-white font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                        <QrCode className="w-3.5 h-3.5" />
                        Kapı QR Okuyucu
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ 
                            backgroundColor: 'var(--bg-card)', 
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)' 
                        }}
                        className="p-2 rounded-xl border hover:text-red-500 transition-all cursor-pointer shadow-sm"
                        title="Çıkış Yap"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* BİLGİLENDİRME MESAJLARI */}
            {message.text && (
                <div className={`p-4 rounded-2xl mb-6 text-xs flex items-center justify-between gap-2 border shadow-sm ${
                    message.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
                }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="opacity-70 hover:opacity-100 cursor-pointer">✕</button>
                </div>
            )}

            {/* 1. CANLI DOLULUK GÖSTERGELERİ (KARTLAR) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Salondaki Kişi */}
                <div 
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: effectiveInside >= capacity ? '#ef4444' : 'var(--border-color)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                    className="p-5 rounded-3xl border relative overflow-hidden theme-transition"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider">Salondaki Kişi</span>
                        <Users className={`w-4 h-4 ${effectiveInside >= capacity ? 'text-red-500 animate-pulse' : 'text-[#EB0028]'}`} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span style={{ color: effectiveInside >= capacity ? '#ef4444' : 'var(--text-primary)' }} className="text-3xl sm:text-4xl font-black">
                            {effectiveInside}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">/ {capacity}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span style={{ color: 'var(--text-secondary)' }} className="text-[11px] font-medium">
                            Canlı Realtime Takip {manualOffset !== 0 ? `(Manuel ${manualOffset > 0 ? `+${manualOffset}` : manualOffset})` : ''}
                        </span>
                    </div>
                </div>

                {/* Boş Koltuk Sayısı */}
                <div 
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                    className="p-5 rounded-3xl border theme-transition"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider">Kalan Boş Koltuk</span>
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">{emptySeats}</span>
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">kişilik yer var</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="mt-3 text-[11px]">
                        {effectiveInside >= capacity ? 'Salon maksimum kapasitede!' : 'Girişler kabul edilebilir.'}
                    </p>
                </div>

                {/* Toplam Kayıtlı Katılımcı */}
                <div 
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                    className="p-5 rounded-3xl border theme-transition"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider">Toplam Kayıtlı</span>
                        <Ticket className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-4xl font-black">{totalRegistered}</span>
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">bilet alındı</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="mt-3 text-[11px]">
                        {settings.registration_phase === 'phase_1' 
                            ? `Ek Kontenjan Kotası: ${settings.phase_1_limit || 500}` 
                            : `Etkinlik Günü Kotası: ${settings.phase_2_limit || 600}`}
                    </p>
                </div>
            </div>

            {/* DOLULUK PROGRESS BAR */}
            <div 
                style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-card)'
                }}
                className="border rounded-3xl p-5 sm:p-6 mb-6 theme-transition"
            >
                <div className="flex items-center justify-between text-xs mb-3">
                    <span style={{ color: 'var(--text-primary)' }} className="font-bold uppercase tracking-wider">Salon Doluluk Oranı</span>
                    <span style={{ color: 'var(--text-primary)' }} className="font-black text-sm">%{occupancyPercent}</span>
                </div>
                <div 
                    style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)' }}
                    className="w-full h-3.5 rounded-full overflow-hidden border"
                >
                    <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                            occupancyPercent >= 95 
                                ? 'bg-red-600' 
                                : occupancyPercent >= 75 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                    />
                </div>
            </div>

            {/* 2. FAZ YÖNETİMİ VE MANUEL KALİBRASYON (2 SÜTUN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* FAZ YÖNETİMİ */}
                <div 
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                    className="border rounded-3xl p-5 sm:p-6 theme-transition"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-[#EB0028]" />
                        <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm uppercase tracking-wider">Kayıt Fazı Yönetimi</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mb-4">
                        Web sitesindeki kayıt formunun kota durumunu tek tıkla değiştirin:
                    </p>

                    <div className="space-y-2.5">
                        {/* Phase 1 - Ek Kontenjan */}
                        <button
                            onClick={() => handlePhaseChange('phase_1')}
                            disabled={actionLoading}
                            style={{
                                backgroundColor: settings.registration_phase === 'phase_1' && settings.is_registration_active 
                                    ? 'rgba(235, 0, 40, 0.08)' 
                                    : 'var(--bg-card-alt)',
                                borderColor: settings.registration_phase === 'phase_1' && settings.is_registration_active 
                                    ? '#EB0028' 
                                    : 'var(--border-color)'
                            }}
                            className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm hover:opacity-90"
                        >
                            <div>
                                <div className="text-xs font-bold flex items-center gap-2">
                                    <span style={{ color: 'var(--text-primary)' }}>Ek Kontenjan Modu</span>
                                    {settings.registration_phase === 'phase_1' && settings.is_registration_active && (
                                        <span className="px-2 py-0.5 rounded-full bg-[#EB0028] text-[10px] text-white font-bold">AKTİF</span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] mt-0.5">Maksimum 500 kişiye kadar açar</p>
                            </div>
                        </button>

                        {/* Phase 2 - Etkinlik Günü Kaydı */}
                        <button
                            onClick={() => handlePhaseChange('phase_2')}
                            disabled={actionLoading}
                            style={{
                                backgroundColor: settings.registration_phase === 'phase_2' && settings.is_registration_active 
                                    ? 'rgba(59, 130, 246, 0.08)' 
                                    : 'var(--bg-card-alt)',
                                borderColor: settings.registration_phase === 'phase_2' && settings.is_registration_active 
                                    ? '#3b82f6' 
                                    : 'var(--border-color)'
                            }}
                            className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm hover:opacity-90"
                        >
                            <div>
                                <div className="text-xs font-bold flex items-center gap-2">
                                    <span style={{ color: 'var(--text-primary)' }}>Etkinlik Günü Kaydı (16 Ekim)</span>
                                    {settings.registration_phase === 'phase_2' && settings.is_registration_active && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-[10px] text-white font-bold">AKTİF</span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] mt-0.5">Maksimum 600 kişiye kadar açar</p>
                            </div>
                        </button>

                        {/* Closed */}
                        <button
                            onClick={() => handlePhaseChange('closed')}
                            disabled={actionLoading}
                            style={{
                                backgroundColor: !settings.is_registration_active || settings.registration_phase === 'closed' 
                                    ? 'var(--bg-card-alt)' 
                                    : 'var(--bg-card-alt)',
                                borderColor: !settings.is_registration_active || settings.registration_phase === 'closed' 
                                    ? 'var(--text-muted)' 
                                    : 'var(--border-color)'
                            }}
                            className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm hover:opacity-90"
                        >
                            <div>
                                <div className="text-xs font-bold flex items-center gap-2">
                                    <span style={{ color: 'var(--text-primary)' }}>Kayıtları Tamamen Kapat</span>
                                    {(!settings.is_registration_active || settings.registration_phase === 'closed') && (
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-600 text-[10px] text-white font-bold">KAPALI</span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] mt-0.5">Web sitesinde formu kilitler</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* MANUEL SAYAÇ KALİBRASYONU */}
                <div 
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                    className="border rounded-3xl p-5 sm:p-6 flex flex-col justify-between theme-transition"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sliders className="w-4 h-4 text-emerald-500" />
                            <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm uppercase tracking-wider">Manuel Sayaç Kalibrasyonu</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mb-4 leading-relaxed">
                            Çıkarken QR okutmayı unutan katılımcılar için salondaki anlık sayıyı elle revize edin:
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => handleManualAdjust(-1)}
                            disabled={effectiveInside <= 0}
                            style={{ 
                                backgroundColor: 'var(--bg-card-alt)', 
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                            className="py-4 px-4 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-sm hover:opacity-80 active:scale-95"
                        >
                            <MinusCircle className="w-6 h-6 text-red-500" />
                            <span>Manuel Azalt (-1)</span>
                        </button>

                        <button
                            onClick={() => handleManualAdjust(1)}
                            disabled={effectiveInside >= capacity}
                            style={{ 
                                backgroundColor: 'var(--bg-card-alt)', 
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                            className="py-4 px-4 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-sm hover:opacity-80 active:scale-95"
                        >
                            <PlusCircle className="w-6 h-6 text-emerald-500" />
                            <span>Manuel Arttır (+1)</span>
                        </button>
                    </div>

                    {/* Salondaki Kişileri Sıfırla Butonu */}
                    <button
                        onClick={handleResetInside}
                        disabled={actionLoading}
                        style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            borderColor: 'rgba(239, 68, 68, 0.25)',
                            color: '#ef4444'
                        }}
                        className="mt-3 w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-sm hover:bg-red-500 hover:text-white"
                        title="İçerideki sayıyı 0 olarak sıfırlar"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Salondaki Kişi Sayısını Sıfırla (0'a Çek)</span>
                    </button>
                </div>
            </div>

            {/* 3. KATILIMCI DİZİNİ VE KAPI HAREKETLERİ (SEKMELİ) */}
            <div 
                style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-card)'
                }}
                className="border rounded-3xl p-5 sm:p-6 theme-transition"
            >
                {/* SEKME BAŞLIKLARI VE AKSİYONLAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4 mb-4">
                    {/* Sekme Butonları */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('list')}
                            style={{
                                backgroundColor: activeTab === 'list' ? '#EB0028' : 'var(--bg-card-alt)',
                                color: activeTab === 'list' ? '#ffffff' : 'var(--text-secondary)',
                                borderColor: activeTab === 'list' ? '#EB0028' : 'var(--border-color)'
                            }}
                            className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                        >
                            <Users className="w-3.5 h-3.5" />
                            <span>Tüm Başvurular ({allParticipants.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('movements')}
                            style={{
                                backgroundColor: activeTab === 'movements' ? '#EB0028' : 'var(--bg-card-alt)',
                                color: activeTab === 'movements' ? '#ffffff' : 'var(--text-secondary)',
                                borderColor: activeTab === 'movements' ? '#EB0028' : 'var(--border-color)'
                            }}
                            className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                        >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Kapı Hareketleri ({recentMovements.length})</span>
                        </button>
                    </div>

                    {/* Sağ Taraf: Excel İndir & Yenile Butonları */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Sadece QR Giriş Yapanlar Excel */}
                        <button
                            onClick={exportCheckedInToCSV}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="QR ile giriş yapmış tüm katılımcıları isim, soyisim ve e-postalarıyla Excel olarak indir"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            <span>QR Giriş Yapanlar Excel ({checkedInCount})</span>
                        </button>

                        {/* 2. Tüm Başvuranlar Excel */}
                        <button
                            onClick={exportToCSV}
                            style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            className="px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:opacity-80 active:scale-95"
                            title="Tüm başvuranların listesini Excel (CSV) olarak indir"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tüm Liste ({allParticipants.length})</span>
                        </button>

                        <button
                            onClick={fetchData}
                            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card-alt)' }}
                            className="p-2 rounded-xl border hover:text-[#EB0028] transition-colors cursor-pointer shadow-sm"
                            title="Verileri Yenile"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* SEKME 1: TÜM KATILIMCILAR LİSTESİ */}
                {activeTab === 'list' && (
                    <div className="space-y-4">
                        {/* Arama ve Filtreleme Çubuğu */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            {/* Arama Kutusu */}
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="İsim, e-posta, telefon, öğrenci no veya bilet kodu ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-card-alt)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#EB0028] theme-transition"
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Kategori Filtre Butonları */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                                <button
                                    onClick={() => setFilterType('all')}
                                    style={{
                                        backgroundColor: filterType === 'all' ? 'var(--text-primary)' : 'var(--bg-card-alt)',
                                        color: filterType === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                    className="px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap"
                                >
                                    Tümü ({allParticipants.length})
                                </button>
                                <button
                                    onClick={() => setFilterType('checked_in')}
                                    style={{
                                        backgroundColor: filterType === 'checked_in' ? '#059669' : 'var(--bg-card-alt)',
                                        color: filterType === 'checked_in' ? '#ffffff' : 'var(--text-secondary)',
                                        borderColor: filterType === 'checked_in' ? '#059669' : 'var(--border-color)'
                                    }}
                                    className="px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5"
                                    title="Kapıda QR kod okutarak giriş yapmış katılımcılar"
                                >
                                    <QrCode className="w-3.5 h-3.5" />
                                    <span>QR Giriş Yapanlar ({checkedInCount})</span>
                                </button>
                                <button
                                    onClick={() => setFilterType('main_quota')}
                                    style={{
                                        backgroundColor: filterType === 'main_quota' ? '#3b82f6' : 'var(--bg-card-alt)',
                                        color: filterType === 'main_quota' ? '#ffffff' : 'var(--text-secondary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                    className="px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors whitespace-nowrap"
                                    title="10 Ekim ve öncesinde alınan biletler"
                                >
                                    🎯 Asıl Kontenjan ({mainQuotaCount})
                                </button>
                                <button
                                    onClick={() => setFilterType('extra_quota')}
                                    style={{
                                        backgroundColor: filterType === 'extra_quota' ? '#f59e0b' : 'var(--bg-card-alt)',
                                        color: filterType === 'extra_quota' ? '#ffffff' : 'var(--text-secondary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                    className="px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors whitespace-nowrap"
                                    title="14 Ekim ve sonrasında ek kontenjandan alınan biletler"
                                >
                                    ⚡ Ek Kontenjan ({extraQuotaCount})
                                </button>
                                <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 mx-1 flex-shrink-0"></div>
                                <button
                                    onClick={() => setFilterType('student')}
                                    style={{
                                        backgroundColor: filterType === 'student' ? '#EB0028' : 'var(--bg-card-alt)',
                                        color: filterType === 'student' ? '#ffffff' : 'var(--text-secondary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                    className="px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap"
                                >
                                    Öğrenci ({studentCount})
                                </button>
                                {staffCount > 0 && (
                                    <button
                                        onClick={() => setFilterType('staff')}
                                        style={{
                                            backgroundColor: filterType === 'staff' ? '#3b82f6' : 'var(--bg-card-alt)',
                                            color: filterType === 'staff' ? '#ffffff' : 'var(--text-secondary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap"
                                    >
                                        Personel ({staffCount})
                                    </button>
                                )}
                                {academicCount > 0 && (
                                    <button
                                        onClick={() => setFilterType('academic')}
                                        style={{
                                            backgroundColor: filterType === 'academic' ? '#8b5cf6' : 'var(--bg-card-alt)',
                                            color: filterType === 'academic' ? '#ffffff' : 'var(--text-secondary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap"
                                    >
                                        Akademisyen ({academicCount})
                                    </button>
                                )}
                                {gradCount > 0 && (
                                    <button
                                        onClick={() => setFilterType('graduate')}
                                        style={{
                                            backgroundColor: filterType === 'graduate' ? '#10b981' : 'var(--bg-card-alt)',
                                            color: filterType === 'graduate' ? '#ffffff' : 'var(--text-secondary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap"
                                    >
                                        Mezun ({gradCount})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Katılımcı Tablosu */}
                        {filteredParticipants.length === 0 ? (
                            <div className="py-12 text-center">
                                <Users className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-50" />
                                <p style={{ color: 'var(--text-muted)' }} className="text-xs">
                                    {searchTerm ? 'Aramanıza uygun başvuru bulunamadı.' : 'Henüz kayıtlı başvuru bulunmuyor.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <table className="w-full text-left text-xs">
                                    <thead style={{ backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' }} className="border-b border-zinc-200 dark:border-zinc-800 uppercase font-mono text-[10px] tracking-wider">
                                        <tr>
                                            <th className="py-3 px-3.5 text-center w-12">#</th>
                                            <th className="py-3 px-3.5">Katılımcı & Kod</th>
                                            <th className="py-3 px-3.5">Kategori & Bölüm/Görev</th>
                                            <th className="py-3 px-3.5">Öğrenci No</th>
                                            <th className="py-3 px-3.5">İletişim (Mail / Tel)</th>
                                            <th className="py-3 px-3.5 text-center">Kapı Durumu</th>
                                            <th className="py-3 px-3.5 text-right">Kayıt Zamanı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {filteredParticipants.map((item, idx) => (
                                            <tr 
                                                key={item.id}
                                                style={{ backgroundColor: 'transparent' }}
                                                className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <td className="py-3 px-3.5 text-center font-mono text-zinc-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-3.5">
                                                    <p style={{ color: 'var(--text-primary)' }} className="font-bold text-xs">
                                                        {item.full_name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="inline-block px-2 py-0.5 bg-[#EB0028]/10 text-[#EB0028] font-mono text-[10px] rounded font-bold">
                                                            {item.ticket_code}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedQR(item)}
                                                            className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-[#EB0028] text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                                            title="QR Kodu Görüntüle ve İndir"
                                                        >
                                                            <QrCode className="w-3 h-3" />
                                                            <span>QR Gör</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3.5">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span style={{ color: 'var(--text-primary)' }} className="font-medium capitalize">
                                                            {item.participant_type || 'Katılımcı'}
                                                        </span>
                                                        {new Date(item.created_at) >= new Date('2026-10-16T00:00:00.000+03:00') ? (
                                                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                                                                Etkinlik Günü
                                                            </span>
                                                        ) : new Date(item.created_at) > new Date('2026-10-10T23:59:59.999Z') ? (
                                                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-bold">
                                                                Ek Kontenjan
                                                            </span>
                                                        ) : (
                                                            <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-bold">
                                                                Asıl Kontenjan
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ color: 'var(--text-muted)' }} className="text-[11px] block">
                                                        {item.department_or_role || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3.5 font-mono">
                                                    {item.student_number ? (
                                                        <span style={{ color: 'var(--text-primary)' }}>{item.student_number}</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3.5">
                                                    <p style={{ color: 'var(--text-primary)' }} className="font-mono text-[11px]">
                                                        {item.email}
                                                    </p>
                                                    <p style={{ color: 'var(--text-muted)' }} className="font-mono text-[11px]">
                                                        {item.phone || '-'}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-3.5 text-center">
                                                    {item.is_inside ? (
                                                        <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                                            İÇERİDE
                                                        </span>
                                                    ) : hasCheckedIn(item) ? (
                                                        <span 
                                                            className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                                                            title={`Kapıda QR okutuldu. Son kapı saati: ${item.last_status_change ? new Date(item.last_status_change).toLocaleTimeString('tr-TR') : '-'}`}
                                                        >
                                                            GİRİŞ YAPILDI
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                                                            GELMEDİ
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3.5 text-right font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(item.created_at).toLocaleString('tr-TR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* SEKME 2: KAPI SON HAREKETLER LİSTESİ */}
                {activeTab === 'movements' && (
                    <div>
                        {recentMovements.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }} className="text-xs py-8 text-center">Henüz bir kapı girişi veya çıkışı kaydedilmedi.</p>
                        ) : (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-850">
                                {recentMovements.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                                        <div>
                                            <p style={{ color: 'var(--text-primary)' }} className="font-bold">{item.full_name}</p>
                                            <p style={{ color: 'var(--text-muted)' }} className="font-mono text-[11px]">
                                                {item.student_number || item.participant_type || 'Katılımcı'} • {item.ticket_code}
                                            </p>
                                        </div>
                                        <div className="text-right flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                                item.is_inside 
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                                                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                            }`}>
                                                {item.is_inside ? 'İÇERİDE' : 'DIŞARIDA'}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }} className="text-[11px] font-mono hidden sm:inline">
                                                {new Date(item.last_status_change).toLocaleTimeString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* QR GÖRÜNTÜLEME VE İNDİRME MODALI */}
            {selectedQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        style={{ 
                            backgroundColor: 'var(--bg-card)', 
                            borderColor: 'var(--border-color)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }} 
                        className="w-full max-w-sm rounded-3xl p-6 border text-center relative theme-transition animate-in zoom-in-95 duration-200"
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedQR(null)}
                            style={{ color: 'var(--text-muted)' }}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            title="Kapat"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="inline-flex p-3 rounded-2xl bg-[#EB0028]/10 text-[#EB0028] mb-3">
                            <QrCode className="w-6 h-6" />
                        </div>

                        <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-black tracking-tight">
                            {selectedQR.full_name}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5 capitalize">
                            {selectedQR.participant_type || 'Katılımcı'} {selectedQR.department_or_role ? `• ${selectedQR.department_or_role}` : ''}
                        </p>

                        <div className="my-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-inner flex flex-col items-center justify-center">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(selectedQR.ticket_code)}`}
                                alt={`QR Kod - ${selectedQR.ticket_code}`}
                                className="w-48 h-48 object-contain"
                            />
                            <span className="mt-3 font-mono font-black text-xs text-zinc-900 tracking-wider bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-300">
                                {selectedQR.ticket_code}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <a
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(selectedQR.ticket_code)}`}
                                download={`${selectedQR.full_name}_${selectedQR.ticket_code}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Görseli İndir / Yeni Sekmede Aç</span>
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(selectedQR.ticket_code)}`;
                                    navigator.clipboard.writeText(url);
                                    alert('QR Kod bağlantısı panoya kopyalandı! Doğrudan WhatsApp veya SMS ile gönderebilirsiniz.');
                                }}
                                style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                className="w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:opacity-80"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Görsel Bağlantısını Kopyala</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
