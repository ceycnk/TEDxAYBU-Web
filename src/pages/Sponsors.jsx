import React from 'react';

const Sponsors = () => {
    // En üstte ortalanacak 2 ana/öne çıkan sponsor
    const topSponsors = [
        {
            name: "Athletic House Academy",
            category: "Ana Sponsor",
            image: "/sponsors/athletic-house-academy.jpeg"
        },
        {
            name: "Roza's Tastes",
            category: "Lezzet Sponsoru",
            image: "/sponsors/rozas-tastes.jpeg"
        },
    ];

    // Aşağıda 4 sütun 2 satır (toplam 8 adet) dizilecek sponsorlar
    const otherSponsors = [
        {
            name: "Pınar Su & İçecek",
            category: "İçecek Sponsoru",
            image: "/sponsors/pinar-su.jpeg"
        },
        {
            name: "New Jersey",
            category: "Kahve Sponsoru",
            image: "/sponsors/new-jersey.jpeg"
        },
        {
            name: "Çiğköfteci Selim Bey",
            category: "Lezzet Sponsoru",
            image: "/sponsors/cigkofteci-selim-bey.jpeg"
        },
        {
            name: "Espresso Check",
            category: "İçecek Sponsoru",
            image: "/sponsors/espresso-check.jpeg"
        },
        {
            name: "Success International",
            category: "Yurt Dışı Eğitim Sponsoru",
            image: "/sponsors/success-international.jpeg"
        },
        {
            name: "Aslan Branda Dijital Baskı Merkezi",
            category: "Baskı & Prodüksiyon Sponsoru",
            image: "/sponsors/aslan-branda.jpeg"
        },
        {
            name: "Tiftikçi",
            category: "Lezzet Sponsoru",
            image: "/sponsors/tiftikci.jpeg"
        },
        {
            name: "Wellcare",
            category: "Ürün Sponsoru",
            image: "/sponsors/wellcare-logo.jpeg"
        },
        {
            name: "Cafe Beyoğlu",
            category: "Lezzet Sponsoru",
            image: "/sponsors/cafe-beyoglu.jpeg"
        },
    ];

    const renderCard = (sponsor, idx) => (
        <div
            key={idx}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-ted-red/50 flex flex-col theme-transition"
        >
            {/* Görsel Alanı (Post / Poster Formülü 4:5 oranında) */}
            <div className="aspect-[4/5] relative overflow-hidden bg-black/5 dark:bg-black/30">
                <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="w-8 h-0.5 bg-ted-red mb-2"></div>
                    <h3 className="text-white text-lg font-bold uppercase tracking-wide leading-snug">
                        {sponsor.name}
                    </h3>
                    <p className="text-ted-red text-xs font-semibold tracking-wider uppercase mt-1">
                        {sponsor.category}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="pt-20 min-h-screen theme-transition">

            {/* Header */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-20 relative overflow-hidden theme-transition">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ted-red/5 rounded-full blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block mb-4 px-4 py-1 border border-ted-red/40 rounded-full bg-ted-red/10 text-ted-red font-mono text-sm tracking-widest uppercase">
                        TEDxAYBU 2026 Destekçileri
                    </div>
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase theme-transition">
                        Sponsorlar
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mx-auto mb-8"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-2xl mx-auto font-light theme-transition">
                        Fikirlerin gücüne inanan ve etkinliğimizin gerçekleşmesini sağlayan değerli partnerlerimiz ve sponsorlarımız.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 space-y-12">

                {/* En Üstte Yan Yana Ortalanmış 2 Sponsor (Athletic House Academy & Roza's Tastes) */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
                        {topSponsors.map((sponsor, idx) => renderCard(sponsor, `top-${idx}`))}
                    </div>
                </div>

                {/* Diğer Sponsorlar (3x3 Dengeli Dizilim) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pt-4">
                    {otherSponsors.map((sponsor, idx) => renderCard(sponsor, `other-${idx}`))}
                </div>

                {/* CTA */}
                <div style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card))', border: '1px solid var(--border-color)' }}
                    className="mt-28 text-center py-16 px-6 rounded-2xl shadow-sm max-w-4xl mx-auto theme-transition">
                    <h3 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold mb-4 theme-transition">Sponsorumuz Olun</h3>
                    <p style={{ color: 'var(--text-secondary)' }} className="mb-8 max-w-xl mx-auto theme-transition">
                        TEDxAYBU sahnesinde fikirlerin geniş kitlelere ulaşmasına destek olmak ve markanızı vizyoner bir toplulukla buluşturmak için bizimle iletişime geçin.
                    </p>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSd1tzyn2uQoe5VC63DCg3JMLDWlbpUOr5GtAp4FqGnbDF0Cig/viewform?usp=sharing&ouid=109183001168161635058"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-ted-red font-bold text-white hover:bg-black hover:text-white transition-colors rounded-lg shadow-md hover:shadow-lg">
                        Sponsorluk Başvurusu Yap
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sponsors;
