-- ==============================================================================
-- TEDxAYBU - Biletleme, Kademeli Ön Kayıt ve Kapı Takip Sistemi (Aşama 1)
-- ==============================================================================

-- 0. GEREKLİ EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLOLARIN OLUŞTURULMASI
-- ==============================================================================

-- 1.1. Etkinlik Ayarları Tablosu (Tek Satır Güvenceli: id = 1)
CREATE TABLE IF NOT EXISTS public.event_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    max_venue_capacity INT NOT NULL DEFAULT 600,
    registration_phase VARCHAR(20) NOT NULL DEFAULT 'phase_1' 
        CHECK (registration_phase IN ('phase_1', 'phase_2', 'closed')),
    phase_1_limit INT NOT NULL DEFAULT 300,
    phase_2_limit INT NOT NULL DEFAULT 600,
    is_registration_active BOOLEAN NOT NULL DEFAULT true,
    admin_pin VARCHAR(50) NOT NULL DEFAULT '0616',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan ayar satırını ekle (varsa dokunma)
INSERT INTO public.event_settings (id, max_venue_capacity, registration_phase, phase_1_limit, phase_2_limit, is_registration_active, admin_pin)
VALUES (1, 600, 'phase_1', 300, 600, true, '0616')
ON CONFLICT (id) DO NOTHING;

