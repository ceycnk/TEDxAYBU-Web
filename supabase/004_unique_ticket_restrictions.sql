-- ==============================================================================
-- TEDxAYBU - Mükerrer Kayıt Engeli (Her Mail ve Her Öğrenci No 1 Bilet)
-- ==============================================================================

-- 1. Benzersizlik İndeksleri
CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_unique_email ON public.tickets (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_unique_student_number ON public.tickets (student_number);

-- 2. Trigger Fonksiyonunun Güncellenmesi (Atomik Hata Fırlatma)
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

    -- 1. Mükerrer Kayıt Kontrolleri
    IF EXISTS (SELECT 1 FROM public.tickets WHERE LOWER(email) = LOWER(NEW.email)) THEN
        RAISE EXCEPTION 'Bu e-posta adresiyle daha önce bilet alınmıştır. Her katılımcı yalnızca 1 bilet alabilir.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.tickets WHERE student_number = NEW.student_number) THEN
        RAISE EXCEPTION 'Bu öğrenci numarasıyla daha önce bilet alınmıştır. Her öğrenci yalnızca 1 bilet alabilir.';
    END IF;

    -- 2. Genel kayıt aktiflik kontrolü
    IF NOT v_settings.is_registration_active THEN
        RAISE EXCEPTION 'Kayıtlar şu anda kapalıdır.';
    END IF;

    -- 3. Faz kapalılık kontrolü
    IF v_settings.registration_phase = 'closed' THEN
        RAISE EXCEPTION 'Kayıt dönemi sona ermiştir.';
    END IF;

    -- Toplam bilet sayısını hesapla
    SELECT COUNT(*) INTO v_total_tickets FROM public.tickets;

    -- 4. Kademeli kota kontrolleri
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
