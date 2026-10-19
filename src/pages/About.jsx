import React from 'react';

const About = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="pt-20 min-h-screen theme-transition">

            {/* Header */}
            <div style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-24 relative overflow-hidden theme-transition">
                <div className="absolute -left-32 -top-32 w-96 h-96 bg-ted-red/5 rounded-full blur-[128px]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase theme-transition">
                        Hakkımızda
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mx-auto mb-8"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-3xl mx-auto font-light leading-relaxed theme-transition">
                        "Paylaşmaya Değer Fikirler" (Ideas Worth Spreading) şiarıyla yola çıkan TED'in bağımsız organize edilen yerel ayağıdır.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-24 space-y-32">

                {/* TEDx Nedir? */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        className="h-[300px] rounded-2xl shadow-sm relative overflow-hidden group flex items-center justify-center theme-transition">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span style={{ color: 'var(--text-primary)' }} className="text-5xl font-extrabold tracking-tighter theme-transition">
                                <span className="text-ted-red">TEDx</span>
                            </span>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wide theme-transition">TEDx Nedir?</h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-lg leading-relaxed mb-6 theme-transition">
                            x harfi "bağımsız organize edilen TED etkinliği" anlamına gelmektedir. TEDx etkinlikleri, yerel toplulukların TED ruhunu kendi bölgelerinde yaşatmasını sağlayan yerel ve özgün konferanslardır.
                        </p>
                        <div style={{ backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border-color)' }}
                            className="p-6 rounded-xl shadow-sm mb-6 theme-transition">
                            <h3 style={{ color: 'var(--text-primary)' }} className="font-bold mb-3 uppercase tracking-wider text-sm theme-transition">About TEDx</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed italic border-l-2 border-ted-red pl-4 theme-transition">
                                In the spirit of ideas worth spreading, TED has created a program called TEDx. TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. Our event is called TEDxAYBU, where x = independently organized TED event. At TEDxAYBU, TED Talks video and live speakers will combine to spark deep discussion and connection. Although independently organized, TED provides general guidance for the TEDx program.
                            </p>
                        </div>
                        <p className="text-ted-red font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-ted-red inline-block"></span>
                            Bağımsız bir etkinliktir.
                        </p>
                    </div>
                </div>

                {/* TEDxAYBU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wide theme-transition">TEDxAYBU</h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-lg leading-relaxed mb-6 theme-transition">
                            Ankara Yıldırım Beyazıt Üniversitesi (AYBÜ) bünyesinde düzenlenen TEDxAYBU, öğrenciler ve akademisyenler başta olmak üzere tüm katılımcılara ilham verici fikirleri sunmayı amaçlar.
                        </p>
                    </div>
                    <div style={{ border: '1px solid var(--border-color)' }}
                        className="order-1 md:order-2 h-[350px] rounded-2xl shadow-md relative overflow-hidden group theme-transition">
                        <img
                            src="/aybu.jpeg"
                            alt="Ankara Yıldırım Beyazıt Üniversitesi"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-ted-red/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
                                className="text-center p-6 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">
                                    Ankara Yıldırım Beyazıt Üniversitesi
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
