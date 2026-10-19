import React from 'react';

const Speakers = () => {
    const realSpeakers = [
        { name: "İsmail Sarıkaya", role: "Dijital İçerik ve Yayıncılık Eğitmeni | İçerik Üreticisi", image: "/speakers/ismail-sarikaya.jpeg" },
        { name: "Habip Şana", role: "Oyun Geliştiricisi | İçerik Üreticisi", image: "/speakers/habib-sana.jpeg" },
        { name: "Gökhan Yolal", role: "Para Milli Atlet", image: "/speakers/gokhan-yolal.jpeg" },
        { name: "Prof. Dr. Türker Bıyıklı", role: "Fizyoterapist | Athletic House Academy Kurucusu", image: "/speakers/prof-turker-biyikli.jpeg" },
        { name: "Abdülhamit Küçükaslan", role: "AYBÜ Havacılık ve Uzay Bilimleri Fak. Akademisyen | Matematikçi", image: "/speakers/abdulhamit-kucukaslan.jpeg" },
        { name: "Ece Serin", role: "Avukat | İçerik Üreticisi", image: "/speakers/ece-serin.jpeg" },
    ];

    const placeholderCount = 0;

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="pt-20 min-h-screen theme-transition">

            {/* Header */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-20 relative overflow-hidden theme-transition">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ted-red/5 rounded-full blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                    <div className="inline-block mb-4 px-4 py-1 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-sm tracking-widest uppercase">
                        Beyond the Surface
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase theme-transition">
                        Konuşmacılar
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mb-8 mx-auto md:mx-0"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-2xl font-light theme-transition">
                        Yüzeyin ardındaki gizli hikayeleri paylaşacak değerli isimlerle tanışın.
                    </p>
                    <div className="mt-8 flex justify-center md:justify-start">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScrgDIRGU-36Qls0cF-qBjqujeqETgKImezd1A2Ijy37t0zeg/viewform?usp=sharing&ouid=109183001168161635058"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-ted-red hover:bg-black hover:text-white transition-all">
                            Konuşmacı Başvurusu Yap
                        </a>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Gerçek konuşmacılar */}
                    {realSpeakers.map((speaker, idx) => (
                        <div key={idx}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:border-ted-red/40 theme-transition">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={speaker.image}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="w-8 h-0.5 bg-ted-red mb-3"></div>
                                    <h3 className="text-white text-xl font-bold uppercase tracking-wide">{speaker.name}</h3>
                                    <p className="text-ted-red text-[10px] font-medium tracking-wide mt-1 leading-tight">{speaker.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder konuşmacılar */}
                    {Array.from({ length: placeholderCount }, (_, i) => (
                        <div key={`ph-${i}`}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:border-ted-red/40 theme-transition">
                            <div style={{ background: 'linear-gradient(135deg, var(--bg-card-alt), var(--bg-secondary))' }}
                                className="aspect-[4/5] relative flex items-center justify-center p-8">
                                <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                                    <div style={{ borderColor: 'var(--text-muted)' }}
                                        className="w-32 h-32 border-4 border-dashed rounded-full animate-[spin_20s_linear_infinite]"></div>
                                    <div className="w-16 h-16 border-2 border-ted-red/50 rounded-full absolute"></div>
                                </div>
                                <div className="relative z-10 text-center w-full">
                                    <div className="w-12 h-1 bg-ted-red mx-auto mb-6"></div>
                                    <h3 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-2 uppercase tracking-wide theme-transition">Açıklanıyor</h3>
                                    <p style={{ color: 'var(--text-muted)' }} className="font-medium text-sm tracking-widest uppercase theme-transition">Bizi Takip Edin</p>
                                    <div style={{ borderTop: '1px solid var(--border-color)' }}
                                        className="mt-8 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-ted-red text-xs uppercase tracking-widest">Takipte Kalın</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    className="mt-20 rounded-2xl p-8 md:p-12 text-center shadow-sm theme-transition">
                    <h3 style={{ color: 'var(--text-primary)' }} className="text-2xl md:text-3xl font-bold mb-4 theme-transition">İlk Öğrenen Siz Olun</h3>
                    <p style={{ color: 'var(--text-secondary)' }} className="mb-8 max-w-xl mx-auto theme-transition">
                        Konuşmacılarımız açıklanmaya devam ediyor! Tüm duyurulardan anında haberdar olmak için bizi sosyal medyadan takip edin.
                    </p>
                    <a href="https://instagram.com/tedxaybu_" target="_blank" rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-ted-red font-bold text-white hover:bg-black hover:text-white transition-colors">
                        Instagram'da Takip Et
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Speakers;
