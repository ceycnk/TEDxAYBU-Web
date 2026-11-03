import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Calendar, Clock, Sparkles, Palette, Video, Globe, Handshake, Compass, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

    const faqs = [
        {
            question: "TEDxAYBU 2026 etkinliği tamamlandı mı?",
            answer: "Evet! TEDxAYBU 2026 'Beyond the Surface' etkinliğimiz 16 Ekim 2026 Cuma günü Ankara Yıldırım Beyazıt Üniversitesi Milli İrade Yerleşkesi'nde yoğun bir katılım ve ilham verici oturumlarla başarıyla gerçekleştirilmiştir."
        },
        {
            question: "TEDxAYBU 2027 için yeni ekip arkadaşı arıyor musunuz?",
            answer: "Evet! 2027 yılında gerçekleştireceğimiz yeni TEDx etkinliğimiz için hazırlıklarımıza başladık. Tasarımdan sosyal medyaya, web teknolojilerinden sponsorluğa kadar farklı ekiplerimize katılmak için başvuru formumuzu doldurabilirsiniz."
        },
        {
            question: "Ekip başvuruları kimlere açık ve nasıl başvurabilirim?",
            answer: "Ankara Yıldırım Beyazıt Üniversitesi'nde öğrenim gören, fikirlerin gücüne inanan ve organizasyon tecrübesi kazanmak isteyen tüm öğrencilere açıktır. Sayfamızdaki 'Ekibe Katıl' butonuna tıklayarak başvuru formuna ulaşabilirsiniz."
        },
        {
            question: "Geçmiş etkinlik konuşmalarını ve sanatçılarını nereden görebilirim?",
            answer: "2026 'Beyond the Surface' sahnemizde yer alan tüm değerli konuşmacılarımızı ve sahne sanatçılarımızı web sitemizin 'Konuşmacılar' ve 'Sahne Sanatçıları' sayfalarından detaylıca inceleyebilirsiniz."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">

            {/* ── Duyuru Şeridi ── */}
            <div style={{ backgroundColor: '#EB0028' }} className="w-full py-2.5 overflow-hidden shadow-sm">
                <div className="flex items-center justify-center gap-3 flex-wrap px-4 text-center">
                    <span className="text-white text-sm font-bold tracking-wide">
                        🚀 TEDxAYBU 2026 Başarıyla Gerçekleşti! Şimdi 2027 İçin Yeni Ekip Arkadaşları Arıyoruz.
                    </span>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScy_pVonbMhop7qkPSMmpVovdsigvofkfjZpganrqsGG-BI7g/viewform?usp=dialog"
                        target="_blank" rel="noopener noreferrer"
                        className="text-white underline text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap">
                        Ekibe Katıl / Başvuru Formu →
                    </a>
                </div>
            </div>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: 'var(--bg-primary)' }} className="relative min-h-[85vh] flex flex-col justify-start pt-20 pb-16 overflow-hidden theme-transition">
                <div style={{ backgroundColor: 'var(--bg-primary)' }} className="absolute inset-0 z-0 theme-transition">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ted-red/10 rounded-full blur-[128px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ted-red/5 rounded-full blur-[128px]"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-block mb-4 px-4 py-1 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-sm tracking-widest uppercase">
                        TEDxAYBU 2026 • Arşiv
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter mb-6 uppercase leading-tight theme-transition">
                        Beyond the<br />
                        <span className="text-ted-red">Surface</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }} className="mt-8 text-xl md:text-2xl max-w-4xl mx-auto font-light tracking-wide mb-10 theme-transition">
                        Gördüğüne yetinme. Düşün, sorgula, keşfet.<br className="hidden md:block" />
                        Gerçek fikirler yüzeyin ötesinde saklıdır.
                    </p>

                    {/* 2026 Tamamlandı & 2027 Hazırlık Rozeti */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <div 
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl shadow-lg theme-transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3.5 w-3.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                                </span>
                                <span style={{ color: 'var(--text-primary)' }} className="text-base sm:text-lg font-bold">
                                    TEDxAYBU 2026 Başarıyla Tamamlandı! 🎉
                                </span>
                            </div>
                            <div className="hidden sm:block h-5 w-[1px] bg-zinc-500/30"></div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-ted-red/10 text-ted-red border border-ted-red/30">
                                    TEDxAYBU 2027 Hazırlıkları Başladı
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2 w-full px-4">
                        <a 
                            href="https://docs.google.com/forms/d/e/1FAIpQLScy_pVonbMhop7qkPSMmpVovdsigvofkfjZpganrqsGG-BI7g/viewform?usp=dialog"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-ted-red hover:bg-black hover:text-white transition-all rounded-xl shadow-lg hover:shadow-red-500/25"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ✨ 2027 Ekip Başvurusu Yap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                        <Link to="/speakers"
                            style={{ color: 'var(--text-primary)', border: '2px solid var(--border-color)' }}
                            className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 font-bold hover:border-ted-red transition-all bg-transparent theme-transition rounded-xl">
                            2026 Konuşmacıları
                        </Link>
                        <Link to="/team"
                            style={{ color: 'var(--text-primary)', border: '2px solid var(--border-color)' }}
                            className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 font-bold hover:border-ted-red transition-all bg-transparent theme-transition rounded-xl">
                            Ekibimiz
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-1 h-12 bg-gradient-to-b from-ted-red to-transparent rounded-full"></div>
                </div>
            </section>

            {/* ── 2027 Yeni Ekip Arkadaşları Arıyoruz Bölümü ── */}
            <section id="ekibe-katil" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 relative overflow-hidden theme-transition">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-ted-red/10 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ted-red/5 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-xs sm:text-sm tracking-widest uppercase font-bold">
                            <Sparkles className="w-4 h-4" />
                            TEDxAYBU 2027 Hazırlıkları
                        </div>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight uppercase theme-transition">
                            Yeni Ekip Arkadaşları <span className="text-ted-red">Arıyoruz!</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-ted-red mx-auto mb-8"></div>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-lg sm:text-xl font-light leading-relaxed theme-transition">
                            2026 yılı sahnemizi başarıyla tamamladık; şimdi <strong>TEDxAYBU 2027</strong> için çok daha büyük, ilham verici ve etkileyici bir organizasyonu birlikte inşa etme vakti! Büyük fikirleri sahneye taşımak ve perde arkasındaki bu eşsiz yolculuğa ortak olmak istiyorsan ekibimize katıl.
                        </p>
                    </div>

                    {/* Departman Kartları Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                        {[
                            {
                                icon: Palette,
                                title: "Tasarım & Kreatif",
                                desc: "Afişler, sahne dekoru, yaka kartları ve sosyal medya görsel kimliğini tasarlayacak yaratıcı zihinler."
                            },
                            {
                                icon: Video,
                                title: "Sosyal Medya & İçerik",
                                desc: "Reels ve video kurguları, aylık yayın takvimi, hikâye anlatımı ve dijital etkileşim yönetimi."
                            },
                            {
                                icon: Globe,
                                title: "Web & Teknoloji",
                                desc: "Web platformunun geliştirilmesi, dijital biletleme sistemi, QR operasyonları ve teknik altyapı."
                            },
                            {
                                icon: Handshake,
                                title: "Sponsorluk & Ortaklıklar",
                                desc: "Marka ve kurum görüşmeleri, kurumsal sponsorluk dosyalarının hazırlanması ve partnerlik yönetimi."
                            },
                            {
                                icon: Compass,
                                title: "Operasyon & Etkinlik Akışı",
                                desc: "Etkinlik günü salon akışı, fuaye ve stant koordinasyonu, misafir karşılama ve sahne arkası operasyonları."
                            },
                            {
                                icon: Users,
                                title: "Küratörlük & Konuşmacı",
                                desc: "Yeni fikir araştırmaları, konuşmacı iletişimi, konuşma koçluğu ve sahne içeriklerinin olgunlaştırılması."
                            }
                        ].map(({ icon: Icon, title, desc }, idx) => (
                            <div key={idx}
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                className="p-7 rounded-2xl shadow-sm hover:border-ted-red/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between theme-transition">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-ted-red/10 border border-ted-red/20 flex items-center justify-center mb-5 group-hover:bg-ted-red group-hover:text-white transition-colors text-ted-red">
                                        <Icon className="w-6 h-6 transition-colors" />
                                    </div>
                                    <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2.5 theme-transition">
                                        {title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed theme-transition">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Çağrı Kutusu */}
                    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl text-center shadow-xl relative overflow-hidden theme-transition">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-ted-red/10 rounded-full blur-2xl"></div>
                        <h3 style={{ color: 'var(--text-primary)' }} className="text-2xl sm:text-3xl font-extrabold mb-4 theme-transition">
                            Hazır mısın? Birlikte İlham Verelim!
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-base sm:text-lg max-w-2xl mx-auto mb-8 theme-transition">
                            Başvuru formundaki soruları yanıtlayarak yeteneklerini ve ilgi duyduğun departmanı bizimle paylaş. TEDxAYBU 2027 ailesinde yerini al!
                        </p>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScy_pVonbMhop7qkPSMmpVovdsigvofkfjZpganrqsGG-BI7g/viewform?usp=dialog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-9 py-4 bg-ted-red hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-red-500/25 text-base sm:text-lg"
                        >
                            <span>Ekip Başvuru Formunu Doldur</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Tema Açıklaması ── */}
            <section style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 relative overflow-hidden theme-transition">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ted-red/5 rounded-full blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 style={{ color: 'var(--text-primary)' }} className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tighter theme-transition">
                                Yüzeyin <span className="text-ted-red">Ötesi</span>
                            </h2>
                            <div className="w-20 h-1 bg-ted-red mb-8"></div>
                            <div style={{ color: 'var(--text-secondary)' }} className="space-y-6 text-lg leading-relaxed theme-transition">
                                <p>"Beyond the Surface", hayatın, bilginin ve insan deneyiminin sadece görünen yüzeyden ibaret olmadığını hatırlatan bir tema.</p>
                                <p>Yüzey, çoğu zaman en dikkat çeken şey olsa da, asıl dönüşüm görünmeyen tarafta gerçekleşir:</p>
                                <ul className="list-none space-y-4 mt-6">
                                    {[
                                        ['Bilimin', 'yüzeyinin altında keşfedilmeyi bekleyen teoriler vardır.'],
                                        ['Toplumun', 'yüzeyinin altında davranışları şekillendiren görünmez güçler vardır.'],
                                        ['Teknolojinin', 'yüzeyinin altında hayatımızı dönüştüren algoritmalar vardır.'],
                                        ['Bir insanın', 'yüzeyinin altında hikâyeler, travmalar, potansiyel ve umutlar vardır.'],
                                        ['Bir fikrin', 'yüzeyinin altında geleceği değiştirecek bir devrim saklı olabilir.'],
                                    ].map(([bold, rest], i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-ted-red font-bold mt-1">•</span>
                                            <span>
                                                <strong style={{ color: 'var(--text-primary)' }} className="theme-transition">{bold}</strong> {rest}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)' }}
                            className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl theme-transition group">
                            <div style={{ backgroundColor: 'var(--bg-secondary)' }}
                                className="absolute inset-0 flex items-center justify-center p-8 theme-transition">
                                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                    className="text-center backdrop-blur-sm p-8 rounded-xl shadow-sm transform transition-transform duration-700 group-hover:scale-105 theme-transition">
                                    <p style={{ color: 'var(--text-secondary)' }} className="italic text-xl md:text-2xl font-light mb-6 theme-transition">
                                        "Bu tema, bilimden sanata, psikolojiden uluslararası ilişkilere, kişisel gelişimden teknolojiye kadar her alandan konuşmacıya kapı açar."
                                    </p>
                                    <div className="w-12 h-1 bg-ted-red mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Program ── */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 theme-transition">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-xs font-mono font-bold text-ted-red uppercase tracking-widest mb-2 block">16 Ekim 2026 Oturumları</span>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight theme-transition">2026 Etkinlik Programı ve Akışı</h2>
                        <div className="w-20 h-1 bg-ted-red mx-auto mb-8"></div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden theme-transition">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ted-red/5 rounded-bl-full"></div>

                            <div style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                                className="flex flex-col md:flex-row gap-8 justify-between items-center mb-12 pb-8 theme-transition">
                                <div className="flex items-center gap-4 text-2xl font-bold">
                                    <Calendar className="w-8 h-8 text-ted-red" />
                                    <span>16 Ekim 2026 Cuma</span>
                                </div>
                                <div className="flex items-center gap-4 text-2xl font-bold">
                                    <Clock className="w-8 h-8 text-ted-red" />
                                    <span>13:30 - 16:30</span>
                                </div>
                            </div>

                            <div className="space-y-8 relative">
                                <div style={{ backgroundColor: 'var(--border-color)' }} className="absolute left-[39px] top-2 bottom-2 w-0.5 hidden md:block"></div>

                                {[
                                    { time: '13:30', title: 'Açılış Konuşması', desc: 'TEDxAYBU 2026 "Beyond the Surface" açılış konuşması.' },
                                    { time: '13:45', title: 'Sanatçı Atlas: Ayşe Ceren Saygı', desc: 'Özel sahne ve müzik performansı.' },
                                    { time: '14:00', title: 'Konuşmacı: Ece Serin', desc: 'İlham verici konuşma ve deneyim paylaşımı.' },
                                    { time: '14:15', title: 'Konuşmacı: Prof. Dr. Türker Bıyıklı', desc: 'Bilim ve spor dünyasından ufuk açıcı bir bakış.' },
                                    { time: '14:30', title: 'Konuşmacı: Doç. Dr. Abdulhamit Küçükaslan', desc: 'Akademik ve sektörel vizyon oturumu.' },
                                    { time: '14:45', title: 'Sanatçı Anı: Sayra Kocaer', desc: 'Sahne sanatı ve müzik dinletisi.' },
                                    { time: '15:00 - 15:30', title: 'Ara & Pilates Workshop', desc: 'Sponsor ikramları, fuaye stantları ve hareket molası.' },
                                    { time: '15:30', title: 'Konuşmacı: Gökhan Yolal', desc: 'Girişimcilik ve başarı hikayesi.' },
                                    { time: '15:45', title: 'Konuşmacı: İsmail Sarıkaya', desc: 'İnovatif fikirler ve vizyon konuşması.' },
                                    { time: '16:00', title: 'Konuşmacı: Habip Şana', desc: 'İlham dolu oturum.' },
                                    { time: '16:15', title: 'Kapanış Performansı: Mevsim Toprak', desc: 'Büyüleyici kapanış müzik performansı.' },
                                    { time: '16:30', title: 'Kapanış', desc: 'Teşekkür konuşmaları ve etkinlik sonu.' },
                                ].map(({ time, title, desc }, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-8 relative z-10">
                                        <div className="md:w-36 flex-shrink-0 font-mono text-ted-red font-bold text-lg">
                                            <span className="md:hidden mr-4">Saat:</span>{time}
                                        </div>
                                        <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid #EB0028' }}
                                            className="hidden md:flex w-6 h-6 rounded-full items-center justify-center -ml-[31px] mt-1 z-10 flex-shrink-0"></div>
                                        <div style={{ backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border-color)' }}
                                            className="p-5 rounded-xl flex-grow shadow-sm theme-transition">
                                            <h3 style={{ color: 'var(--text-primary)' }} className="text-base sm:text-lg font-bold mb-1.5 theme-transition">{title}</h3>
                                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs sm:text-sm theme-transition">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Etkinlik Kuralları Yönlendirme Kutusu */}
                            <div style={{ borderTop: '1px solid var(--border-color)' }} className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)' }} className="font-bold text-base">Etkinlik Günü Kuralları ve Bilinmesi Gerekenler</h4>
                                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1">Kapı girişleri, oturma düzeni ve salon içi kurallarını inceleyin.</p>
                                </div>
                                <Link
                                    to="/kurallar"
                                    className="px-5 py-2.5 rounded-xl bg-ted-red/10 hover:bg-ted-red text-ted-red hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                                >
                                    <span>Kuralları İncele</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SSS ── */}
            <section style={{ backgroundColor: 'var(--bg-primary)' }} className="py-24 theme-transition">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight theme-transition">Sık Sorulan Sorular</h2>
                        <div className="w-20 h-1 bg-ted-red mx-auto mb-8"></div>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index}
                                style={{
                                    backgroundColor: openFaqIndex === index ? 'var(--bg-card-alt)' : 'var(--bg-card)',
                                    border: `1px solid ${openFaqIndex === index ? 'rgba(235,0,40,0.3)' : 'var(--border-color)'}`,
                                }}
                                className="rounded-lg overflow-hidden theme-transition">
                                <button
                                    style={{ color: 'var(--text-primary)' }}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none theme-transition"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-semibold text-lg pr-8">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 flex-shrink-0 text-ted-red transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed theme-transition">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
