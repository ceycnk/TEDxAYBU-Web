import React from 'react';

const Performers = () => {
    const realPerformers = [
        { name: "ATLAS", image: "/performers/ATLAS.jpeg", role: "Müzik Eğitmeni ve Yapımcısı" },
        { name: "Mevsim Toprak", image: "/performers/mevsim-toprak.jpeg", role: "Müzisyen" },
        { name: "Anı Sayra Kocaer", image: "/performers/ani-sayra-kocaer.jpeg", role: "Keman Sanatçısı | Besteci | Solist" },
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
                        Canlı Performans
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase theme-transition">
                        Sahne <span className="text-ted-red">Sanatçıları</span>
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mb-8 mx-auto md:mx-0"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-2xl font-light theme-transition">
                        Müzik performanslarıyla sahneyi renklendiren sanatçılarımızla tanışın.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Gerçek sanatçılar */}
                    {realPerformers.map((performer, idx) => (
                        <div key={idx}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:border-ted-red/40 theme-transition">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={performer.image}
                                    alt={performer.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="w-8 h-0.5 bg-ted-red mb-3"></div>
                                    <h3 className="text-white text-xl font-bold uppercase tracking-wide">{performer.name}</h3>
                                    <p className="text-ted-red text-xs font-medium tracking-widest uppercase mt-1">{performer.role || 'TEDxAYBU 2026'}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder sanatçılar */}
                    {Array.from({ length: placeholderCount }, (_, i) => (
                        <div key={`ph-${i}`}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:border-ted-red/40 theme-transition">
                            <div style={{ background: 'linear-gradient(135deg, var(--bg-card-alt), var(--bg-secondary))' }}
                                className="aspect-[4/5] relative flex items-center justify-center p-8">
                                <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                                    <div style={{ borderColor: 'var(--text-muted)' }}
                                        className="w-32 h-32 border-4 border-dashed rounded-full animate-[spin_25s_linear_infinite]"></div>
                                    <div className="w-16 h-16 border-2 border-ted-red/50 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
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
                    <h3 style={{ color: 'var(--text-primary)' }} className="text-2xl md:text-3xl font-bold mb-4 theme-transition">Tüm Duyurulardan Haberdar Olun</h3>
                    <p style={{ color: 'var(--text-secondary)' }} className="mb-8 max-w-xl mx-auto theme-transition">
                        Sahne sanatçılarımız açıklanmaya devam ediyor! Anında haberdar olmak için bizi sosyal medyadan takip edin.
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

export default Performers;
