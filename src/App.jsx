import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Speakers from './pages/Speakers';
import About from './pages/About';
import Sponsors from './pages/Sponsors';
import Team from './pages/Team';
import Performers from './pages/Performers';
import SpecialEvent from './pages/SpecialEvent';
import RegisterTicket from './pages/RegisterTicket';
import GateScanner from './pages/GateScanner';
import AdminDashboard from './pages/AdminDashboard';
import EventRules from './pages/EventRules';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/bilet-al" element={<RegisterTicket />} />
                        <Route path="/kayit" element={<RegisterTicket />} />
                        <Route path="/admin" element={<GateScanner />} />
                        <Route path="/admin/kapi" element={<GateScanner />} />
                        <Route path="/admin/doluluk" element={<AdminDashboard />} />
                        <Route path="/speakers" element={<Speakers />} />
                        <Route path="/performers" element={<Performers />} />
                        <Route path="/ozel-etkinlik" element={<SpecialEvent />} />
                        <Route path="/kurallar" element={<EventRules />} />
                        <Route path="/etkinlik-kurallari" element={<EventRules />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/sponsors" element={<Sponsors />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App;
