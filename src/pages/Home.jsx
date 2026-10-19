import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const calculateTimeLeft = () => {
        const difference = +new Date('2026-10-16T13:30:00+03:00') - +new Date();
        if (difference > 0) {
            return {
                Gün: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Saat: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Dakika: Math.floor((difference / 1000 / 60) % 60),
                Saniye: Math.floor((difference / 1000) % 60)
            };
        }
        return {};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });

    const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

    const faqs = [
        {
            question: "Etkinlik ne zaman ve nerede gerçekleşecek?",
            answer: "TEDxAYBU 'Beyond the Surface' etkinliğimiz 16 Ekim 2026 Cuma günü, saat 13:30 - 16:30 arasında, Ankara Yıldırım Beyazıt Üniversitesi Milli İrade Yerleşkesi Konferans Salonu'nda gerçekleşecektir."
        },
        {
            question: "Etkinliğe kimler katılabilir?",
            answer: "Etkinliğimiz Ankara Yıldırım Beyazıt Üniversitesi öğrencilerine açıktır. Fikirlerin gücüne inanan, yeni bakış açıları kazanmak isteyen tüm Aybülüleri bekliyoruz!"
        },
        {
            question: "Etkinliğe katılım nasıl sağlanacak?",
            answer: "Web sitemizdeki 'Bilet Al' sayfasından ön kayıt formunu doldurarak ücretsiz dijital giriş biletinizi alabilirsiniz. Biletiniz ve QR kodunuz doğrudan e-posta adresinize iletilecektir."
        },
        {
            question: "Etkinlikte müzik performansı olacak mı?",
            answer: "Evet! Etkinliğimizde müzik sanatçılarımız sahne alacak. Sahne sanatçılarımızı web sitemizdeki 'Sahne Sanatçıları' bölümünden inceleyebilirsiniz."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">

            {/* ── Duyuru Şeridi ── */}
            <div style={{ backgroundColor: '#EB0028' }} className="w-full py-2.5 overflow-hidden shadow-sm">
                <div className="flex items-center justify-center gap-3 flex-wrap px-4 text-center">
                    <span className="text-white text-sm font-bold tracking-wide">
                        🎟️ TEDxAYBU 2026 "Beyond the Surface" Ön Kayıtları Başladı!
                    </span>
                    <Link to="/bilet-al"
                        className="text-white underline text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap">
                        Hemen Biletinizi Alın →
                    </Link>
                </div>
            </div>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: 'var(--bg-primary)' }} className="relative min-h-[90vh] flex flex-col justify-start pt-20 overflow-hidden theme-transition">
                <div style={{ backgroundColor: 'var(--bg-primary)' }} className="absolute inset-0 z-0 theme-transition">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ted-red/10 rounded-full blur-[128px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ted-red/5 rounded-full blur-[128px]"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-block mb-4 px-4 py-1 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-sm tracking-widest uppercase">
                        Tema 2026
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter mb-6 uppercase leading-tight theme-transition">
                        Beyond the<br />
                        <span className="text-ted-red">Surface</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }} className="mt-8 text-xl md:text-2xl max-w-4xl mx-auto font-light tracking-wide mb-12 theme-transition">
                        Gördüğüne yetinme. Düşün, sorgula, keşfet.<br className="hidden md:block" />
                        Gerçek fikirler yüzeyin ötesinde saklıdır.
                    </p>

                    {/* Countdown */}
                    <div className="flex justify-center gap-3 sm:gap-6 mb-12">
                        {Object.keys(timeLeft).length > 0 ? Object.keys(timeLeft).map((interval) => (
                            <div key={interval}
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                className="flex flex-col items-center justify-center rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[120px] theme-transition hover:border-ted-red/40">
                                <span style={{ color: 'var(--text-primary)' }} className="text-4xl sm:text-6xl font-bold mb-2 font-mono theme-transition">
                                    {timeLeft[interval].toString().padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-ted-red uppercase tracking-[0.2em] font-bold">{interval}</span>
                            </div>
                        )) : (
                            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                className="text-2xl sm:text-3xl font-bold text-ted-red uppercase tracking-widest px-8 py-4 rounded-2xl theme-transition">
                                Etkinlik Başladı!
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full px-4">
                        <Link to="/speakers"
                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-ted-red hover:bg-black hover:text-white transition-all">
                            <span className="relative z-10 flex items-center gap-2">
                                Konuşmacıları İncele <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link to="/about"
                            style={{ color: 'var(--text-primary)', border: '2px solid var(--border-color)' }}
                            className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 font-bold hover:border-ted-red transition-all bg-transparent theme-transition">
                            Hakkımızda
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-1 h-12 bg-gradient-to-b from-ted-red to-transparent rounded-full"></div>
                </div>
            </section>

            {/* ── Tema Açıklaması ── */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
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
            <section style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 theme-transition">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight theme-transition">Etkinlik Programı</h2>
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
            <section style={{ backgroundColor: 'var(--bg-secondary)' }} className="py-24 theme-transition">
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
