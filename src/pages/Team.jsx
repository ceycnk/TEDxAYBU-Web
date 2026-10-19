import React from 'react';

const Team = () => {
    const teamMembers = [
        { name: "Zeynep Keten", leads: ["Lead Organizer"], supports: ["Curation"], image: "/team/Zeynep Keten.jpeg" },
        { name: "Işılay Ayaltı", leads: ["Co-Organizer", "Curation", "Budget"], supports: [], image: "/team/Işılay.jpeg" },
        { name: "Ebrar Nisan", leads: ["Co-Organizer", "Marketing & Social Media"], supports: [], image: "/team/Ebrar.jpeg", imageClass: "scale-[1.2] group-hover:scale-[1.25]", objectPosition: "object-bottom" },
        { name: "Zahra Hiva Turan", leads: ["Co-Organizer", "Communication", "Sponsorships & Partnerships"], supports: [], image: "/team/Zahra Hiva Turan.jpeg", objectPosition: "object-top" },
        { name: "Rüveyda Akgül", leads: ["Production", "Sponsorships & Partnerships"], supports: ["Video"], image: "/team/Rüveyda AKGÜL.jpeg" },
        { name: "Rumeysa Ceyda Gümüşok", leads: ["Operations"], supports: ["Entertainment"], image: "/team/Rumeysa Ceyda Gümüşok.jpeg" },
        { name: "Ceyda Çankaya", leads: ["Web"], supports: ["Operations", "Marketing & Social Media"], image: "/team/Ceyda Çankaya.jpeg", imageClass: "scale-[1.2] group-hover:scale-[1.25]" },
        { name: "Hüseyin Saykan", leads: ["Technical"], supports: ["Web", "Budget"], image: "/team/Hüseyin.jpeg" },
        { name: "Zeynep Gül Balcılar", leads: ["Entertainment"], supports: ["Marketing & Social Media"], image: "/team/Zeynep Gül Balcılar.jpeg" },
        { name: "Betül Denizer", leads: ["Design"], supports: [], image: "/team/Betül Denizer.jpeg?v=2" },
        { name: "Melek Başak Tuncer", leads: ["Production"], supports: ["Communication", "Budget"], image: "/team/Başak.jpeg", imageClass: "scale-[1.2] group-hover:scale-[1.25]" },
        { name: "Zeynep Seyyar", leads: ["Video"], supports: ["Operations"], image: "/team/Zeynep Seyyar.jpeg" },
        { name: "Eugeniu Miron", leads: ["Post Production"], supports: [], image: "/team/Eugeniu Miron.jpeg" },
        { name: "Furkan Tüysüz", leads: [], supports: ["Design"], image: "/team/Furkan Tüysüz.jpeg" },
        { name: "Kadir Ata", leads: [], supports: ["Production", "Post Production", "Technical"], image: "/team/Kadir Ata.jpeg" },
        { name: "Murat Etka Çayır", leads: [], supports: ["Design"], image: "/team/Murat Etka Çayır.jpeg" },
        { name: "Dilara Zahide Aydın", leads: [], supports: ["Design"], image: "/team/Dilara Zahide Aydın.jpeg", objectPosition: "object-[center_35%]" },
        { name: "M. Enes Demirci", leads: [], supports: ["Design"], image: "/team/M. Enes Demirci.jpeg" },
    ];

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }} className="pt-20 min-h-screen theme-transition">

            {/* Header */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                className="py-20 relative overflow-hidden theme-transition">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ted-red/5 rounded-full blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 style={{ color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase theme-transition">
                        Ekibimiz
                    </h1>
                    <div className="w-24 h-1.5 bg-ted-red mx-auto mb-8"></div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-2xl mx-auto font-light theme-transition">
                        "Beyond the Surface" temasını hayata geçiren, perde arkasındaki kahramanlarımız.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6 max-w-[90rem] mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={index}
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            className="w-full rounded-2xl shadow-sm hover:border-ted-red/40 transition-all duration-300 overflow-hidden group flex flex-col theme-transition">

                            {/* Photo */}
                            <div style={{ backgroundColor: 'var(--bg-card-alt)', borderBottom: '1px solid var(--border-subtle)' }}
                                className="aspect-square relative flex items-center justify-center overflow-hidden theme-transition">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${member.imageClass || 'scale-100 group-hover:scale-105'} ${member.objectPosition || 'object-center'}`}
                                    />
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }} className="font-mono text-sm">Fotoğraf eklenecek</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-2 sm:p-4 xl:p-5">
                                <h3 style={{ color: 'var(--text-primary)' }} className="text-xs sm:text-lg xl:text-xl font-bold mb-2 sm:mb-3 break-words theme-transition">
                                    {member.name}
                                </h3>
                                <div className="space-y-2 sm:space-y-4">
                                    {member.leads.length > 0 && (
                                        <div>
                                            <h4 style={{ color: 'var(--text-muted)' }} className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 theme-transition">Lead / Yürütücü</h4>
                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                {member.leads.map((role, i) => (
                                                    <span key={i} className="px-1 py-0.5 sm:px-2 sm:py-1 bg-ted-red/10 text-ted-red text-[8px] sm:text-xs font-semibold rounded border border-ted-red/20">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {member.supports.length > 0 && (
                                        <div>
                                            <h4 style={{ color: 'var(--text-muted)' }} className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 mt-2 sm:mt-4 theme-transition">Destek</h4>
                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                {member.supports.map((role, i) => (
                                                    <span key={i}
                                                        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card-alt)' }}
                                                        className="px-1 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-xs font-medium rounded theme-transition">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
