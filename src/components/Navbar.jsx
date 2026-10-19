import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { name: 'Anasayfa', path: '/' },
        { name: 'Bilet Al', path: '/bilet-al', isButton: true },
        { name: 'Konuşmacılar', path: '/speakers' },
        { name: 'Sahne Sanatçıları', path: '/performers' },
        { name: 'Özel Etkinlik', path: '/ozel-etkinlik' },
        { name: 'Kurallar', path: '/kurallar' },
        { name: 'Hakkımızda', path: '/about' },
        { name: 'Ekibimiz', path: '/team' },
        { name: 'Sponsorlar', path: '/sponsors' },
    ];

    const handleLinkClick = () => setIsOpen(false);

    return (
        <header style={{
            backgroundColor: 'var(--bg-navbar)',
            borderBottom: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }} className="sticky top-0 z-50 w-full theme-transition">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="grid items-center" onClick={handleLinkClick}>
                            <img
                                src="/logo-dark.png"
                                alt="TEDxAYBU Dark"
                                className={`col-start-1 row-start-1 w-auto object-contain transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                style={{ height: '36px', maxHeight: '36px' }}
                            />
                            <img
                                src="/logo-light.png"
                                alt="TEDxAYBU Light"
                                className={`col-start-1 row-start-1 w-auto object-contain transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                style={{ height: '48px', maxHeight: '48px' }}
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-3 mr-2 sm:mr-4">
                        <nav className="flex items-center space-x-3 xl:space-x-4">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                if (link.special || link.isButton) {
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className="transition-all duration-300 px-3.5 py-1.5 text-xs xl:text-sm font-bold uppercase tracking-widest text-white rounded-full hover:opacity-90 shadow-sm"
                                            style={{
                                                backgroundColor: '#EB0028',
                                                border: '1px solid #EB0028',
                                                opacity: isActive ? 1 : 0.95,
                                                boxShadow: isActive ? '0 0 12px rgba(235, 0, 40, 0.4)' : 'none',
                                            }}
                                        >
                                            {link.special ? `✨ ${link.name}` : link.name}
                                        </Link>
                                    );
                                }
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        style={{ color: isActive ? '#EB0028' : 'var(--text-secondary)' }}
                                        className="transition-colors duration-300 px-2 py-2 text-xs xl:text-sm font-bold uppercase tracking-widest hover:opacity-100"
                                        onMouseEnter={e => { if (!isActive) e.target.style.color = 'var(--text-primary)'; }}
                                        onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--text-secondary)'; }}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Theme Toggle - Sola Çekilmiş & Dengeli */}
                        <div className="h-5 w-[1px] bg-zinc-400/30 mx-1"></div>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            style={{ color: 'var(--text-secondary)' }}
                            className="p-2 rounded-xl border border-zinc-500/20 hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none cursor-pointer theme-transition"
                            aria-label="Temayı Değiştir"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
                        </button>
                    </div>

                    {/* Mobile buttons */}
                    <div className="flex lg:hidden items-center gap-2 mr-1 sm:mr-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            style={{ color: 'var(--text-secondary)' }}
                            className="p-2 rounded-xl border border-zinc-500/20 hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none cursor-pointer"
                            aria-label="Temayı Değiştir"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            style={{ color: 'var(--text-secondary)' }}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-black/10 focus:outline-none cursor-pointer transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}
                    className="lg:hidden absolute w-full theme-transition">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            if (link.isButton || link.special) {
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        style={{
                                            backgroundColor: '#EB0028',
                                            color: '#ffffff',
                                        }}
                                        className="block px-4 py-3 mx-2 my-1 rounded-xl text-base font-bold uppercase tracking-widest text-center shadow-md transition-opacity hover:opacity-90"
                                        onClick={handleLinkClick}
                                    >
                                        {link.special ? `✨ ${link.name}` : link.name}
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    style={{
                                        color: isActive ? '#EB0028' : 'var(--text-secondary)',
                                        backgroundColor: isActive ? 'var(--bg-card-alt)' : 'transparent',
                                    }}
                                    className="block px-3 py-3 rounded-md text-base font-bold uppercase tracking-widest text-center transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
