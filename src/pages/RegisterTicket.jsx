import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendTicketEmail } from '../lib/sendTicketEmail';
import { 
    Ticket, 
    AlertCircle, 
    User, 
    Mail, 
    Hash, 
    Phone,
    BookOpen,
    Briefcase,
    GraduationCap,
    Award,
    Loader2, 
    Sparkles,
    RefreshCw,
    ShieldAlert,
    MailCheck,
    Inbox,
    Home,
    Building2
} from 'lucide-react';

export default function RegisterTicket() {
    // Sayfa Durumları
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Etkinlik ve Kota Ayarları
    const [settings, setSettings] = useState({
        is_registration_active: true,
        registration_phase: 'phase_1',
        phase_1_limit: 300,
        phase_2_limit: 600,
        max_venue_capacity: 600
    });
    const [ticketCount, setTicketCount] = useState(0);

    // Katılımcı Türü: 'student' | 'staff' | 'academic' | 'alumni'
    const [participantType, setParticipantType] = useState('student');

    // Form Değerleri
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        studentNumber: '',
        departmentOrRole: ''
    });

    // Kayıt tamamlandıktan sonra oluşturulan bilet
    const [createdTicket, setCreatedTicket] = useState(null);

    // 1. Ayarları ve Mevcut Bilet Sayısını Çek
    const fetchStatusAndSettings = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const { data: settingsData, error: settingsError } = await supabase
                .from('event_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (settingsError) throw settingsError;
            if (settingsData) {
                setSettings(settingsData);
            }

            const { count, error: countError } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;
            setTicketCount(count || 0);

        } catch (err) {
            console.error('Veri çekme hatası:', err);
            setErrorMessage('Etkinlik bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyiniz.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatusAndSettings();

        // Gerçek zamanlı güncellemeler (Kontenjan doluluk takibi)
        const channel = supabase
            .channel('public:tickets_and_settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
                fetchStatusAndSettings();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'event_settings' }, () => {
                fetchStatusAndSettings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 2. Kota ve Faz Kontrol Mantığı
    const isPhase1Full = settings.registration_phase === 'phase_1' && ticketCount >= settings.phase_1_limit;
    const isPhase2Full = settings.registration_phase === 'phase_2' && ticketCount >= settings.phase_2_limit;
    const isRegistrationClosed = !settings.is_registration_active || settings.registration_phase === 'closed';
    const isQuotaExceeded = isPhase1Full || isPhase2Full;
    const isFormDisabled = isRegistrationClosed || isQuotaExceeded || submitting;

    // 3. Benzersiz Bilet Kodu Üretici (Örn: TEDX-9K2L8A)
    const generateTicketCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `TEDX-${code}`;
    };

    // Telefon Numarası Formatlayıcı (05XX XXX XX XX)
    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = raw;
        if (raw.startsWith('0')) {
            if (raw.length > 4 && raw.length <= 7) {
                formatted = `${raw.slice(0, 4)} ${raw.slice(4)}`;
            } else if (raw.length > 7 && raw.length <= 9) {
                formatted = `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`;
            } else if (raw.length > 9) {
                formatted = `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7, 9)} ${raw.slice(9, 11)}`;
            }
        } else {
            if (raw.length > 3 && raw.length <= 6) {
                formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
            } else if (raw.length > 6 && raw.length <= 8) {
                formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
            } else if (raw.length > 8) {
                formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`;
            }
        }
        setFormData(prev => ({ ...prev, phone: formatted }));
    };

    // 4. Form Gönderimi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (isFormDisabled) return;

        // Validasyonlar
        const trimmedName = formData.fullName.trim();
        const trimmedEmail = formData.email.trim().toLowerCase();
        const trimmedPhone = formData.phone.trim();
        const trimmedNumber = formData.studentNumber.trim();
        const trimmedDeptOrRole = formData.departmentOrRole.trim();

        // 1. Genel Boşluk Kontrolü
        if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedDeptOrRole) {
            setErrorMessage('Lütfen tüm zorunlu alanları eksiksiz doldurunuz.');
            return;
        }

        // 2. Telefon Numarası Kontrolü (En az 10 rakam)
        const digitsOnlyPhone = trimmedPhone.replace(/\D/g, '');
        if (digitsOnlyPhone.length < 10) {
            setErrorMessage('Lütfen geçerli bir telefon numarası giriniz.');
            return;
        }

        // 3. E-posta Format Kontrolü
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz (Örn: isim@aybu.edu.tr veya ornek@gmail.com).');
            return;
        }

        // 4. Öğrenci İse 11 Hane ve Öğrenci No Zorunluluğu
        if (participantType === 'student') {
            if (!/^\d{11}$/.test(trimmedNumber)) {
                setErrorMessage('Öğrenci numarası tam 11 haneli bir sayı olmalıdır.');
                return;
            }
        }

        setSubmitting(true);

        try {
            // 5. Mükerrer E-posta Kontrolü (Her mail sadece 1 bilet)
            const { data: existingEmail } = await supabase
                .from('tickets')
                .select('ticket_code')
                .ilike('email', trimmedEmail)
                .maybeSingle();

            if (existingEmail) {
                setErrorMessage('Bu e-posta adresiyle daha önce bilet alınmıştır. Her katılımcı yalnızca 1 bilet alabilir.');
                setSubmitting(false);
                return;
            }

            // 6. Mükerrer Öğrenci No Kontrolü (Sadece öğrenciler için)
            if (participantType === 'student') {
                const { data: existingStudent } = await supabase
                    .from('tickets')
                    .select('ticket_code')
                    .eq('student_number', trimmedNumber)
                    .maybeSingle();

                if (existingStudent) {
                    setErrorMessage('Bu öğrenci numarasıyla daha önce bilet alınmıştır. Her öğrenci yalnızca 1 bilet alabilir.');
                    setSubmitting(false);
                    return;
                }
            }

            const newTicketCode = generateTicketCode();

            // Supabase'e ekle
            const insertPayload = {
                ticket_code: newTicketCode,
                full_name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                department_or_role: trimmedDeptOrRole,
                participant_type: participantType === 'student' ? 'aybü öğrencisi' 
                    : participantType === 'staff' ? 'aybü akademik/idari personel'
                    : participantType === 'academic' ? 'aybü akademisyeni'
                    : 'aybü mezunu',
                student_number: participantType === 'student' ? trimmedNumber : null,
                is_inside: false
            };

            const { data, error } = await supabase
                .from('tickets')
                .insert([insertPayload])
                .select()
                .single();

            if (error) {
                throw new Error(error.message || 'Kayıt sırasında bir hata oluştu.');
            }

            // Başarılı bilet kaydını state'e ata
            setCreatedTicket(data);
            setTicketCount(prev => prev + 1);

            // E-posta gönderimini tetikle (QR sadece e-postaya gönderilir)
            sendTicketEmail({
                to_email: trimmedEmail,
                to_name: trimmedName,
                student_number: participantType === 'student' ? trimmedNumber : trimmedDeptOrRole,
                ticket_code: data.ticket_code || newTicketCode
            }).catch(e => console.error('E-posta gönderim hatası:', e));

        } catch (err) {
            console.error('Kayıt hatası:', err);
            if (err.message.includes('e-posta') || err.message.includes('email')) {
                setErrorMessage('Bu e-posta adresiyle daha önce bilet alınmıştır. Her katılımcı yalnızca 1 bilet alabilir.');
            } else if (err.message.includes('öğrenci') || err.message.includes('student_number')) {
                setErrorMessage('Bu öğrenci numarasıyla daha önce bilet alınmıştır. Her öğrenci yalnızca 1 bilet alabilir.');
            } else if (err.message.includes('kotası') || err.message.includes('kapalıdır') || err.message.includes('dönemi')) {
                setErrorMessage(err.message);
            } else if (err.message.includes('duplicate key') || err.message.includes('ticket_code')) {
                setErrorMessage('Bilet kodu çakışması yaşandı, lütfen tekrar deneyiniz.');
            } else {
                setErrorMessage(err.message || 'Kayıt işlemi gerçekleştirilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const currentLimit = settings.registration_phase === 'phase_1' 
        ? settings.phase_1_limit 
        : settings.phase_2_limit;

    // Katılımcı Türüne Göre Dinamik Soru Başlığı ve İpucu
    const getDynamicFieldConfig = () => {
        switch (participantType) {
            case 'student':
                return {
                    label: 'Bölümünüz',
                    placeholder: 'Örn: Bilgisayar Mühendisliği, Hukuk, Tıp...',
                    icon: BookOpen
                };
            case 'staff':
                return {
                    label: 'Göreviniz / Biriminiz',
                    placeholder: 'Örn: Öğrenci İşleri Daire Bşk., Fakülte Sekreteri, Kütüphaneci...',
                    icon: Briefcase
                };
            case 'academic':
                return {
                    label: 'Bölümünüz / Anabilim Dalı',
                    placeholder: 'Örn: Yönetim Bilişim Sistemleri, Makine Müh...',
                    icon: Award
                };
            case 'alumni':
                return {
                    label: 'Bölümünüz / Mesleğiniz',
                    placeholder: 'Örn: Endüstri Mühendisliği / Yazılım Geliştirici...',
                    icon: GraduationCap
                };
            default:
                return {
                    label: 'Bölümünüz',
                    placeholder: 'Bölümünüzü yazınız',
                    icon: BookOpen
                };
        }
    };

    const dynamicField = getDynamicFieldConfig();
    const DynamicIcon = dynamicField.icon;

    return (
        <div 
            style={{ backgroundColor: 'var(--bg-primary)' }} 
            className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 theme-transition selection:bg-[#EB0028] selection:text-white"
        >
            {/* Arka Plan Efekti */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#EB0028]/5 rounded-full blur-[128px]"></div>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Başlık Alanı */}
                <div className="text-center mb-10">
                    <div 
                        style={{ 
                            backgroundColor: 'rgba(235, 0, 40, 0.08)', 
                            borderColor: 'rgba(235, 0, 40, 0.25)', 
                            color: '#EB0028' 
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>TEDxAYBU 2026 Giriş Bileti</span>
                    </div>
                    <h1 
                        style={{ color: 'var(--text-primary)' }} 
                        className="text-3xl sm:text-5xl font-black tracking-tight mb-3 theme-transition"
                    >
                        {settings.registration_phase === 'phase_1' ? (
                            <>Ek Kontenjan <span style={{ color: '#EB0028' }}>Formu</span></>
                        ) : settings.registration_phase === 'phase_2' ? (
                            <>Etkinlik Günü <span style={{ color: '#EB0028' }}>Kayıt Formu</span></>
                        ) : (
                            <>Bilet Kayıt <span style={{ color: '#EB0028' }}>Formu</span></>
                        )}
                    </h1>
                    <p 
                        style={{ color: 'var(--text-secondary)' }} 
                        className="text-sm sm:text-base max-w-md mx-auto theme-transition"
                    >
                        Etkinliğe katılım sağlamak için bilgilerinizi eksiksiz doldurarak dijital giriş biletinizi alabilirsiniz.
                    </p>
                </div>

                {/* Yükleniyor Durumu */}
                {loading ? (
                    <div 
                        style={{ 
                            backgroundColor: 'var(--bg-card)', 
                            border: '1px solid var(--border-color)' 
                        }}
                        className="flex flex-col items-center justify-center p-12 rounded-3xl shadow-sm backdrop-blur-md theme-transition"
                    >
                        <Loader2 className="w-8 h-8 text-[#EB0028] animate-spin mb-3" />
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm theme-transition">
                            Etkinlik kotaları ve faz durumu kontrol ediliyor...
                        </p>
                    </div>
                ) : createdTicket ? (
                    /* ========================================================================= */
                    /* 3. BAŞARILI KAYIT BİLGİLENDİRME (QR SADECE E-POSTAYA GÖNDERİLİR)          */
                    /* ========================================================================= */
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        {/* Başarı Kartı */}
                        <div 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-card)'
                            }}
                            className="rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden theme-transition"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                            {/* İkon */}
                            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                <MailCheck className="w-10 h-10" />
                            </div>

                            <h2 
                                style={{ color: 'var(--text-primary)' }} 
                                className="text-2xl sm:text-3xl font-black tracking-tight mb-2 theme-transition"
                            >
                                Kaydınız Başarıyla Alındı!
                            </h2>
                            <p 
                                style={{ color: 'var(--text-secondary)' }} 
                                className="text-sm max-w-md mx-auto mb-6 theme-transition"
                            >
                                Giriş biletiniz ve kapıda okutmanız gereken <strong style={{ color: 'var(--text-primary)' }}>QR kodunuz</strong> e-posta adresinize gönderildi.
                            </p>

                            {/* E-posta Vurgu Kutusu */}
                            <div 
                                style={{ 
                                    backgroundColor: 'var(--bg-card-alt)', 
                                    border: '1px solid var(--border-color)' 
                                }}
                                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-mono text-emerald-600 dark:text-emerald-400 mb-8 max-w-full overflow-hidden theme-transition"
                            >
                                <Inbox className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{createdTicket.email}</span>
                            </div>

                            {/* Özet Katılımcı Bilgisi */}
                            <div 
                                style={{ 
                                    backgroundColor: 'var(--bg-card-alt)', 
                                    border: '1px solid var(--border-color)' 
                                }}
                                className="max-w-md mx-auto rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3 theme-transition"
                            >
                                <div 
                                    style={{ borderColor: 'var(--border-subtle)' }} 
                                    className="flex items-center justify-between pb-3 border-b text-xs"
                                >
                                    <span style={{ color: 'var(--text-muted)' }} className="font-semibold uppercase tracking-wider">Katılımcı</span>
                                    <span style={{ color: 'var(--text-primary)' }} className="font-bold text-sm">{createdTicket.full_name}</span>
                                </div>
                                <div 
                                    style={{ borderColor: 'var(--border-subtle)' }} 
                                    className="flex items-center justify-between pb-3 border-b text-xs"
                                >
                                    <span style={{ color: 'var(--text-muted)' }} className="font-semibold uppercase tracking-wider">Katılımcı Türü</span>
                                    <span style={{ color: 'var(--text-primary)' }} className="font-semibold capitalize">{createdTicket.participant_type || 'AYBÜ Katılımcısı'}</span>
                                </div>
                                {createdTicket.student_number && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span style={{ color: 'var(--text-muted)' }} className="font-semibold uppercase tracking-wider">Öğrenci No</span>
                                        <span style={{ color: 'var(--text-primary)' }} className="font-mono font-semibold">{createdTicket.student_number}</span>
                                    </div>
                                )}
                            </div>

                            {/* Güvenlik Hatırlatması */}
                            <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left text-xs text-amber-800 dark:text-amber-300 leading-relaxed mb-6">
                                ⚠️ <strong>Güvenlik ve Doğrulama:</strong> Etkinlik salonu girişinde ve çıkışında okutmanız gereken <strong>QR kodunuz e-posta adresinize gönderilmiştir</strong>. Lütfen gelen kutunuzu ve gereksiz (spam) klasörünüzü kontrol ediniz.
                            </div>

                            {/* Aksiyon Butonları */}
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <Link
                                    to="/"
                                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#EB0028] hover:opacity-90 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Anasayfaya Dön
                                </Link>

                                <button
                                    onClick={() => {
                                        setCreatedTicket(null);
                                        setFormData({ fullName: '', email: '', phone: '', studentNumber: '', departmentOrRole: '' });
                                        fetchStatusAndSettings();
                                    }}
                                    style={{ 
                                        backgroundColor: 'var(--bg-card-alt)', 
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                    className="py-3.5 px-6 rounded-xl hover:opacity-80 font-semibold text-sm transition-all flex items-center justify-center gap-2 theme-transition"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Yeni Kayıt Yap
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ========================================================================= */
                    /* 1 & 2. FORM VE KONTENJAN DURUMU                                           */
                    /* ========================================================================= */
                    <div className="space-y-6">
                        {/* 1. KOTA / FAZ BİLGİLENDİRME KARTLARI */}
                        {isRegistrationClosed ? (
                            <div 
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                                className="p-5 rounded-2xl flex items-start gap-3.5 text-amber-600 dark:text-amber-400 theme-transition"
                            >
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm theme-transition">Kayıtlar Şu An Kapalıdır</h4>
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 theme-transition">
                                        Etkinlik bilet kayıtları geçici olarak durdurulmuştur. Duyurular için bizi takip edin.
                                    </p>
                                </div>
                            </div>
                        ) : isPhase1Full ? (
                            <div 
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(235, 0, 40, 0.4)' }}
                                className="p-5 rounded-2xl flex items-start gap-3.5 shadow-sm theme-transition"
                            >
                                <AlertCircle className="w-5 h-5 text-[#EB0028] flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm theme-transition">Ek Kontenjan Dolmuştur</h4>
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 leading-relaxed theme-transition">
                                        Ek kontenjanımız dolmuştur. Kalan kontenjanlar etkinlik günü tekrar açılacaktır.
                                    </p>
                                </div>
                            </div>
                        ) : isPhase2Full ? (
                            <div 
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(235, 0, 40, 0.4)' }}
                                className="p-5 rounded-2xl flex items-start gap-3.5 shadow-sm theme-transition"
                            >
                                <AlertCircle className="w-5 h-5 text-[#EB0028] flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm theme-transition">Tüm Kontenjan Dolmuştur</h4>
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 theme-transition">
                                        Genel etkinlik kayıt kontenjanımız dolmuştur. İlginiz için teşekkür ederiz.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Açık Durumda Kontenjan Rozeti */
                            <div 
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-card)'
                                }}
                                className="p-4 rounded-2xl flex items-center justify-between text-xs theme-transition"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span style={{ color: 'var(--text-primary)' }} className="font-semibold theme-transition">
                                        {settings.registration_phase === 'phase_1' ? 'Ek Kontenjan Aktif' : 'Etkinlik Günü Kaydı Aktif'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                    <span>Kayıtlar Açık</span>
                                </div>
                            </div>
                        )}

                        {/* Hata Mesajı Kutusu */}
                        {errorMessage && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* KAYIT FORMU */}
                        <form 
                            onSubmit={handleSubmit}
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-card)'
                            }}
                            className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg backdrop-blur-xl theme-transition"
                        >
                            {/* KATILIMCI TÜRÜ SEÇİMİ (4 SEÇENEK) */}
                            <div>
                                <label 
                                    style={{ color: 'var(--text-primary)' }} 
                                    className="block text-xs font-bold uppercase tracking-wider mb-3 theme-transition"
                                >
                                    Katılımcı Türü <span className="text-[#EB0028]">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {/* 1. AYBÜ Öğrencisi */}
                                    <button
                                        type="button"
                                        onClick={() => { setParticipantType('student'); setErrorMessage(''); }}
                                        style={{
                                            backgroundColor: participantType === 'student' ? 'rgba(235, 0, 40, 0.08)' : 'var(--bg-card-alt)',
                                            borderColor: participantType === 'student' ? '#EB0028' : 'var(--border-color)'
                                        }}
                                        className="p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer group theme-transition"
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            participantType === 'student' ? 'bg-[#EB0028] text-white' : 'bg-black/5 dark:bg-white/5 text-zinc-500'
                                        }`}>
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span style={{ color: participantType === 'student' ? '#EB0028' : 'var(--text-primary)' }} className="text-xs font-bold block">
                                                AYBÜ Öğrencisi
                                            </span>
                                        </div>
                                    </button>

                                    {/* 2. AYBÜ Akademik / İdari Personel */}
                                    <button
                                        type="button"
                                        onClick={() => { setParticipantType('staff'); setErrorMessage(''); }}
                                        style={{
                                            backgroundColor: participantType === 'staff' ? 'rgba(235, 0, 40, 0.08)' : 'var(--bg-card-alt)',
                                            borderColor: participantType === 'staff' ? '#EB0028' : 'var(--border-color)'
                                        }}
                                        className="p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer group theme-transition"
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            participantType === 'staff' ? 'bg-[#EB0028] text-white' : 'bg-black/5 dark:bg-white/5 text-zinc-500'
                                        }`}>
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span style={{ color: participantType === 'staff' ? '#EB0028' : 'var(--text-primary)' }} className="text-xs font-bold block">
                                                İdari Personel
                                            </span>
                                        </div>
                                    </button>

                                    {/* 3. AYBÜ Akademisyeni */}
                                    <button
                                        type="button"
                                        onClick={() => { setParticipantType('academic'); setErrorMessage(''); }}
                                        style={{
                                            backgroundColor: participantType === 'academic' ? 'rgba(235, 0, 40, 0.08)' : 'var(--bg-card-alt)',
                                            borderColor: participantType === 'academic' ? '#EB0028' : 'var(--border-color)'
                                        }}
                                        className="p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer group theme-transition"
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            participantType === 'academic' ? 'bg-[#EB0028] text-white' : 'bg-black/5 dark:bg-white/5 text-zinc-500'
                                        }`}>
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span style={{ color: participantType === 'academic' ? '#EB0028' : 'var(--text-primary)' }} className="text-xs font-bold block">
                                                AYBÜ Akademisyeni
                                            </span>
                                        </div>
                                    </button>

                                    {/* 4. AYBÜ Mezunu */}
                                    <button
                                        type="button"
                                        onClick={() => { setParticipantType('alumni'); setErrorMessage(''); }}
                                        style={{
                                            backgroundColor: participantType === 'alumni' ? 'rgba(235, 0, 40, 0.08)' : 'var(--bg-card-alt)',
                                            borderColor: participantType === 'alumni' ? '#EB0028' : 'var(--border-color)'
                                        }}
                                        className="p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer group theme-transition"
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            participantType === 'alumni' ? 'bg-[#EB0028] text-white' : 'bg-black/5 dark:bg-white/5 text-zinc-500'
                                        }`}>
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span style={{ color: participantType === 'alumni' ? '#EB0028' : 'var(--text-primary)' }} className="text-xs font-bold block">
                                                AYBÜ Mezunu
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* 1. Ad Soyad */}
                            <div>
                                <label 
                                    style={{ color: 'var(--text-primary)' }} 
                                    className="block text-xs font-bold uppercase tracking-wider mb-2 theme-transition"
                                >
                                    Adınız Soyadınız <span className="text-[#EB0028]">*</span>
                                </label>
                                <div className="relative">
                                    <User style={{ color: 'var(--text-muted)' }} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="text"
                                        required
                                        disabled={isFormDisabled}
                                        placeholder="Örn: Ahmet Yılmaz"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        style={{ 
                                            backgroundColor: 'var(--bg-card-alt)', 
                                            color: 'var(--text-primary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028] transition-all disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                                    />
                                </div>
                            </div>

                            {/* 2. E-posta Adresi */}
                            <div>
                                <label 
                                    style={{ color: 'var(--text-primary)' }} 
                                    className="block text-xs font-bold uppercase tracking-wider mb-2 theme-transition"
                                >
                                    E-posta Adresiniz <span className="text-[#EB0028]">*</span>
                                </label>
                                <div className="relative">
                                    <Mail style={{ color: 'var(--text-muted)' }} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="email"
                                        required
                                        disabled={isFormDisabled}
                                        placeholder="Örn: ornek@aybu.edu.tr veya ornek@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ 
                                            backgroundColor: 'var(--bg-card-alt)', 
                                            color: 'var(--text-primary)',
                                            borderColor: formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim()) 
                                                ? '#ef4444' 
                                                : 'var(--border-color)'
                                        }}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028] transition-all disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                                    />
                                </div>
                                {formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim()) ? (
                                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium animate-in fade-in duration-200">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        Lütfen geçerli bir e-posta adresi giriniz (Örn: isim@aybu.edu.tr veya ornek@gmail.com)
                                    </p>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }} className="text-[11px] mt-1.5 theme-transition">
                                        Giriş biletiniz ve QR kodunuz bu adrese gönderilecektir.
                                    </p>
                                )}
                            </div>

                            {/* 3. Telefon Numarası */}
                            <div>
                                <label 
                                    style={{ color: 'var(--text-primary)' }} 
                                    className="block text-xs font-bold uppercase tracking-wider mb-2 theme-transition"
                                >
                                    Telefon Numaranız <span className="text-[#EB0028]">*</span>
                                </label>
                                <div className="relative">
                                    <Phone style={{ color: 'var(--text-muted)' }} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="tel"
                                        required
                                        disabled={isFormDisabled}
                                        placeholder="Örn: 05XX XXX XX XX"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        style={{ 
                                            backgroundColor: 'var(--bg-card-alt)', 
                                            color: 'var(--text-primary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono theme-transition"
                                    />
                                </div>
                            </div>

                            {/* 4. Öğrenci Numarası (Sadece Öğrenci İçin Zorunlu) */}
                            {participantType === 'student' && (
                                <div className="animate-in fade-in duration-300">
                                    <label 
                                        style={{ color: 'var(--text-primary)' }} 
                                        className="block text-xs font-bold uppercase tracking-wider mb-2 theme-transition"
                                    >
                                        Öğrenci Numaranız <span className="text-[#EB0028]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Hash style={{ color: 'var(--text-muted)' }} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={11}
                                            disabled={isFormDisabled}
                                            placeholder="Örn: 21010100001 (11 hane)"
                                            value={formData.studentNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                                setFormData({ ...formData, studentNumber: val });
                                            }}
                                            style={{ 
                                                backgroundColor: 'var(--bg-card-alt)', 
                                                color: 'var(--text-primary)',
                                                borderColor: 'var(--border-color)'
                                            }}
                                            className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono theme-transition"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 5. Dinamik Alan: Bölümünüz / Göreviniz / Mesleğiniz */}
                            <div className="animate-in fade-in duration-300">
                                <label 
                                    style={{ color: 'var(--text-primary)' }} 
                                    className="block text-xs font-bold uppercase tracking-wider mb-2 theme-transition"
                                >
                                    {dynamicField.label} <span className="text-[#EB0028]">*</span>
                                </label>
                                <div className="relative">
                                    <DynamicIcon style={{ color: 'var(--text-muted)' }} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="text"
                                        required
                                        disabled={isFormDisabled}
                                        placeholder={dynamicField.placeholder}
                                        value={formData.departmentOrRole}
                                        onChange={(e) => setFormData({ ...formData, departmentOrRole: e.target.value })}
                                        style={{ 
                                            backgroundColor: 'var(--bg-card-alt)', 
                                            color: 'var(--text-primary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028] transition-all disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                                    />
                                </div>
                            </div>

                            {/* Gönder Butonu */}
                            <button
                                type="submit"
                                disabled={isFormDisabled}
                                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#EB0028] hover:opacity-90 active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Biletiniz Hazırlanıyor...
                                    </>
                                ) : isQuotaExceeded ? (
                                    'Kontenjan Dolmuştur'
                                ) : isRegistrationClosed ? (
                                    'Kayıtlar Kapalı'
                                ) : (
                                    <>
                                        <Ticket className="w-4 h-4" />
                                        Biletimi Al (Ücretsiz)
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
