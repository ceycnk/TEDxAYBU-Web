-- ==============================================================================
-- TEDxAYBU - 3. Aşama: Yönetim ve Manuel Kalibrasyon Fonksiyonları
-- ==============================================================================

-- 1. Ayarları Güncelleme İzni (PIN Korumalı / Anonim Yönetim)
DROP POLICY IF EXISTS "Ayarları sadece yetkili güncelleyebilir" ON public.event_settings;
CREATE POLICY "Ayarları sadece yetkili güncelleyebilir"
ON public.event_settings
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 2. Faz Değiştirme Fonksiyonu (Tek Tıkla Geçiş)
CREATE OR REPLACE FUNCTION public.admin_update_phase(p_pin VARCHAR, p_phase VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_pin VARCHAR;
    v_is_active BOOLEAN;
BEGIN
    SELECT admin_pin INTO v_current_pin FROM public.event_settings WHERE id = 1;
    
    IF v_current_pin IS NULL OR v_current_pin <> p_pin THEN
        RAISE EXCEPTION 'Geçersiz PIN kodu!';
    END IF;

    IF p_phase NOT IN ('phase_1', 'phase_2', 'closed') THEN
        RAISE EXCEPTION 'Geçersiz faz değeri!';
    END IF;

    v_is_active := (p_phase <> 'closed');

    UPDATE public.event_settings
    SET 
        registration_phase = p_phase,
        is_registration_active = v_is_active,
        updated_at = NOW()
    WHERE id = 1;

    RETURN jsonb_build_object(
        'success', true,
        'registration_phase', p_phase,
        'is_registration_active', v_is_active
    );
END;
$$;

-- 3. Manuel Giriş/Çıkış Kalibrasyonu (+1 / -1)
-- Katılımcı çıkarken QR okutmadıysa içerideki sayıyı 1 azaltır veya arttırır
CREATE OR REPLACE FUNCTION public.manual_adjust_inside(p_pin VARCHAR, p_delta INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_pin VARCHAR;
    v_ticket_id UUID;
    v_inside_count INT;
BEGIN
    SELECT admin_pin INTO v_current_pin FROM public.event_settings WHERE id = 1;
    
    IF v_current_pin IS NULL OR v_current_pin <> p_pin THEN
        RAISE EXCEPTION 'Geçersiz PIN kodu!';
    END IF;

    IF p_delta < 0 THEN
        -- İçerideki sayıyı 1 azalt: En eski içeride olan bileti bul ve dışarı çıkar
        SELECT id INTO v_ticket_id
        FROM public.tickets
        WHERE is_inside = true
        ORDER BY last_status_change ASC
        LIMIT 1;

        IF v_ticket_id IS NOT NULL THEN
            UPDATE public.tickets
            SET is_inside = false, last_status_change = NOW()
            WHERE id = v_ticket_id;
        END IF;
    ELSIF p_delta > 0 THEN
        -- İçerideki sayıyı 1 arttır: Dışarıda olan bir bileti içeri al
        SELECT id INTO v_ticket_id
        FROM public.tickets
        WHERE is_inside = false
        ORDER BY last_status_change ASC
        LIMIT 1;

        IF v_ticket_id IS NOT NULL THEN
            UPDATE public.tickets
            SET is_inside = true, last_status_change = NOW()
            WHERE id = v_ticket_id;
        END IF;
    END IF;

    SELECT COUNT(*) INTO v_inside_count FROM public.tickets WHERE is_inside = true;

    RETURN jsonb_build_object(
        'success', true,
        'delta', p_delta,
        'current_inside_count', v_inside_count
    );
END;
$$;