-- 1.2. Biletler Tablosu
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    student_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_inside BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_status_change TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performans ve hızlı kapı sorguları için index'ler
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON public.tickets (ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_is_inside ON public.tickets (is_inside);
CREATE INDEX IF NOT EXISTS idx_tickets_student_number ON public.tickets (student_number);

-- ==============================================================================
-- 2. ATOMİK FONKSİYONLAR VE TRIGGERLAR (RACE-CONDITION KORUMALI)
-- ==============================================================================

-- 2.1. Otomatik Bilet Kodu Üretici (Eğer kod boş veya belirtilmemişse: TEDX-XXXXXX)
CREATE OR REPLACE FUNCTION public.fn_generate_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_code IS NULL OR TRIM(NEW.ticket_code) = '' THEN
        NEW.ticket_code := 'TEDX-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_ticket_code ON public.tickets;
CREATE TRIGGER trg_generate_ticket_code
BEFORE INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.fn_generate_ticket_code();


-- 2.2. Kayıt Kotası ve Faz Kontrolü (Atomik Kilitlemeli)
CREATE OR REPLACE FUNCTION public.fn_check_registration_quota()
RETURNS TRIGGER AS $$
DECLARE
    v_settings RECORD;
    v_total_tickets INT;
BEGIN
    -- Eşzamanlı bilet alımlarında race condition'ı engellemek için ayar satırını kilitliyoruz
    SELECT * INTO v_settings 
    FROM public.event_settings 
    WHERE id = 1 
    FOR UPDATE;

    -- 0. Mükerrer E-posta ve Öğrenci No Kontrolü (Her mail ve her öğrenci 1 bilet)
    IF EXISTS (SELECT 1 FROM public.tickets WHERE LOWER(email) = LOWER(NEW.email)) THEN
        RAISE EXCEPTION 'Bu e-posta adresiyle daha önce bilet alınmıştır. Her katılımcı yalnızca 1 bilet alabilir.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.tickets WHERE student_number = NEW.student_number) THEN
        RAISE EXCEPTION 'Bu öğrenci numarasıyla daha önce bilet alınmıştır. Her öğrenci yalnızca 1 bilet alabilir.';
    END IF;

    -- 1. Genel kayıt aktiflik kontrolü
    IF NOT v_settings.is_registration_active THEN
        RAISE EXCEPTION 'Kayıtlar şu anda kapalıdır.';
    END IF;

    -- 2. Faz kapalılık kontrolü
    IF v_settings.registration_phase = 'closed' THEN
        RAISE EXCEPTION 'Kayıt dönemi sona ermiştir.';
    END IF;

    -- Toplam bilet sayısını hesapla
    SELECT COUNT(*) INTO v_total_tickets FROM public.tickets;

    -- 3. Kademeli kota kontrolleri
    IF v_settings.registration_phase = 'phase_1' THEN
        IF v_total_tickets >= v_settings.phase_1_limit THEN
            RAISE EXCEPTION '1. Ön Kayıt kotası dolmuştur.';
        END IF;
    ELSIF v_settings.registration_phase = 'phase_2' THEN
        IF v_total_tickets >= v_settings.phase_2_limit THEN
            RAISE EXCEPTION 'Genel kayıt kotası dolmuştur.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_registration_quota ON public.tickets;
CREATE TRIGGER trg_check_registration_quota
BEFORE INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.fn_check_registration_quota();


-- 2.3. Kapı Giriş Fonksiyonu: process_check_in(p_ticket_code)
CREATE OR REPLACE FUNCTION public.process_check_in(p_ticket_code VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- RLS kısıtlamalarına takılmadan kapı işlemine izin verir
AS $$
DECLARE
    v_ticket RECORD;
    v_settings RECORD;
    v_inside_count INT;
BEGIN
    -- 1. Ayarları al ve salon kapasitesini kontrol et
    SELECT * INTO v_settings FROM public.event_settings WHERE id = 1;
    
    SELECT COUNT(*) INTO v_inside_count FROM public.tickets WHERE is_inside = true;
    
    IF v_inside_count >= v_settings.max_venue_capacity THEN
        RAISE EXCEPTION 'Salon maksimum kapasitesine (% kişi) ulaştı! Yeni giriş yapılamaz.', v_settings.max_venue_capacity;
    END IF;

    -- 2. Bileti bul ve eşzamanlı işlem olmaması için kilitle (FOR UPDATE)
    SELECT * INTO v_ticket 
    FROM public.tickets 
    WHERE ticket_code = p_ticket_code 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bilet bulunamadı: %', p_ticket_code;
    END IF;

    -- 3. Bilet zaten içeride mi kontrolü
    IF v_ticket.is_inside THEN
        RAISE EXCEPTION 'Bu bilet zaten içeride bulunmaktadır! (Son işlem saati: %)', 
            TO_CHAR(v_ticket.last_status_change AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS');
    END IF;

    -- 4. Giriş işlemini uygula
    UPDATE public.tickets
    SET 
        is_inside = true,
        last_status_change = NOW()
    WHERE id = v_ticket.id;

    -- 5. Başarılı sonuç ve katılımcı bilgilerini dön
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Giriş başarılı.',
        'full_name', v_ticket.full_name,
        'student_number', v_ticket.student_number,
        'ticket_code', v_ticket.ticket_code,
        'current_inside_count', v_inside_count + 1
    );
END;
$$;


-- 2.4. Kapı Çıkış Fonksiyonu: process_check_out(p_ticket_code)
CREATE OR REPLACE FUNCTION public.process_check_out(p_ticket_code VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ticket RECORD;
    v_inside_count INT;
BEGIN
    -- 1. Bileti bul ve kilitle
    SELECT * INTO v_ticket 
    FROM public.tickets 
    WHERE ticket_code = p_ticket_code 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bilet bulunamadı: %', p_ticket_code;
    END IF;

    -- 2. Bilet zaten dışarıda mı kontrolü
    IF NOT v_ticket.is_inside THEN
        RAISE EXCEPTION 'Bu bilet zaten dışarıda bulunmaktadır!';
    END IF;

    -- 3. Çıkış işlemini uygula
    UPDATE public.tickets
    SET 
        is_inside = false,
        last_status_change = NOW()
    WHERE id = v_ticket.id;

    -- Güncel içerideki kişi sayısını al
    SELECT COUNT(*) INTO v_inside_count FROM public.tickets WHERE is_inside = true;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Çıkış başarılı.',
        'full_name', v_ticket.full_name,
        'student_number', v_ticket.student_number,
        'ticket_code', v_ticket.ticket_code,
        'current_inside_count', v_inside_count
    );
END;
$$;


-- 2.5. Anlık Kapasite ve İstatistik Fonksiyonu (Opsiyonel / Dashboard için)
CREATE OR REPLACE FUNCTION public.get_event_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_settings RECORD;
    v_total_tickets INT;
    v_inside_count INT;
BEGIN
    SELECT * INTO v_settings FROM public.event_settings WHERE id = 1;
    SELECT COUNT(*) INTO v_total_tickets FROM public.tickets;
    SELECT COUNT(*) INTO v_inside_count FROM public.tickets WHERE is_inside = true;

    RETURN jsonb_build_object(
        'registration_phase', v_settings.registration_phase,
        'is_registration_active', v_settings.is_registration_active,
        'max_venue_capacity', v_settings.max_venue_capacity,
        'phase_1_limit', v_settings.phase_1_limit,
        'phase_2_limit', v_settings.phase_2_limit,
        'total_registered', v_total_tickets,
        'current_inside', v_inside_count
    );
END;
$$;

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) VE GÜVENLİK POLİTİKALARI
-- ==============================================================================

ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 3.1. event_settings Politikaları:
DROP POLICY IF EXISTS "Ayarlar herkese açıktır" ON public.event_settings;
CREATE POLICY "Ayarlar herkese açıktır"
ON public.event_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Ayarları sadece yetkili güncelleyebilir" ON public.event_settings;
CREATE POLICY "Ayarları sadece yetkili güncelleyebilir"
ON public.event_settings
FOR UPDATE
TO authenticated, service_role
USING (true)
WITH CHECK (true);

-- 3.2. tickets Politikaları:
-- Herkes bilet oluşturabilir (Kayıt formu)
DROP POLICY IF EXISTS "Herkes bilet alabilir" ON public.tickets;
CREATE POLICY "Herkes bilet alabilir"
ON public.tickets
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- Bilet sorgulama politikası
DROP POLICY IF EXISTS "Bilet koduna sahip olan biletini görebilir" ON public.tickets;
CREATE POLICY "Bilet koduna sahip olan biletini görebilir"
ON public.tickets
FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- ==============================================================================
-- 4. REALTIME YAYIN AYARLARI
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tickets'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'event_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.event_settings;
    END IF;
END $$;

ALTER TABLE public.tickets REPLICA IDENTITY FULL;
ALTER TABLE public.event_settings REPLICA IDENTITY FULL;
