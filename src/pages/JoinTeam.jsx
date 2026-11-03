import React from 'react';
import { 
    Sparkles, 
    ArrowRight, 
    Palette, 
    Video, 
    Globe, 
    Handshake, 
    Compass, 
    Users, 
    CheckCircle2, 
    Target, 
    HeartHandshake, 
    Flame,
    ExternalLink
} from 'lucide-react';

const JoinTeam = () => {
    const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScy_pVonbMhop7qkPSMmpVovdsigvofkfjZpganrqsGG-BI7g/viewform?usp=dialog";

    const departments = [
        {
            icon: Palette,
            title: "Tasarım & Kreatif Prodüksiyon",
            desc: "Etkinliğin görsel dilini ve marka kimliğini şekillendiren ekip.",
            tasks: [
                "Afiş, banner ve yaka kartı tasarımları",
                "Sosyal medya görsel şablonları ve infografikler",
                "Sahne dekoru, arka plan görselleri ve fuaye yönlendirmeleri"
            ]
        },
        {
            icon: Video,
            title: "Sosyal Medya & İçerik Üretimi",
            desc: "TEDxAYBU'nun sesini dijital dünyada duyuran, hikâye anlatan ekip.",
            tasks: [
                "Reels ve kısa video içeriklerinin çekimi & kurgusu",
                "Aylık ve haftalık sosyal medya yayın takviminin yönetimi",
                "Etkinlik öncesi/sonrası dijital etkileşim stratejileri"
            ]
        },
        {
            icon: Globe,
            title: "Web & Dijital Altyapı",
            desc: "Platformun yazılımını, dijital biletleme ve teknolojik omurgasını kuran ekip.",
            tasks: [
                "Resmi web platformunun geliştirilmesi ve bakımı",
                "QR kodlu biletleme ve kapı okuma sistemlerinin yönetimi",
                "Kullanıcı deneyimi (UX/UI) ve veri entegrasyonları"
            ]
        },
        {
            icon: Handshake,
            title: "Sponsorluk & Dış İlişkiler",
            desc: "Fikirlerin hayata geçmesi için kurumsal ortaklıkları ve kaynakları yöneten ekip.",
            tasks: [
                "Marka ve şirketlerle sponsorluk görüşmeleri",
                "Sponsorluk sunumu ve kurumsal dosyaların hazırlanması",
                "Fuaye alanı marka stantları ve ikram anlaşmaları"
            ]
        },
        {
            icon: Compass,
            title: "Operasyon & Sahne Akışı",
            desc: "Etkinlik günü salonun ve sahnenin kusursuz işlemesini sağlayan ekip.",
            tasks: [
                "Etkinlik günü dakika dakika akış koordinasyonu",
                "Kulis, konuşmacı karşılama ve salon düzeni yönetimi",
                "Giriş-çıkış kapı kontrolü ve katılımcı yönlendirmeleri"
            ]
        },
        {
            icon: Users,
            title: "Küratörlük & Konuşmacı İletişimi",
            desc: "Sahneye taşınacak fikirleri araştıran ve konuşmacılara yol arkadaşlığı yapan ekip.",
            tasks: [
                "İnovatif ve ilham veren konuşmacı adaylarının tespiti",
                "Konuşmacılarla iletişim ve davet süreçleri",
                "Konuşma taslakları ve prova süreçlerinin koordinasyonu"
            ]
        }
    ];

    const benefits = [
        {
            icon: Target,
            title: "Büyük Ölçekli Organizasyon Deneyimi",
            desc: "Yüzlerce kişinin katıldığı prestijli ve lisanslı bir TEDx etkinliğinin mutfağında bizzat sorumluluk alma fırsatı."
        },
        {
            icon: HeartHandshake,
            title: "Güçlü Network & Arkadaşlık",
            desc: "Farklı bölümlerden tutkulu öğrenciler, sektör lideri konuşmacılar ve kurumsal sponsorlarla doğrudan tanışma imkânı."
        },
        {
            icon: Flame,
            title: "Portfolyo & Somut Başarılar",
            desc: "Kariyerine başlarken CV'nde ve portfolyonda gururla gösterebileceğin gerçek projeler ve organizasyon liderliği."
        }
    ];

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="pt-20 min-h-screen theme-transition">

            {/* ── Üst Banner / Hero Başlığı ── */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-20 relative overflow-hidden theme-transition">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ted-red/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-xs sm:text-sm tracking-widest uppercase font-bold">
                        <Sparkles className="w-4 h-4" />
                        TEDxAYBU 2027 Dönemi Başvuruları
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight uppercase theme-transition">
                        Yeni Ekip Arkadaşları <br className="hidden sm:block" />
                        <span className="text-ted-red">Arıyoruz!</span>
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mx-auto mb-8"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-10 theme-transition">
                        2026 yılı etkinliğimiz <strong>"Beyond the Surface"</strong> ile sahnemizi başarıyla tamamladık. Şimdi ise <strong>TEDxAYBU 2027</strong> için çok daha güçlü, yenilikçi ve ilham verici bir sahneyi birlikte kuracak yeni yol arkadaşlarımızı arıyoruz!
                    </p>

                    <a
                        href={FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 sm:py-5 bg-ted-red hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-red-500/25 text-base sm:text-lg"
                    >
                        <span>Hemen Başvuru Formunu Doldur</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* ── Neden TEDxAYBU? ── */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <span className="text-xs font-mono font-bold text-ted-red uppercase tracking-widest mb-2 block">Kazanımlar</span>
                    <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight theme-transition">
                        Neden TEDxAYBU Ekibine Katılmalısın?
                    </h2>
                    <div className="w-16 h-1 bg-ted-red mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefits.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx}
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                className="p-8 rounded-2xl shadow-sm hover:border-ted-red/40 hover:-translate-y-1 transition-all duration-300 theme-transition text-center flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-ted-red/10 border border-ted-red/20 flex items-center justify-center mb-6 text-ted-red">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-3 theme-transition">
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Departmanlar ve Görev Alanları ── */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 theme-transition">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-xs font-mono font-bold text-ted-red uppercase tracking-widest mb-2 block">Departmanlarımız</span>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight theme-transition">
                            Hangi Ekiplerde Yer Alabilirsin?
                        </h2>
                        <div className="w-20 h-1 bg-ted-red mx-auto my-6"></div>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-base sm:text-lg theme-transition">
                            İlgi alanına ve yeteneklerine en uygun departmanı seçerek başvuru formunda belirtebilirsin. Birden fazla alana ilgi duyuyorsan formda belirtebilirsin!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {departments.map((dept, idx) => {
                            const Icon = dept.icon;
                            return (
                                <div key={idx}
                                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                    className="p-7 rounded-2xl shadow-sm hover:border-ted-red/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group theme-transition">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-ted-red/10 border border-ted-red/20 flex items-center justify-center mb-5 group-hover:bg-ted-red group-hover:text-white transition-colors text-ted-red">
                                            <Icon className="w-6 h-6 transition-colors" />
                                        </div>
                                        <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2.5 theme-transition">
                                            {dept.title}
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed mb-6 theme-transition">
                                            {dept.desc}
                                        </p>

                                        <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)]">
                                            <span style={{ color: 'var(--text-muted)' }} className="text-xs font-bold uppercase tracking-wider block mb-2">
                                                Neler Yapar?
                                            </span>
                                            {dept.tasks.map((task, tIdx) => (
                                                <div key={tIdx} className="flex items-start gap-2.5">
                                                    <CheckCircle2 className="w-4 h-4 text-ted-red flex-shrink-0 mt-0.5" />
                                                    <span style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed theme-transition">
                                                        {task}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Başvuru Süreci ── */}
            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <span className="text-xs font-mono font-bold text-ted-red uppercase tracking-widest mb-2 block">Adımlar</span>
                    <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight theme-transition">
                        Başvuru Süreci Nasıl İşliyor?
                    </h2>
                    <div className="w-16 h-1 bg-ted-red mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    {[
                        {
                            step: "01",
                            title: "Formu Doldur",
                            desc: "Google Forms üzerindeki başvuru formunu eksiksiz yanıtlayarak ilgi duyduğun departmanları ve deneyimlerini paylaş."
                        },
                        {
                            step: "02",
                            title: "Değerlendirme & Tanışma",
                            desc: "Başvurular ekibimiz tarafından titizlikle incelendikten sonra seninle kısa ve samimi bir tanışma görüşmesi gerçekleştiriyoruz."
                        },
                        {
                            step: "03",
                            title: "Aramıza Katıl",
                            desc: "TEDxAYBU 2027 ekibine hoş geldin! Onboarding sürecinin ardından 2027 sahnemiz için hazırlıklara başlıyoruz."
                        }
                    ].map((stepItem, idx) => (
                        <div key={idx}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="p-8 rounded-2xl shadow-sm text-center relative theme-transition">
                            <span className="text-5xl font-extrabold text-ted-red/20 font-mono block mb-2">
                                {stepItem.step}
                            </span>
                            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-3 theme-transition">
                                {stepItem.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                {stepItem.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Büyük Başvuru Kartı (Final CTA) ── */}
                <div 
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    className="max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl text-center shadow-2xl relative overflow-hidden theme-transition"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-ted-red/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-ted-red/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-ted-red/10 text-ted-red border border-ted-red/30 mb-4">
                            2027 Ekip Seçimleri
                        </span>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl sm:text-5xl font-extrabold mb-5 theme-transition">
                            Büyük Fikirleri Birlikte Sahneye Taşıyalım!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-base sm:text-lg max-w-2xl mx-auto mb-10 theme-transition">
                            Kariyerin ve üniversite hayatın boyunca unutamayacağın bir serüvenin kapısını arala. Aşağıdaki butona tıklayarak başvuru formunu hemen doldurabilirsin.
                        </p>
                        <a
                            href={FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-ted-red hover:bg-black text-white font-extrabold rounded-2xl transition-all shadow-xl hover:shadow-red-500/25 text-lg cursor-pointer"
                        >
                            <span>Başvuru Formuna Git (Google Forms)</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeam;