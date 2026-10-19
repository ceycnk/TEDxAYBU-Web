import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme } = useTheme();

    return (
        <footer style={{ backgroundColor: 'var(--bg-footer)', borderTop: '1px solid var(--border-color)' }}
            className="py-8 theme-transition">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="grid items-center">
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
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm max-w-xs text-center md:text-left theme-transition">
                            Gördüğüne yetinme. Düşün, sorgula, keşfet. Gerçek fikirler yüzeyin altında saklıdır.
                        </p>
                    </div>

                    <div style={{ color: 'var(--text-muted)' }} className="flex flex-col items-center md:items-end gap-2 text-sm theme-transition">
                        <p style={{ color: 'var(--text-secondary)' }} className="font-semibold tracking-wider theme-transition">İLETİŞİM</p>
                        <a href="mailto:tedxaybu@gmail.com"
                            style={{ color: 'var(--text-primary)' }}
                            className="hover:text-ted-red transition-colors duration-300 text-lg font-medium theme-transition">
                            tedxaybu@gmail.com
                        </a>
                        <p className="mt-6 break-words text-center md:text-right text-ted-red font-medium">Bu bağımsız bir etkinliktir.</p>
                        <p style={{ color: 'var(--text-muted)' }}>This is an independent TEDx event.</p>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                    className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs theme-transition">
                    <p>&copy; {currentYear} TEDxAYBU. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6">
                        <a href="https://instagram.com/tedxaybu_" target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--text-muted)' }}
                            className="hover:text-ted-red transition-colors duration-200 uppercase tracking-widest font-bold">Instagram</a>
                        <a href="https://linkedin.com/company/tedxaybu" target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--text-muted)' }}
                            className="hover:text-ted-red transition-colors duration-200 uppercase tracking-widest font-bold">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
