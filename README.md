# 🎙️ TEDxAYBU Official Web Platform & Event Operations System

An end-to-end event management, digital ticketing, and operations platform developed for **TEDxAYBU**. This platform manages the complete attendee lifecycle — from multi-phase ticket registration and automated QR ticket email delivery to live physical gate check-in/check-out scanning, real-time venue occupancy analytics, and administrative Excel reporting.

---

## ✨ Features

- **🎨 Modern & Responsive Frontend:**
  - High-performance UI built with React 18, Vite, and Tailwind CSS.
  - Smooth animations, dark/light theme toggle, and mobile-first design.
  - Dedicated pages for Speakers, Performers, Team, Sponsors, Event Flow, and Venue Rules.

- **🎟️ Smart Ticket Registration System:**
  - Phase-based capacity control (Early Registration, Phase 1, Phase 2, Event Day quotas).
  - Anti-duplicate logic ensuring one unique ticket per student number / national ID and email.
  - Instant dynamic QR code generation embedded into tickets.

- **📧 Automated Email Delivery (EmailJS Integration):**
  - Instant dispatch of personalized tickets with QR codes directly to attendees' email addresses.
  - Seamless fallback simulation in development mode.

- **📱 Gate Entry/Exit QR Scanner:**
  - Fast, real-time barcode/QR scanner integration (supporting cameras and external optical readers).
  - Real-time attendee verification with sound and visual feedback (Green = Valid, Red = Already used / Invalid).
  - Dynamic inside/outside venue presence tracking.

- **📊 Comprehensive Admin & Analytics Dashboard:**
  - Real-time metrics: Total registrations, checked-in attendees, currently inside venue, remaining quota.
  - Filterable attendee table with instant search (name, email, ticket code, status).
  - One-click bulk reset for venue presence.
  - **Excel (XLSX) Export:** Complete export of attendee records including check-in/out timestamps and contact details for post-event reporting.

---

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router 6](https://reactrouter.com/)
- **Icons & UI:** [Lucide Icons](https://lucide.dev/)
- **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & Realtime)
- **Email Service:** [EmailJS](https://www.emailjs.com/)
- **QR Engine:** [qr-scanner](https://github.com/nimiq/qr-scanner) / [qrcode.react](https://github.com/zpao/qrcode.react)
- **Reporting:** [SheetJS (xlsx)](https://sheetjs.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tedxaybu.git
   cd tedxaybu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and EmailJS credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxx_xxxxxxx
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy

This repository is sanitized in accordance with data privacy best practices (KVKK / GDPR):
- **Zero Secrets in Source Code:** API keys and credentials are strictly managed via environment variables and excluded from version control.
- **Data Protection:** Real attendee records, personal contact data, and active ticket hashes are strictly ignored via `.gitignore` and are never committed to public repositories.

---

## 📄 License

This project is licensed under the MIT License.
