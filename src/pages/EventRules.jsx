import React from 'react';
import { Link } from 'react-router-dom';
import { 
    QrCode, 
    AlertTriangle, 
    ShieldAlert, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    CameraOff, 
    Coffee, 
    Smile, 
    HelpCircle,
    ArrowRight,
    Users,
    Info
} from 'lucide-react';

export default function EventRules() {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen pt-28 pb-20 theme-transition">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                
                {/* ── BAŞLIK & HERO ── */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm"
                        style={{ backgroundColor: 'rgba(235, 0, 40, 0.1)', color: '#EB0028', border: '1px solid rgba(235, 0, 40, 0.25)' }}>
                        <Info className="w-3.5 h-3.5" />
                        16 EKİM 2026 • BEYOND THE SURFACE
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight theme-transition mb-4">
                        Etkinlik Günü Kuralları <br className="hidden sm:inline" />
                        <span className="text-[#EB0028]">& Bilinmesi Gerekenler</span>
                    </h1>
                    <div className="w-20 h-1 bg-[#EB0028] mx-auto mb-6"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed theme-transition">
                        TEDxAYBU deneyiminin herkes için düzenli, güvenli ve ilham verici geçmesi amacıyla lütfen aşağıdaki kurallara ve tavsiyelere dikkat ediniz.
                    </p>
                </div>

                {/* ── BÖLÜM 1 & 2: GİRİŞ & SALON İÇİ KURALLARI (2 Sütun Grid) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Kart 1: Giriş ve Bilet Kuralları */}
                    <div 
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                        className="p-6 sm:p-8 rounded-3xl border theme-transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#EB0028]/10 text-[#EB0028]">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold theme-transition">
                                        Giriş ve Bilet Kuralları
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)' }} className="text-xs">Kapı ve bilet kontrolleri</p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        <strong style={{ color: 'var(--text-primary)' }}>Oturum başladıktan sonra</strong> salona kesinlikle giriş yapılamaz.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        <strong style={{ color: 'var(--text-primary)' }}>Çıktığınız oturuma</strong> yeniden giriş yapılamaz.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Etkinlik alanına giriş için <strong style={{ color: 'var(--text-primary)' }}>biletinizin ve QR kodunuzun</strong> bulunması zorunludur.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        QR kodunuzu girişte kolayca gösterebilmek için telefonunuzda <strong style={{ color: 'var(--text-primary)' }}>hazır bulundurunuz</strong>.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Giriş ve güvenlik kontrollerinde <strong style={{ color: 'var(--text-primary)' }}>etkinlik ekibimizin yönlendirmelerine</strong> uyunuz.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Kart 2: Oturma Düzeni & Salon İçi Kuralları */}
                    <div 
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                        className="p-6 sm:p-8 rounded-3xl border theme-transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold theme-transition">
                                        Oturma Düzeni & Salon İçi
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)' }} className="text-xs">Konferans salonu kuralları</p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Ön sıralarda numara bulunan koltuklar ve <strong style={{ color: 'var(--text-primary)' }}>protokol koltukları ayrılmıştır</strong>. Lütfen bu koltuklara oturmayınız.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CameraOff className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Salon içinde <strong style={{ color: 'var(--text-primary)' }}>videolu kayıt ve ses kaydı</strong> almayınız (TED telif ve yayın kuralları gereği).
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Coffee className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Salonda <strong style={{ color: 'var(--text-primary)' }}>yiyecek ve içecek tüketmemeye</strong> dikkat ediniz.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Oyun standlarında sıraya uymaya, ekipmanları ve malzemeleri özenli kullanmaya özen gösteriniz.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        Oyun ve workshoplara özel katılım koşullarını ve kontenjanları takip ediniz.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── BÖLÜM 3: EKSTRALAR & GÜVENLİK BİLGİLERİ ── */}
                <div 
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                    className="p-6 sm:p-8 rounded-3xl border mb-8 theme-transition"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 text-purple-500">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold theme-transition">
                                Ekstralar & Güvenlik
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }} className="text-xs">Kişisel eşyalar ve yardım</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)' }} className="p-5 rounded-2xl border theme-transition">
                            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm mb-1 theme-transition">Kişisel Eşya Sorumluluğu</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed theme-transition">
                                Kişisel eşyalarınızdan katılımcının kendisi sorumlu olup; herhangi bir kayıp/çalıntı durumunda TEDxAYBU ekibi sorumluluk almayacaktır.
                            </p>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)' }} className="p-5 rounded-2xl border theme-transition">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm mb-1 theme-transition">Vestiyer Hizmeti</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed theme-transition">
                                Kişisel eşyalarınızı bırakabilmeniz için alanda görevli ekip üyelerimiz tarafından vestiyer noktasına yönlendirileceksiniz.
                            </p>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)' }} className="p-5 rounded-2xl border theme-transition">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                                <HelpCircle className="w-4 h-4" />
                            </div>
                            <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm mb-1 theme-transition">Acil Durum & Sorular</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed theme-transition">
                                Herhangi bir acil durum, bildiri, istek veya soru için salon ve fuaye alanındaki görevli ekip üyelerimize müracaat edebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── BÖLÜM 4: GÜNÜNÜ EN İYİ ŞEKİLDE DEĞERLENDİR! (Tavsiyeler) ── */}
                <div 
                    style={{ 
                        background: 'linear-gradient(135deg, rgba(235, 0, 40, 0.05) 0%, rgba(235, 0, 40, 0.01) 100%)',
                        borderColor: 'rgba(235, 0, 40, 0.25)' 
                    }}
                    className="p-6 sm:p-10 rounded-3xl border mb-12 theme-transition"
                >
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#EB0028]/10 text-[#EB0028] flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl sm:text-3xl font-black uppercase tracking-tight theme-transition">
                            Gününü En İyi Şekilde Değerlendir!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs sm:text-sm mt-1 max-w-lg mx-auto theme-transition">
                            TEDx deneyimini dolu dolu yaşamanız için organizasyon ekibimizden altın öneriler:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Clock,
                                title: 'Erken Gel',
                                text: 'Giriş ve bilet işlemlerini rahatça tamamla, yerini erkenden al ve hiçbir oturumu kaçırma.'
                            },
                            {
                                icon: Info,
                                title: 'Programı Takip Et',
                                text: 'Oturum, konuşmacı ve sahne performansı başlangıç saatlerine dikkat et.'
                            },
                            {
                                icon: Sparkles,
                                title: 'Keşfet',
                                text: 'Fuayedeki sponsor stantlarını gez, oyunlara katıl ve sürpriz fırsatları değerlendir.'
                            },
                            {
                                icon: Users,
                                title: 'Yeni İnsanlarla Tanış',
                                text: 'Farklı bölümlerden öğrenciler ve katılımcılarla sohbet et, networkünü genişlet.'
                            },
                            {
                                icon: Coffee,
                                title: 'Molanın Tadını Çıkar',
                                text: 'Kahveni al, lezzetli ikramları tat, Pilates etkinliğimizle yenilen ve anın tadını çıkar!'
                            },
                            {
                                icon: Smile,
                                title: 'İlhamla Ayrıl',
                                text: 'Yeni fikirler, ufkunu açacak düşünceler ve harika anılar biriktirerek salondan ayrıl!'
                            }
                        ].map((item, idx) => (
                            <div 
                                key={idx}
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                                className="p-5 rounded-2xl border theme-transition hover:border-[#EB0028]/40 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#EB0028]/10 text-[#EB0028] flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm theme-transition">
                                        {item.title}
                                    </h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed theme-transition pl-11">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BÖLÜM 5: KAPANIŞ ÇAĞRISI ── */}
                <div 
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    className="p-8 sm:p-12 rounded-3xl border text-center theme-transition shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#EB0028]/5 rounded-bl-full pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#EB0028] mb-2 block">
                            BEYOND THE SURFACE
                        </span>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl sm:text-3xl font-black uppercase tracking-tight theme-transition mb-3">
                            16 Ekim'de TEDxAYBU'da Görüşmek Üzere!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm sm:text-base leading-relaxed theme-transition mb-6">
                            İlham dolu, ufuk açıcı bir gün geçirmek için sabırsızlanıyoruz!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/bilet-al"
                                className="w-full sm:w-auto px-7 py-3.5 bg-[#EB0028] hover:bg-[#c40022] text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-[#EB0028]/30 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Biletini Al / Görüntüle</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/"
                                style={{ backgroundColor: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                className="w-full sm:w-auto px-7 py-3.5 border font-bold rounded-2xl text-sm hover:opacity-80 transition-all text-center"
                            >
                                Anasayfaya Dön
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
